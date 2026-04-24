import { useDeferredValue, useMemo, useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { DashboardPageShell, DashboardMetricCard, DashboardSectionCard, DashboardSegmentedControl } from "@/components/dashboard/dashboard-page-shell";
import { Button, Input, ProgressBar } from "@/components/ui/dashboard-kit";
import { useI18n } from "@/features/i18n";
import {
  getQuestionBankCategoryCount,
  questionBankQuestions,
  questionBankSubjects,
} from "@/features/question-bank/api/mock-question-bank";
import type { QuestionBankQuestion } from "@/features/question-bank/types/question-bank-types";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";
import { cn } from "@/lib/utils";

export function QuestionBankWorkspace({
  activeLeaf,
  onCreateQuiz,
}: {
  activeLeaf: DashboardLeaf;
  onCreateQuiz: (questions: QuestionBankQuestion[]) => void;
}) {
  const { locale } = useI18n();
  const copy = locale === "vi" ? viCopy : enCopy;

  const [subjectId, setSubjectId] = useState(questionBankSubjects[0]?.id ?? "mathematics");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const deferredSearchValue = useDeferredValue(searchValue);

  const activeSubject = useMemo(
    () => questionBankSubjects.find((subject) => subject.id === subjectId) ?? questionBankSubjects[0],
    [subjectId],
  );

  const visibleQuestions = useMemo(() => {
    const normalizedKeyword = deferredSearchValue.trim().toLowerCase();

    return questionBankQuestions.filter((question) => {
      if (question.subjectId !== subjectId) {
        return false;
      }

      if (categoryId !== "all" && question.categoryId !== categoryId) {
        return false;
      }

      if (!normalizedKeyword) {
        return true;
      }

      const haystack = [
        question.stem,
        question.objective,
        question.subjectLabel,
        question.categoryLabel,
        question.gradeLabel,
        question.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedKeyword);
    });
  }, [categoryId, deferredSearchValue, subjectId]);

  const selectedQuestions = useMemo(
    () => questionBankQuestions.filter((question) => selectedIds.includes(question.id)),
    [selectedIds],
  );

  const readyCount = questionBankQuestions.filter((question) => question.status === "ready").length;
  const averageMastery = Math.round(
    questionBankQuestions.reduce((sum, question) => sum + question.masteryRate, 0) / questionBankQuestions.length,
  );
  const totalCategories = questionBankSubjects.reduce((sum, subject) => sum + subject.categories.length, 0);
  const mostUsedSubject = useMemo(() => {
    const subjectUsage = questionBankSubjects.map((subject) => ({
      label: subject.label,
      usage: questionBankQuestions
        .filter((question) => question.subjectId === subject.id)
        .reduce((sum, question) => sum + question.usageCount, 0),
    }));

    return subjectUsage.sort((left, right) => right.usage - left.usage)[0]?.label ?? questionBankSubjects[0]?.label;
  }, []);

  function toggleQuestionSelection(questionId: string) {
    setSelectedIds((current) =>
      current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId],
    );
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  return (
    <DashboardPageShell
      badge={copy.badge}
      title={activeLeaf.title}
      description={copy.description}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={
        <>
          <Button variant="outline" onClick={clearSelection} disabled={selectedQuestions.length === 0}>
            {copy.clearSelection}
          </Button>
          <Button onClick={() => onCreateQuiz(selectedQuestions)} disabled={selectedQuestions.length === 0}>
            {copy.createQuizAction(selectedQuestions.length)}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <DashboardMetricCard
          label={copy.metrics.totalQuestions}
          value={String(questionBankQuestions.length)}
          detail={copy.metrics.totalQuestionsDetail(totalCategories)}
          delta={copy.metrics.totalQuestionsDelta}
          icon={<LayersOutlinedIcon fontSize="inherit" />}
        />
        <DashboardMetricCard
          label={copy.metrics.ready}
          value={`${Math.round((readyCount / questionBankQuestions.length) * 100)}%`}
          detail={copy.metrics.readyDetail(readyCount)}
          delta={copy.metrics.readyDelta}
          icon={<ChecklistOutlinedIcon fontSize="inherit" />}
          tone="emerald"
        />
        <DashboardMetricCard
          label={copy.metrics.mastery}
          value={`${averageMastery}%`}
          detail={copy.metrics.masteryDetail}
          delta={copy.metrics.masteryDelta}
          icon={<AutoAwesomeIcon fontSize="inherit" />}
          tone="amber"
        />
        <DashboardMetricCard
          label={copy.metrics.subjectUsage}
          value={mostUsedSubject ?? "-"}
          detail={copy.metrics.subjectUsageDetail}
          delta={copy.metrics.subjectUsageDelta}
          icon={<SchoolOutlinedIcon fontSize="inherit" />}
          tone="violet"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_360px]">
        <div className="space-y-4">
          <DashboardSectionCard
            title={copy.libraryTitle}
            description={copy.libraryDescription}
            action={
              <div className="relative w-full min-w-[240px] max-w-[320px]">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="pl-10"
                />
              </div>
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <DashboardSegmentedControl
                options={questionBankSubjects.map((subject) => ({
                  value: subject.id,
                  label: subject.label,
                }))}
                value={subjectId}
                onChange={(value) => {
                  setSubjectId(value as typeof subjectId);
                  setCategoryId("all");
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId("all")}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  categoryId === "all"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950",
                )}
              >
                {copy.allCategories}
              </button>
              {activeSubject?.categories.map((category) => {
                const active = category.id === categoryId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition",
                      active
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950",
                    )}
                  >
                    {category.label} ({getQuestionBankCategoryCount(subjectId, category.id)})
                  </button>
                );
              })}
            </div>

            <div className="overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-[minmax(0,1.3fr)_120px_130px_120px_120px] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>{copy.table.question}</span>
                <span>{copy.table.level}</span>
                <span>{copy.table.mastery}</span>
                <span>{copy.table.usage}</span>
                <span className="text-right">{copy.table.action}</span>
              </div>

              <div className="divide-y divide-slate-200 bg-white">
                {visibleQuestions.map((question) => {
                  const selected = selectedIds.includes(question.id);

                  return (
                    <div
                      key={question.id}
                      className={cn(
                        "grid grid-cols-[minmax(0,1.3fr)_120px_130px_120px_120px] gap-3 px-4 py-4 transition",
                        selected ? "bg-blue-50/70" : "hover:bg-slate-50/80",
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-base font-semibold leading-7 text-slate-950">{question.stem}</div>
                          <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {question.type}
                          </span>
                        </div>
                        <div className="mt-1 text-sm leading-6 text-slate-500">{question.objective}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {question.categoryLabel}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {question.gradeLabel}
                          </span>
                          {question.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                            question.difficulty === "challenge"
                              ? "bg-rose-50 text-rose-700"
                              : question.difficulty === "stretch"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700",
                          )}
                        >
                          {copy.difficulty[question.difficulty]}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">{question.masteryRate}%</div>
                        <ProgressBar
                          value={question.masteryRate}
                          className="h-2 bg-slate-100"
                          indicatorClassName={cn(
                            question.masteryRate >= 80
                              ? "bg-emerald-500"
                              : question.masteryRate >= 65
                                ? "bg-amber-500"
                                : "bg-rose-500",
                          )}
                        />
                      </div>

                      <div className="flex flex-col justify-center text-sm leading-6 text-slate-500">
                        <span className="font-semibold text-slate-900">{question.usageCount}</span>
                        <span>{copy.schoolsUsing(question.schoolsUsing)}</span>
                      </div>

                      <div className="flex items-center justify-end">
                        <Button variant={selected ? "secondary" : "outline"} size="sm" onClick={() => toggleQuestionSelection(question.id)}>
                          {selected ? copy.selectedAction : copy.selectAction}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {visibleQuestions.length === 0 ? (
                  <div className="px-6 py-12 text-center text-sm text-slate-500">{copy.noResults}</div>
                ) : null}
              </div>
            </div>
          </DashboardSectionCard>
        </div>

        <div className="space-y-4">
          <DashboardSectionCard title={copy.selectionTitle} description={copy.selectionDescription}>
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 p-4">
              <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{selectedQuestions.length}</div>
              <div className="mt-1 text-sm leading-6 text-slate-500">{copy.selectionCountLabel}</div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" onClick={() => onCreateQuiz(selectedQuestions)} disabled={selectedQuestions.length === 0}>
                  {copy.createQuizAction(selectedQuestions.length)}
                </Button>
                <Button variant="outline" className="flex-1" onClick={clearSelection} disabled={selectedQuestions.length === 0}>
                  {copy.clearSelection}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {selectedQuestions.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm leading-6 text-slate-500">
                  {copy.emptySelection}
                </div>
              ) : (
                selectedQuestions.map((question) => (
                  <div key={question.id} className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
                    <div className="text-sm font-semibold leading-6 text-slate-950">{question.stem}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>{question.subjectLabel}</span>
                      <span>•</span>
                      <span>{question.categoryLabel}</span>
                      <span>•</span>
                      <span>{question.gradeLabel}</span>
                    </div>
                    <div className="mt-3 text-xs leading-5 text-slate-500">{question.lastUsedAt}</div>
                  </div>
                ))
              )}
            </div>
          </DashboardSectionCard>

          <DashboardSectionCard title={copy.recommendationTitle} description={copy.recommendationDescription}>
            <div className="space-y-3">
              {visibleQuestions.slice(0, 3).map((question) => (
                <div key={question.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{question.categoryLabel}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">{question.objective}</div>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {question.recommendedCluster}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSectionCard>
        </div>
      </div>
    </DashboardPageShell>
  );
}

const viCopy = {
  badge: "Question bank",
  description:
    "Ngân hàng câu hỏi được tổ chức theo môn học và category, giúp giáo viên lọc nhanh nguồn câu hỏi đủ sạch để kéo thẳng vào bài kiểm tra mới.",
  searchPlaceholder: "Tìm theo nội dung, mục tiêu, tag...",
  clearSelection: "Bỏ chọn",
  createQuizAction: (count: number) => `Tạo quiz từ ${count} câu`,
  metrics: {
    totalQuestions: "Tổng câu hỏi",
    totalQuestionsDetail: (count: number) => `${count} category đang hoạt động`,
    totalQuestionsDelta: "+12 câu đã kiểm duyệt tuần này",
    ready: "Sẵn sàng dùng",
    readyDetail: (count: number) => `${count} câu đã qua kiểm duyệt chuyên môn`,
    readyDelta: "Độ phủ đủ cho lịch giao bài tuần này",
    mastery: "Mastery trung bình",
    masteryDetail: "Tỷ lệ học sinh trả lời đúng của toàn ngân hàng.",
    masteryDelta: "Ưu tiên rà soát nhóm dưới 65%",
    subjectUsage: "Môn dùng nhiều nhất",
    subjectUsageDetail: "Theo tổng số lượt giáo viên kéo vào đề trong 30 ngày.",
    subjectUsageDelta: "Tăng mạnh ở các lớp luyện nền tảng",
  },
  libraryTitle: "Thư viện câu hỏi",
  libraryDescription: "Lọc theo môn học, category và chất lượng trước khi đưa vào bài kiểm tra mới.",
  allCategories: "Tất cả category",
  table: {
    question: "Câu hỏi",
    level: "Độ khó",
    mastery: "Mastery",
    usage: "Sử dụng",
    action: "Thao tác",
  },
  difficulty: {
    core: "Nền tảng",
    stretch: "Mở rộng",
    challenge: "Thử thách",
  },
  schoolsUsing: (count: number) => `${count} trường`,
  selectAction: "Chọn",
  selectedAction: "Đã chọn",
  noResults: "Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.",
  selectionTitle: "Giỏ đề nháp",
  selectionDescription: "Những câu đang được gom để tạo một quiz mới cho giáo viên.",
  selectionCountLabel: "câu đã sẵn sàng đưa sang quiz editor",
  emptySelection: "Chọn câu hỏi ở bảng bên trái để tạo một đề mới đủ nhanh và vẫn kiểm soát được chất lượng.",
  recommendationTitle: "Gợi ý sử dụng",
  recommendationDescription: "Nhóm câu có objective rõ và đang phù hợp với cụm lớp đang tăng tốc tuần này.",
};

const enCopy = {
  badge: "Question bank",
  description:
    "The question bank is organized by subject and category so teachers can filter clean, ready-to-use questions before pulling them into a new quiz.",
  searchPlaceholder: "Search by content, objective, or tag...",
  clearSelection: "Clear selection",
  createQuizAction: (count: number) => `Create quiz from ${count} questions`,
  metrics: {
    totalQuestions: "Total questions",
    totalQuestionsDetail: (count: number) => `${count} active categories`,
    totalQuestionsDelta: "+12 reviewed this week",
    ready: "Ready to use",
    readyDetail: (count: number) => `${count} questions passed academic review`,
    readyDelta: "Coverage is healthy for this week's assignment load",
    mastery: "Average mastery",
    masteryDetail: "The average student correctness rate across the bank.",
    masteryDelta: "Review the pool below 65%",
    subjectUsage: "Most used subject",
    subjectUsageDetail: "Based on teacher usage over the last 30 days.",
    subjectUsageDelta: "Rising in foundational practice classes",
  },
  libraryTitle: "Question library",
  libraryDescription: "Filter by subject, category, and quality before pushing questions into a new assessment.",
  allCategories: "All categories",
  table: {
    question: "Question",
    level: "Difficulty",
    mastery: "Mastery",
    usage: "Usage",
    action: "Action",
  },
  difficulty: {
    core: "Core",
    stretch: "Stretch",
    challenge: "Challenge",
  },
  schoolsUsing: (count: number) => `${count} schools`,
  selectAction: "Select",
  selectedAction: "Selected",
  noResults: "No questions match the current filters.",
  selectionTitle: "Draft basket",
  selectionDescription: "These questions are queued for the next teacher-facing quiz draft.",
  selectionCountLabel: "questions ready to send to the quiz editor",
  emptySelection: "Select questions from the library to build a new quiz quickly without losing quality control.",
  recommendationTitle: "Recommended now",
  recommendationDescription: "Questions with strong objectives that fit the clusters currently accelerating.",
};
