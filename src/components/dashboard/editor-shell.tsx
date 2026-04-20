import { useEffect, useMemo, useRef, useState } from "react";

import { QuizThemePicker } from "@/components/dashboard/quiz-theme-picker";
import { QuizThemeSurface } from "@/components/quiz/quiz-theme-surface";
import { QuestionRenderer } from "@/components/quiz/question-renderer";
import { fetchQuiz, fetchStudentProgress, saveQuiz } from "@/lib/api";
import { getQuizThemePreset } from "@/lib/quiz-themes";
import { getAllQuestions } from "@/lib/quiz";
import type {
  HotspotArea,
  Question,
  QuestionKind,
  Quiz,
  StudentProgress,
  Theme,
} from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; quiz: Quiz; students: StudentProgress[] }
  | { status: "error"; message: string };

type DashboardSection = "overview" | "general" | "theme" | "questions" | "students";
type DashboardMenuItem = {
  section: DashboardSection;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
};
type DashboardMenuGroup = {
  title: string;
  items: DashboardMenuItem[];
};

const inputClass =
  "w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[var(--erg-blue)] focus:bg-white focus:ring-4 focus:ring-[rgb(0_0_139_/_0.08)]";
const emptyStudents: StudentProgress[] = [];

const themeFields: Array<{ key: keyof Theme; label: string; helper: string }> = [
  { key: "pageBackground", label: "Nền trang", helper: "Nền ngoài cùng của màn hình học sinh." },
  { key: "playerBackground", label: "Nền player", helper: "Nền của khung bài làm chính." },
  { key: "canvasBorder", label: "Viền khung", helper: "Màu viền cho khung và vùng nhập." },
  { key: "headerText", label: "Chữ tiêu đề", helper: "Màu chữ trong khối tiêu đề câu hỏi." },
  { key: "accentStart", label: "Accent đầu", helper: "Màu đầu của gradient hành động." },
  { key: "accentEnd", label: "Accent cuối", helper: "Màu cuối của gradient hành động." },
  { key: "optionText", label: "Chữ nội dung", helper: "Màu chữ chính bên trong câu hỏi." },
  { key: "optionSelectedBackground", label: "Nền khi chọn", helper: "Màu nền khi học sinh chọn đáp án." },
  { key: "inputBackground", label: "Nền input", helper: "Màu nền cho input, select và item kéo thả." },
  { key: "sidebarActiveText", label: "Chữ menu active", helper: "Màu chữ khi câu hỏi đang active." },
];

const questionTypeOptions: Array<{ kind: QuestionKind; label: string; description: string }> = [
  { kind: "single_choice", label: "Chọn 1 đáp án", description: "Một đáp án đúng duy nhất." },
  { kind: "multiple_response", label: "Chọn nhiều đáp án", description: "Nhiều đáp án đúng trong cùng câu hỏi." },
  { kind: "matching", label: "Ghép cặp", description: "Ghép hoặc sắp xếp 2 cột tương ứng." },
  { kind: "sequence", label: "Sắp xếp thứ tự", description: "Sắp xếp các bước theo đúng trình tự." },
  { kind: "inline_choice", label: "Chọn trong dòng", description: "Mỗi dòng có ô chọn trước hoặc sau văn bản." },
  { kind: "hotspot", label: "Chọn vị trí trên ảnh", description: "Bấm vào đúng vùng trên hình minh hoạ." },
];

export function DashboardEditorShell() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dashboardQuery, setDashboardQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [quiz, students] = await Promise.all([fetchQuiz("avs-demo"), fetchStudentProgress("avs-demo")]);
        setLoadState({ status: "ready", quiz, students });
        setSelectedQuestionId(getAllQuestions(quiz)[0]?.id ?? "");
      } catch (error) {
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Không thể tải dashboard giáo viên.",
        });
      }
    }

    void load();
  }, []);

  const quiz = loadState.status === "ready" ? loadState.quiz : null;
  const students = loadState.status === "ready" ? loadState.students : emptyStudents;
  const questions = useMemo(() => (quiz ? getAllQuestions(quiz) : []), [quiz]);
  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId) ?? questions[0];
  const selectedQuestionIndex = questions.findIndex((question) => question.id === selectedQuestion?.id);
  const filteredQuestions = useMemo(() => {
    const normalized = dashboardQuery.trim().toLowerCase();
    if (!normalized) return questions;
    return questions.filter((question, index) =>
      `${index + 1}. ${question.title} ${labelForKind(question.kind)}`.toLowerCase().includes(normalized),
    );
  }, [questions, dashboardQuery]);
  const filteredStudents = useMemo(() => {
    const normalized = dashboardQuery.trim().toLowerCase();
    if (!normalized) return students;
    return students.filter((student) =>
      `${student.studentName} ${student.currentQuestionTitle} ${student.status}`.toLowerCase().includes(normalized),
    );
  }, [students, dashboardQuery]);

  function updateQuiz(mutator: (draft: Quiz) => Quiz) {
    if (!quiz) return;
    setLoadState((current) => {
      if (current.status !== "ready") return current;
      return { status: "ready", quiz: mutator(structuredClone(current.quiz)), students: current.students };
    });
  }

  async function handleSave() {
    if (!quiz) return;
    setSaving(true);
    const saved = await saveQuiz(quiz);
    setLoadState((current) => {
      if (current.status !== "ready") {
        return { status: "ready", quiz: saved, students: [] };
      }
      return { status: "ready", quiz: saved, students: current.students };
    });
    setSaveMessage("Đã lưu toàn bộ thay đổi dashboard.");
    setSaving(false);
    window.setTimeout(() => setSaveMessage(""), 2500);
  }

  function addQuestion(kind: QuestionKind) {
    const nextQuestion = createQuestionTemplate(kind, questions.length + 1);
    updateQuiz((draft) => {
      draft.sections[0].questions.push(nextQuestion);
      return draft;
    });
    setSelectedQuestionId(nextQuestion.id);
    setActiveSection("questions");
  }

  function updateThemeField(field: keyof Theme, value: string) {
    updateQuiz((draft) => {
      draft.theme = normalizeTheme({
        ...draft.theme,
        [field]: value,
      });
      return draft;
    });
  }

  if (loadState.status === "loading") {
    return <div className="min-h-screen p-6 text-slate-500">Đang tải dashboard giáo viên...</div>;
  }

  if (loadState.status === "error" || !quiz || !selectedQuestion) {
    return (
      <div className="min-h-screen p-6 text-red-600">
        {loadState.status === "error" ? loadState.message : "Không có quiz để hiển thị."}
      </div>
    );
  }

  const summary = summarizeStudents(students);
  const sidebarGroups: DashboardMenuGroup[] = [
    {
      title: "Dashboard",
      items: [
        {
          section: "overview",
          title: "Tổng quan hệ thống",
          subtitle: "Bức tranh chung của bài thi, theme và lớp học.",
          icon: "DB",
        },
      ],
    },
    {
      title: "Quản lý bài thi",
      items: [
        {
          section: "questions",
          title: "Tạo câu hỏi mới",
          subtitle: "Thêm đầy đủ các type câu hỏi cho bài làm.",
          icon: "Q+",
        },
        {
          section: "questions",
          title: "Ngân hàng câu hỏi",
          subtitle: "Biên tập nội dung, điểm số và hình minh hoạ.",
          icon: "QB",
          badge: `${questions.length} câu`,
        },
        {
          section: "general",
          title: "Cài đặt bài làm",
          subtitle: "Chỉnh mode luyện tập, kiểm tra và quy tắc chấm.",
          icon: "ST",
        },
      ],
    },
    {
      title: "Giao diện học sinh",
      items: [
        {
          section: "theme",
          title: "Theme & màu sắc",
          subtitle: "Chọn preset, sửa màu và lưu lại trên hệ thống.",
          icon: "TH",
          badge: quiz.themeId,
        },
      ],
    },
    {
      title: "Lớp học",
      items: [
        {
          section: "students",
          title: "Theo dõi học sinh",
          subtitle: "Xem học sinh đang làm bài nào và ở câu nào.",
          icon: "HS",
          badge: `${summary.inProgress} đang làm`,
        },
        {
          section: "students",
          title: "Tiến độ & kết quả",
          subtitle: "Theo dõi tỷ lệ hoàn tất, điểm số và trạng thái nộp.",
          icon: "TD",
          badge: `${summary.submitted} đã nộp`,
        },
      ],
    },
  ];
  const activeSectionInfo = sectionMeta(activeSection);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_28%),linear-gradient(180deg,#f8fafc,#eef4ff)] p-3 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-[1760px] gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow-lg)]">
            <div className="flex items-center gap-4 rounded-[28px] border border-[rgb(0_0_139_/_0.08)] bg-[linear-gradient(135deg,#ffffff,#eef4ff)] p-4">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#dbeafe,#ffffff)] text-lg font-black text-[var(--erg-blue)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                ERG
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--erg-blue)]">ERG Learning Admin</p>
                <h1 className="mt-1 line-clamp-2 text-base font-black leading-6 text-slate-900">{quiz.title}</h1>
                <p className="text-sm text-slate-500">Hệ thống soạn đề và vận hành lớp học</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {sidebarGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">{group.title}</p>
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => {
                      const isActive = activeSection === item.section;
                      return (
                        <button
                          key={`${group.title}-${item.title}`}
                          type="button"
                          onClick={() => setActiveSection(item.section)}
                          className={`flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition ${
                            isActive
                              ? "border-[rgb(0_0_139_/_0.14)] bg-[linear-gradient(135deg,#eef4ff,#ffffff)] shadow-[0_14px_30px_rgba(0,0,139,0.08)]"
                              : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`inline-flex h-11 w-11 flex-none items-center justify-center rounded-[16px] text-[11px] font-black uppercase tracking-[0.08em] ${
                              isActive ? "bg-[var(--erg-blue)] text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <strong className="text-sm font-black text-slate-900">{item.title}</strong>
                              {item.badge ? (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                                  {item.badge}
                                </span>
                              ) : null}
                            </span>
                            <small className="text-xs leading-5 text-slate-500">{item.subtitle}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Tóm tắt nhanh</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniMetric label="Câu hỏi" value={String(questions.length)} />
                <MiniMetric label="Theme" value={quiz.themeId} compact />
                <MiniMetric label="Đang làm" value={String(summary.inProgress)} />
                <MiniMetric label="Đã nộp" value={String(summary.submitted)} />
              </div>
            </div>

            <div className="mt-4 rounded-[24px] bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] p-4 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">Phiên làm việc</p>
              <div className="mt-3 text-lg font-black">{activeSectionInfo.title}</div>
              <p className="mt-2 text-sm leading-6 text-white/70">{activeSectionInfo.description}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <header className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Quản trị / E-Learning / {activeSectionInfo.title}
                </p>
                <h2 className="mt-3 text-3xl font-black leading-none text-slate-900">{activeSectionInfo.title}</h2>
                <p className="mt-3 max-w-[720px] text-sm leading-6 text-slate-500">{activeSectionInfo.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="relative min-w-[260px] flex-1 xl:min-w-[340px]">
                  <input
                    className={`${inputClass} pr-10`}
                    value={dashboardQuery}
                    onChange={(event) => setDashboardQuery(event.target.value)}
                    placeholder="Tìm câu hỏi, học sinh, trạng thái..."
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:border-[var(--erg-blue)] hover:text-[var(--erg-blue)]"
                >
                  Xem giao diện học sinh
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSave()}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--erg-blue)] px-5 text-sm font-black text-white shadow-[0_18px_40px_rgba(0,0,139,0.16)] transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu dashboard"}
                </button>
              </div>
            </div>

            {saveMessage ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{saveMessage}</div>
            ) : null}
          </header>

          {activeSection === "overview" ? (
            <OverviewSection
              quiz={quiz}
              questions={questions}
              students={filteredStudents}
              summary={summary}
              onGo={setActiveSection}
            />
          ) : null}

          {activeSection === "general" ? (
            <GeneralSettingsSection quiz={quiz} updateQuiz={updateQuiz} />
          ) : null}

          {activeSection === "theme" ? (
            <ThemeSection
              quiz={quiz}
              onSelectTheme={(themeId) =>
                updateQuiz((draft) => {
                  const preset = getQuizThemePreset(themeId);
                  draft.themeId = preset.id;
                  draft.theme = normalizeTheme({ ...preset.theme });
                  return draft;
                })
              }
              onUpdateThemeField={updateThemeField}
            />
          ) : null}

          {activeSection === "questions" ? (
            <QuestionsSection
              questions={filteredQuestions}
              allQuestions={questions}
              selectedQuestion={selectedQuestion}
              selectedQuestionId={selectedQuestionId}
              setSelectedQuestionId={setSelectedQuestionId}
              addQuestion={addQuestion}
              updateQuiz={updateQuiz}
            />
          ) : null}

          {activeSection === "students" ? (
            <StudentsSection students={filteredStudents} summary={summary} />
          ) : null}
        </div>
      </div>

      {previewOpen ? (
        <StudentPreviewModal
          quiz={quiz}
          question={selectedQuestion}
          questionIndex={selectedQuestionIndex}
          totalQuestions={questions.length}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </div>
  );
}

function OverviewSection({
  quiz,
  questions,
  students,
  summary,
  onGo,
}: {
  quiz: Quiz;
  questions: Question[];
  students: StudentProgress[];
  summary: ReturnType<typeof summarizeStudents>;
  onGo: (section: DashboardSection) => void;
}) {
  const recentStudents = [...students].sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt)).slice(0, 5);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Tổng câu hỏi" value={String(questions.length)} helper="Toàn bộ câu hỏi đang dùng trong quiz." tone="blue" />
        <MetricCard label="Đang làm bài" value={String(summary.inProgress)} helper="Số học sinh đang hoạt động trong lúc này." />
        <MetricCard label="Đã nộp" value={String(summary.submitted)} helper="Số học sinh đã hoàn tất và có kết quả." />
        <MetricCard label="Điểm trung bình" value={`${summary.averageScore}%`} helper="Tính trên các bài đã nộp." tone="dark" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Tiến độ lớp học</p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Bức tranh toàn cảnh</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              {quiz.settings.mode === "training" ? "Luyện tập" : "Kiểm tra"}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ProgressCard title="Đang làm bài" value={summary.inProgress} accent="bg-amber-400" />
            <ProgressCard title="Đã nộp bài" value={summary.submitted} accent="bg-emerald-500" />
            <ProgressCard title="Chưa bắt đầu" value={summary.notStarted} accent="bg-slate-400" />
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-black text-slate-800">Mục tiêu đạt bài</div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[linear-gradient(135deg,var(--erg-blue),var(--erg-red))]"
                style={{ width: `${quiz.settings.passPercent}%` }}
              />
            </div>
            <div className="mt-3 text-sm leading-6 text-slate-500">
              Học sinh cần đạt tối thiểu {quiz.settings.passPercent}% để pass bài kiểm tra.
            </div>
          </div>
        </div>

        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Điều hướng nhanh</p>
          <h3 className="mt-2 text-2xl font-black text-slate-900">Đi tới khu làm việc</h3>
          <div className="mt-5 grid gap-3">
            {[
              { section: "general" as const, title: "Mở cài đặt chung", helper: "Thông tin bài, mode và quy tắc chấm điểm." },
              { section: "theme" as const, title: "Mở theme & giao diện", helper: "Preset theme và bộ màu học sinh." },
              { section: "questions" as const, title: "Mở ngân hàng câu hỏi", helper: "Tạo mới và chỉnh sửa câu hỏi theo từng type." },
              { section: "students" as const, title: "Mở theo dõi học sinh", helper: "Tiến độ làm bài, hoạt động và kết quả." },
            ].map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => onGo(item.section)}
                className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[var(--erg-blue)] hover:bg-white"
              >
                <div className="text-sm font-black text-slate-900">{item.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">{item.helper}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Hoạt động gần đây</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Học sinh hoạt động mới nhất</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
            {recentStudents.length} học sinh
          </span>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {recentStudents.map((student) => (
            <div key={student.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-black text-slate-900">{student.studentName}</div>
                  <div className="mt-1 text-sm text-slate-500">{student.currentQuestionTitle}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusTone(student.status)}`}>
                  {statusLabel(student.status)}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <span>{student.answeredCount}/{student.totalQuestions} câu</span>
                <span>{student.percentComplete}% hoàn tất</span>
                <span>{formatDateTime(student.lastActiveAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeneralSettingsSection({
  quiz,
  updateQuiz,
}: {
  quiz: Quiz;
  updateQuiz: (mutator: (draft: Quiz) => Quiz) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Thông tin bài học</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">Cài đặt chung</h3>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Tiêu đề bài</span>
            <input
              className={inputClass}
              value={quiz.title}
              onChange={(event) =>
                updateQuiz((draft) => {
                  draft.title = event.target.value;
                  return draft;
                })
              }
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Phụ đề</span>
            <input
              className={inputClass}
              value={quiz.subtitle}
              onChange={(event) =>
                updateQuiz((draft) => {
                  draft.subtitle = event.target.value;
                  return draft;
                })
              }
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Phiên bản</span>
            <input
              className={inputClass}
              value={quiz.version}
              onChange={(event) =>
                updateQuiz((draft) => {
                  draft.version = event.target.value;
                  return draft;
                })
              }
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Mục tiêu đạt (%)</span>
            <input
              className={inputClass}
              type="number"
              min={0}
              max={100}
              value={quiz.settings.passPercent}
              onChange={(event) =>
                updateQuiz((draft) => {
                  draft.settings.passPercent = Number(event.target.value);
                  return draft;
                })
              }
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-700">Mô tả</span>
          <textarea
            className={`${inputClass} min-h-[140px] resize-y`}
            value={quiz.description}
            onChange={(event) =>
              updateQuiz((draft) => {
                draft.description = event.target.value;
                return draft;
              })
            }
          />
        </label>
      </div>

      <div className="grid gap-5">
        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Loại bài làm</p>
          <h3 className="mt-2 text-2xl font-black text-slate-900">Mode & thời gian</h3>

          <div className="mt-5 grid gap-3">
            {[
              {
                id: "training" as const,
                title: "Luyện tập",
                description: "Không có đồng hồ. Học sinh xem đáp án theo từng câu.",
              },
              {
                id: "testing" as const,
                title: "Kiểm tra",
                description: "Có đồng hồ, điều hướng và chấm điểm khi nộp bài.",
              },
            ].map((mode) => {
              const selected = quiz.settings.mode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() =>
                    updateQuiz((draft) => {
                      draft.settings.mode = mode.id;
                      return draft;
                    })
                  }
                  className={`rounded-[22px] border p-4 text-left transition ${
                    selected
                      ? "border-[rgb(0_0_139_/_0.18)] bg-[linear-gradient(180deg,#eef4ff,#ffffff)] shadow-[0_16px_34px_rgba(0,0,139,0.08)]"
                      : "border-slate-200 bg-slate-50 hover:bg-white"
                  }`}
                >
                  <div className="text-base font-black text-slate-900">{mode.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-500">{mode.description}</div>
                </button>
              );
            })}
          </div>

          <label className="mt-5 flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Thời gian kiểm tra (phút)</span>
            <input
              className={inputClass}
              type="number"
              min={1}
              disabled={quiz.settings.mode !== "testing"}
              value={quiz.settings.timeLimitMinutes ?? 20}
              onChange={(event) =>
                updateQuiz((draft) => {
                  draft.settings.timeLimitMinutes = Number(event.target.value);
                  return draft;
                })
              }
            />
          </label>
        </div>

        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Quy tắc hiển thị</p>
          <h3 className="mt-2 text-2xl font-black text-slate-900">Hành vi bài làm</h3>
          <div className="mt-5 grid gap-3">
            {[
              {
                label: "Trộn câu hỏi",
                checked: quiz.settings.shuffleQuestions,
                onChange: (next: boolean) =>
                  updateQuiz((draft) => {
                    draft.settings.shuffleQuestions = next;
                    return draft;
                  }),
              },
              {
                label: "Trộn đáp án",
                checked: quiz.settings.shuffleChoices,
                onChange: (next: boolean) =>
                  updateQuiz((draft) => {
                    draft.settings.shuffleChoices = next;
                    return draft;
                  }),
              },
              {
                label: "Hiện phản hồi từng bước",
                checked: quiz.settings.revealFeedbackPerStep,
                onChange: (next: boolean) =>
                  updateQuiz((draft) => {
                    draft.settings.revealFeedbackPerStep = next;
                    return draft;
                  }),
              },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-700">{item.label}</span>
                <input type="checkbox" checked={item.checked} onChange={(event) => item.onChange(event.target.checked)} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeSection({
  quiz,
  onSelectTheme,
  onUpdateThemeField,
}: {
  quiz: Quiz;
  onSelectTheme: (themeId: string) => void;
  onUpdateThemeField: (field: keyof Theme, value: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Preset theme</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">Chọn theme có sẵn</h3>
        <div className="mt-5">
          <QuizThemePicker selectedThemeId={quiz.themeId} onSelect={onSelectTheme} />
        </div>
      </div>

      <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Chỉnh màu</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">Tinh chỉnh giao diện</h3>
        <div className="mt-5 grid gap-4">
          {themeFields.map((field) => (
            <label key={field.key} className="flex items-center gap-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <input
                type="color"
                className="h-12 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                value={quiz.theme[field.key]}
                onChange={(event) => onUpdateThemeField(field.key, event.target.value)}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-black text-slate-900">{field.label}</span>
                <span className="mt-1 text-xs leading-5 text-slate-500">{field.helper}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionsSection({
  questions,
  allQuestions,
  selectedQuestion,
  selectedQuestionId,
  setSelectedQuestionId,
  addQuestion,
  updateQuiz,
}: {
  questions: Question[];
  allQuestions: Question[];
  selectedQuestion: Question;
  selectedQuestionId: string;
  setSelectedQuestionId: (id: string) => void;
  addQuestion: (kind: QuestionKind) => void;
  updateQuiz: (mutator: (draft: Quiz) => Quiz) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Tạo nhanh</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">Thêm câu hỏi mới</h3>
        <div className="mt-5 grid gap-3">
          {questionTypeOptions.map((option) => (
            <button
              key={option.kind}
              type="button"
              onClick={() => addQuestion(option.kind)}
              className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[var(--erg-blue)] hover:bg-white"
            >
              <div className="text-sm font-black text-slate-900">{option.label}</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">{option.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-black text-slate-900">Danh sách câu hỏi</h4>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              {allQuestions.length} câu
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {questions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                onClick={() => setSelectedQuestionId(question.id)}
                className={`flex gap-3 rounded-[22px] border p-4 text-left transition ${
                  selectedQuestionId === question.id
                    ? "border-[rgb(0_0_139_/_0.15)] bg-[linear-gradient(180deg,#eef4ff,#ffffff)] shadow-[0_12px_24px_rgba(0,0,139,0.08)]"
                    : "border-slate-200 bg-slate-50 hover:bg-white"
                }`}
              >
                <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                  {index + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <strong className="line-clamp-2 text-sm font-black text-slate-900">{question.title}</strong>
                  <small className="text-xs text-slate-400">{labelForKind(question.kind)}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Biên tập câu hỏi</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">{labelForKind(selectedQuestion.kind)}</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
            {selectedQuestion.points} điểm
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Nội dung câu hỏi</span>
            <textarea
              className={`${inputClass} min-h-[120px] resize-y`}
              value={selectedQuestion.title}
              onChange={(event) =>
                updateQuiz((draft) => {
                  const question = getAllQuestions(draft).find((item) => item.id === selectedQuestion.id);
                  if (question) question.title = event.target.value;
                  return draft;
                })
              }
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">URL hình minh hoạ</span>
              <input
                className={inputClass}
                type="url"
                value={selectedQuestion.contentImage?.url ?? ""}
                placeholder="https://..."
                onChange={(event) =>
                  updateQuiz((draft) => {
                    const question = getAllQuestions(draft).find((item) => item.id === selectedQuestion.id);
                    if (!question) return draft;
                    const nextUrl = event.target.value.trim();
                    question.contentImage = nextUrl
                      ? {
                          url: nextUrl,
                          alt: question.contentImage?.alt ?? question.title,
                        }
                      : undefined;
                    return draft;
                  })
                }
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">Alt text hình</span>
              <input
                className={inputClass}
                value={selectedQuestion.contentImage?.alt ?? ""}
                placeholder="Mô tả ngắn cho hình"
                onChange={(event) =>
                  updateQuiz((draft) => {
                    const question = getAllQuestions(draft).find((item) => item.id === selectedQuestion.id);
                    if (!question?.contentImage) return draft;
                    question.contentImage.alt = event.target.value;
                    return draft;
                  })
                }
              />
            </label>
          </div>

          <label className="flex max-w-[180px] flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Điểm</span>
            <input
              className={inputClass}
              type="number"
              value={selectedQuestion.points}
              onChange={(event) =>
                updateQuiz((draft) => {
                  const question = getAllQuestions(draft).find((item) => item.id === selectedQuestion.id);
                  if (question) question.points = Number(event.target.value);
                  return draft;
                })
              }
            />
          </label>

          <QuestionSpecificEditor
            question={selectedQuestion}
            onUpdate={(updater) =>
              updateQuiz((draft) => {
                const target = getAllQuestions(draft).find((item) => item.id === selectedQuestion.id);
                if (target) updater(target);
                return draft;
              })
            }
          />
        </div>
      </section>
    </div>
  );
}

function StudentsSection({
  students,
  summary,
}: {
  students: StudentProgress[];
  summary: ReturnType<typeof summarizeStudents>;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Đang làm bài" value={String(summary.inProgress)} helper="Học sinh đang ở trạng thái in-progress." />
        <MetricCard label="Đã nộp bài" value={String(summary.submitted)} helper="Đã có kết quả và thời điểm nộp." tone="dark" />
        <MetricCard label="Chưa bắt đầu" value={String(summary.notStarted)} helper="Chưa mở bài hoặc chưa vào hệ thống." />
        <MetricCard label="Điểm trung bình" value={`${summary.averageScore}%`} helper="Tính trên các bài đã hoàn tất." />
      </div>

      <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[var(--erg-shadow)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Lớp học</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Danh sách học sinh</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
            {students.length} học sinh
          </span>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {students.map((student) => (
            <article key={student.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-slate-900">{student.studentName}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{student.currentQuestionTitle}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusTone(student.status)}`}>
                  {statusLabel(student.status)}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <div>
                  <span className="font-bold text-slate-700">Mode:</span> {student.mode === "training" ? "Luyện tập" : "Kiểm tra"}
                </div>
                <div>
                  <span className="font-bold text-slate-700">Tiến độ:</span> {student.answeredCount}/{student.totalQuestions} câu
                </div>
                <div>
                  <span className="font-bold text-slate-700">Hoạt động cuối:</span> {formatDateTime(student.lastActiveAt)}
                </div>
                <div>
                  <span className="font-bold text-slate-700">Kết quả:</span>{" "}
                  {student.score === null ? "Chưa chấm điểm" : `${student.score}% - ${student.passed ? "Đạt" : "Chưa đạt"}`}
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,var(--erg-blue),var(--erg-red))]"
                  style={{ width: `${student.percentComplete}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentPreviewModal({
  quiz,
  question,
  questionIndex,
  totalQuestions,
  onClose,
}: {
  quiz: Quiz;
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-[1180px] overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Xem giao diện học sinh</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Popup mô phỏng giao diện làm bài</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        <QuizThemeSurface quiz={quiz}>
          <div className="max-h-[80vh] overflow-auto p-4 sm:p-6" style={{ backgroundColor: "var(--quiz-page-bg)" }}>
            <div
              className="overflow-hidden rounded-[30px] border shadow-[0_18px_48px_rgba(15,23,42,0.1)]"
              style={{ backgroundColor: "var(--quiz-player-bg)", borderColor: "var(--quiz-canvas-border)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Tài nguyên</span>
                  <span className="text-slate-300">|</span>
                  <span>{`Câu ${questionIndex + 1} / ${totalQuestions}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600">
                    {quiz.settings.mode === "training" ? "Luyện tập" : "Kiểm tra"}
                  </span>
                  {quiz.settings.mode === "testing" ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600">
                      {formatPreviewTimer(quiz.settings.timeLimitMinutes ?? 20)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mx-3 mt-3 rounded-[20px] px-4 py-4 sm:mx-6 sm:px-5" style={{ background: "var(--quiz-header-bg)", color: "var(--quiz-header-text)" }}>
                <h2 className="text-xl font-bold leading-[1.18] sm:text-2xl lg:text-[34px]">{question.title}</h2>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <QuestionRenderer question={question} value={previewAnswer(question)} onChange={() => {}} />
                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  {quiz.settings.mode === "training" ? (
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(0,0,139,0.16)]"
                      style={{ background: "linear-gradient(135deg, var(--quiz-accent-start), var(--quiz-accent-end))" }}
                    >
                      ĐÁP ÁN
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border px-5 text-sm font-black"
                        style={{
                          borderColor: "var(--quiz-canvas-border)",
                          backgroundColor: "var(--quiz-player-bg)",
                          color: "var(--quiz-option-text)",
                        }}
                      >
                        QUAY LẠI
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(0,0,139,0.16)]"
                        style={{ background: "linear-gradient(135deg, var(--quiz-accent-start), var(--quiz-accent-end))" }}
                      >
                        TIẾP THEO
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </QuizThemeSurface>
      </div>
    </div>
  );
}

function QuestionSpecificEditor({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updater: (question: Question) => void) => void;
}) {
  if (question.kind === "single_choice" || question.kind === "multiple_response") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-700">Lựa chọn đáp án</div>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600"
            onClick={() =>
              onUpdate((target) => {
                target.choices ??= [];
                target.choices.push({
                  id: createId("choice"),
                  label: `Lựa chọn ${String.fromCharCode(65 + target.choices.length)}`,
                  correct: false,
                });
              })
            }
          >
            + Thêm lựa chọn
          </button>
        </div>
        {question.choices?.map((choice, index) => (
          <div key={choice.id} className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <input
              className={inputClass}
              value={choice.label}
              onChange={(event) =>
                onUpdate((target) => {
                  const item = target.choices?.[index];
                  if (item) item.label = event.target.value;
                })
              }
            />
            <label className="inline-flex items-center gap-2 whitespace-nowrap text-slate-600">
              <input
                type={question.kind === "single_choice" ? "radio" : "checkbox"}
                name={question.id}
                checked={choice.correct}
                onChange={(event) =>
                  onUpdate((target) => {
                    if (!target.choices) return;
                    if (target.kind === "single_choice") {
                      target.choices.forEach((entry) => {
                        entry.correct = false;
                      });
                    }
                    const item = target.choices[index];
                    if (item) item.correct = event.target.checked;
                  })
                }
              />
              <span>Đáp án đúng</span>
            </label>
          </div>
        ))}
      </div>
    );
  }

  if (question.kind === "matching") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-700">Ghép cặp / kéo thả sắp xếp</div>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600"
            onClick={() =>
              onUpdate((target) => {
                target.matching ??= [];
                target.matching.push({
                  id: createId("pair"),
                  prompt: `Vế trái ${target.matching.length + 1}`,
                  response: `Vế phải ${target.matching.length + 1}`,
                });
              })
            }
          >
            + Thêm cặp
          </button>
        </div>
        {question.matching?.map((pair, index) => (
          <div key={pair.id} className="grid gap-3 lg:grid-cols-[220px_1fr]">
            <input
              className={inputClass}
              value={pair.prompt}
              onChange={(event) =>
                onUpdate((target) => {
                  const item = target.matching?.[index];
                  if (item) item.prompt = event.target.value;
                })
              }
            />
            <input
              className={inputClass}
              value={pair.response}
              onChange={(event) =>
                onUpdate((target) => {
                  const item = target.matching?.[index];
                  if (item) item.response = event.target.value;
                })
              }
            />
          </div>
        ))}
      </div>
    );
  }

  if (question.kind === "sequence") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-700">Danh sách các bước cần sắp xếp</div>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600"
            onClick={() =>
              onUpdate((target) => {
                target.sequenceItems ??= [];
                target.sequenceItems.push({
                  id: createId("step"),
                  label: `Bước ${target.sequenceItems.length + 1}`,
                });
              })
            }
          >
            + Thêm bước
          </button>
        </div>
        {question.sequenceItems?.map((item, index) => (
          <input
            key={item.id}
            className={inputClass}
            value={item.label}
            onChange={(event) =>
              onUpdate((target) => {
                const sequenceItem = target.sequenceItems?.[index];
                if (sequenceItem) sequenceItem.label = event.target.value;
              })
            }
          />
        ))}
      </div>
    );
  }

  if (question.kind === "inline_choice") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-700">Dòng văn bản + ô chọn trong dòng</div>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600"
            onClick={() =>
              onUpdate((target) => {
                target.inlineBlanks ??= [];
                target.inlineBlanks.push({
                  id: createId("blank"),
                  statement: `Dòng ${target.inlineBlanks.length + 1}`,
                  options: ["yes", "no"],
                  correctOptionId: "yes",
                  selectPosition: "before",
                });
              })
            }
          >
            + Thêm dòng
          </button>
        </div>
        {question.inlineBlanks?.map((blank, index) => (
          <div key={blank.id} className="grid gap-3 lg:grid-cols-[1fr_180px_220px]">
            <textarea
              className={`${inputClass} min-h-[120px] resize-y`}
              value={blank.statement}
              onChange={(event) =>
                onUpdate((target) => {
                  const item = target.inlineBlanks?.[index];
                  if (item) item.statement = event.target.value;
                })
              }
            />
            <select
              className={inputClass}
              value={blank.correctOptionId}
              onChange={(event) =>
                onUpdate((target) => {
                  const item = target.inlineBlanks?.[index];
                  if (item) item.correctOptionId = event.target.value;
                })
              }
            >
              {blank.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className={inputClass}
              value={blank.selectPosition ?? "before"}
              onChange={(event) =>
                onUpdate((target) => {
                  const item = target.inlineBlanks?.[index];
                  if (item) item.selectPosition = event.target.value as "before" | "after";
                })
              }
            >
              <option value="before">Ô chọn đứng trước văn bản</option>
              <option value="after">Ô chọn đứng sau văn bản</option>
            </select>
          </div>
        ))}
      </div>
    );
  }

  if (question.kind === "hotspot") {
    return (
      <div className="flex flex-col gap-3">
        <div className="text-sm font-bold text-slate-700">Bấm vào vị trí trên ảnh</div>
        <HotspotAreaEditor
          key={`${question.id}-${question.hotspotAreas?.[0]?.id ?? "area"}`}
          area={question.hotspotAreas?.[0]}
          imageUrl={question.hotspotImage?.url}
          onChange={(nextArea) =>
            onUpdate((target) => {
              target.hotspotAreas = [nextArea];
            })
          }
        />
      </div>
    );
  }

  return null;
}

function HotspotAreaEditor({
  area,
  imageUrl,
  onChange,
}: {
  area?: HotspotArea;
  imageUrl?: string;
  onChange: (area: HotspotArea) => void;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [draft, setDraft] = useState<HotspotArea | undefined>(area);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  return (
    <div className="grid gap-3">
      <div
        ref={stageRef}
        className="relative overflow-hidden rounded-[24px] border border-[#d8e0ea]"
        onPointerDown={(event) => {
          if (!stageRef.current) return;
          const rect = stageRef.current.getBoundingClientRect();
          setStartPoint({
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
          });
        }}
        onPointerMove={(event) => {
          if (!startPoint || !stageRef.current) return;
          const rect = stageRef.current.getBoundingClientRect();
          const endX = (event.clientX - rect.left) / rect.width;
          const endY = (event.clientY - rect.top) / rect.height;
          setDraft({
            id: area?.id ?? "draft-area",
            shape: "rect",
            x: Math.min(startPoint.x, endX),
            y: Math.min(startPoint.y, endY),
            width: Math.abs(endX - startPoint.x),
            height: Math.abs(endY - startPoint.y),
            correct: true,
          });
        }}
        onPointerUp={() => {
          if (draft) onChange(draft);
          setStartPoint(null);
        }}
      >
        {imageUrl ? <img src={imageUrl} alt="Hotspot editor" className="block h-[260px] w-full object-cover" /> : null}
        {draft ? (
          <div
            className="absolute rounded-[18px] border-2 border-[#de58bf] bg-[#de58bf]/15"
            style={{
              left: `${draft.x * 100}%`,
              top: `${draft.y * 100}%`,
              width: `${draft.width * 100}%`,
              height: `${draft.height * 100}%`,
            }}
          />
        ) : null}
      </div>
      <p className="text-sm text-slate-500">Bấm và kéo trên ảnh để vẽ vùng đúng cho hotspot.</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  tone = "light",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "light" | "blue" | "dark";
}) {
  const toneClass =
    tone === "blue"
      ? "bg-[linear-gradient(135deg,#2563eb,#1d4ed8)] text-white"
      : tone === "dark"
        ? "bg-[linear-gradient(135deg,#0f172a,#1e293b)] text-white"
        : "bg-white text-slate-900";

  const helperClass = tone === "light" ? "text-slate-500" : "text-white/75";
  const labelClass = tone === "light" ? "text-slate-400" : "text-white/70";

  return (
    <div className={`rounded-[30px] border border-slate-200 p-5 shadow-[var(--erg-shadow)] ${toneClass}`}>
      <div className={`text-xs font-black uppercase tracking-[0.18em] ${labelClass}`}>{label}</div>
      <div className="mt-4 text-4xl font-black">{value}</div>
      <div className={`mt-3 text-sm leading-6 ${helperClass}`}>{helper}</div>
    </div>
  );
}

function ProgressCard({ title, value, accent }: { title: string; value: number; accent: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-black text-slate-900">{title}</div>
        <span className={`inline-flex h-3 w-3 rounded-full ${accent}`} />
      </div>
      <div className="mt-4 text-4xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function MiniMetric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-3 py-3">
      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className={`mt-2 font-black text-slate-900 ${compact ? "text-sm" : "text-lg"}`}>{value}</div>
    </div>
  );
}

function labelForKind(kind: Question["kind"]) {
  switch (kind) {
    case "single_choice":
      return "Chọn 1 đáp án";
    case "multiple_response":
      return "Chọn nhiều đáp án";
    case "matching":
      return "Ghép cặp";
    case "sequence":
      return "Sắp xếp thứ tự";
    case "inline_choice":
      return "Chọn trong dòng";
    case "hotspot":
      return "Chọn vị trí trên ảnh";
    default:
      return kind;
  }
}

function previewAnswer(question: Question) {
  switch (question.kind) {
    case "single_choice":
      return { choiceId: question.choices?.[0]?.id };
    case "multiple_response":
      return { choiceIds: question.choices?.filter((choice) => choice.correct).map((choice) => choice.id).slice(0, 1) };
    case "matching":
      return {
        matchingOrder: question.matching?.map((pair) => pair.id).reverse(),
        matchingConnectedRows: [],
      };
    case "sequence":
      return {
        sequenceOrder: question.sequenceItems?.map((item) => item.id).reverse(),
      };
    case "inline_choice":
      return {
        inlineSelections: Object.fromEntries((question.inlineBlanks ?? []).map((blank) => [blank.id, ""])),
      };
    case "hotspot":
      return { hotspotPoint: { x: 0.65, y: 0.77 } };
    default:
      return {};
  }
}

function formatPreviewTimer(minutes: number) {
  return `${String(minutes).padStart(2, "0")}:00`;
}

function normalizeTheme(theme: Theme): Theme {
  return {
    ...theme,
    headerBackground: `linear-gradient(135deg, ${theme.accentStart} 0%, ${theme.accentEnd} 100%)`,
    sidebarActiveBackground: `linear-gradient(135deg, ${theme.accentStart} 0%, ${theme.accentEnd} 100%)`,
  };
}

function createQuestionTemplate(kind: QuestionKind, order: number): Question {
  const base = {
    id: createId("question"),
    kind,
    title: `Câu hỏi ${order}`,
    points: 10,
    feedback: {
      correct: "Chính xác.",
      incorrect: "Câu trả lời chưa đúng.",
      partial: "Bạn đã đúng một phần.",
    },
  } satisfies Pick<Question, "id" | "kind" | "title" | "points" | "feedback">;

  switch (kind) {
    case "single_choice":
      return {
        ...base,
        choices: [
          { id: createId("choice"), label: "Lựa chọn A", correct: true },
          { id: createId("choice"), label: "Lựa chọn B", correct: false },
          { id: createId("choice"), label: "Lựa chọn C", correct: false },
          { id: createId("choice"), label: "Lựa chọn D", correct: false },
        ],
      };
    case "multiple_response":
      return {
        ...base,
        choices: [
          { id: createId("choice"), label: "Lựa chọn A", correct: true },
          { id: createId("choice"), label: "Lựa chọn B", correct: true },
          { id: createId("choice"), label: "Lựa chọn C", correct: false },
          { id: createId("choice"), label: "Lựa chọn D", correct: false },
        ],
      };
    case "matching":
      return {
        ...base,
        matching: [
          { id: createId("pair"), prompt: "Vế trái 1", response: "Vế phải 1" },
          { id: createId("pair"), prompt: "Vế trái 2", response: "Vế phải 2" },
          { id: createId("pair"), prompt: "Vế trái 3", response: "Vế phải 3" },
        ],
      };
    case "sequence":
      return {
        ...base,
        sequenceItems: [
          { id: createId("step"), label: "Bước 1" },
          { id: createId("step"), label: "Bước 2" },
          { id: createId("step"), label: "Bước 3" },
        ],
      };
    case "inline_choice":
      return {
        ...base,
        inlineBlanks: [
          { id: createId("blank"), statement: "Dòng 1", options: ["yes", "no"], correctOptionId: "yes", selectPosition: "before" },
          { id: createId("blank"), statement: "Dòng 2", options: ["yes", "no"], correctOptionId: "no", selectPosition: "before" },
          { id: createId("blank"), statement: "Dòng 3", options: ["yes", "no"], correctOptionId: "yes", selectPosition: "after" },
        ],
      };
    case "hotspot":
      return {
        ...base,
        hotspotImage: {
          url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 800,
        },
        hotspotAreas: [
          {
            id: createId("area"),
            shape: "rect",
            x: 0.42,
            y: 0.34,
            width: 0.18,
            height: 0.14,
            correct: true,
          },
        ],
      };
    default:
      return base as Question;
  }
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function statusLabel(status: StudentProgress["status"]) {
  switch (status) {
    case "in_progress":
      return "Đang làm";
    case "submitted":
      return "Đã nộp";
    case "not_started":
      return "Chưa bắt đầu";
    default:
      return status;
  }
}

function statusTone(status: StudentProgress["status"]) {
  switch (status) {
    case "in_progress":
      return "bg-amber-50 text-amber-600";
    case "submitted":
      return "bg-emerald-50 text-emerald-600";
    case "not_started":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function summarizeStudents(students: StudentProgress[]) {
  const submitted = students.filter((student) => student.status === "submitted");
  const scores = submitted.map((student) => student.score ?? 0);
  const averageScore = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;

  return {
    inProgress: students.filter((student) => student.status === "in_progress").length,
    submitted: submitted.length,
    notStarted: students.filter((student) => student.status === "not_started").length,
    averageScore,
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function sectionMeta(section: DashboardSection) {
  switch (section) {
    case "overview":
      return {
        title: "Tổng quan hệ thống",
        description: "Theo dõi nhanh trạng thái bài thi, hiệu suất lớp học và các khu vực cần thao tác tiếp.",
      };
    case "general":
      return {
        title: "Cài đặt bài làm",
        description: "Thiết lập thông tin bài, mode luyện tập hoặc kiểm tra, thời gian và các quy tắc hiển thị.",
      };
    case "theme":
      return {
        title: "Theme & giao diện học sinh",
        description: "Chọn preset, chỉnh màu chi tiết và xem trước giao diện hiển thị cho học sinh bằng popup.",
      };
    case "questions":
      return {
        title: "Soạn thảo & ngân hàng câu hỏi",
        description: "Tạo nhanh từng type câu hỏi, chỉnh hình minh hoạ, nội dung, đáp án và điểm số ngay trong dashboard.",
      };
    case "students":
      return {
        title: "Theo dõi học sinh",
        description: "Quan sát học sinh đang làm bài nào, tiến độ đến đâu, thời điểm hoạt động cuối và kết quả sau khi nộp.",
      };
    default:
      return {
        title: section,
        description: "",
      };
  }
}
