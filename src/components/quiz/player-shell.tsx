import { useEffect, useMemo, useRef, useState } from "react";

import { QuizThemeSurface } from "@/components/quiz/quiz-theme-surface";
import { QuestionRenderer } from "@/components/quiz/question-renderer";
import { createAttempt, fetchQuiz, submitAnswer, submitAttempt } from "@/lib/api";
import { createInitialAnswer, getAllQuestions, isAnswerComplete, normalizeAnswerForSubmission } from "@/lib/quiz";
import type { AnswerPayload, AnswerResult, Attempt, Question, Quiz, QuizResultDisplay } from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; quiz: Quiz; attempt: Attempt }
  | { status: "error"; message: string };

type SidebarTab = "outline" | "notes";
type SubmitDialogMode = "all-answered" | "confirm";

const navButtonClass =
  "inline-flex min-h-10 min-w-[92px] items-center justify-center rounded-xl border border-transparent px-4 text-sm font-black text-white shadow-[0_14px_32px_rgba(0,0,139,0.16)] transition disabled:cursor-not-allowed disabled:opacity-40";
const secondaryButtonClass =
  "inline-flex min-h-10 min-w-[92px] items-center justify-center rounded-xl border px-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40";
const playerViewportClass = "lg:h-[min(900px,calc(100vh-8rem))]";

const defaultResultDisplay: QuizResultDisplay = {
  passMessage: "Chúc mừng, bạn đã đạt!",
  failMessage: "Rất tiếc bạn đã không đạt!",
  reviewButtonLabel: "REVIEW QUIZ",
  thankYouMessage: "Thank you!",
  showReviewButton: true,
  submitAllPrompt: "All questions have been answered. Would you like to submit your answers?",
  confirmSubmitPrompt: "Are you sure you're ready to submit your answers and finish the quiz?",
  submitAllLabel: "SUBMIT ALL",
  returnToQuizLabel: "RETURN TO QUIZ",
  confirmYesLabel: "YES",
  confirmNoLabel: "NO",
};

export function PlayerShell({ quizId = "avs-demo" }: { quizId?: string }) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, AnswerPayload>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("outline");
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [submitDialogMode, setSubmitDialogMode] = useState<SubmitDialogMode | null>(null);
  const [reviewingSubmittedAttempt, setReviewingSubmittedAttempt] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const autoAdvanceRef = useRef<number | null>(null);
  useEffect(() => {
    setLoadState({ status: "loading" });
    setStarted(false);
    setCurrentIndex(0);
    setDrafts({});
    setSubmitting(false);
    setSidebarTab("outline");
    setSidebarQuery("");
    setSubmitDialogMode(null);
    setReviewingSubmittedAttempt(false);
    setSessionStartedAt(null);
    setRemainingSeconds(null);

    if (autoAdvanceRef.current !== null) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    async function load() {
      try {
        const quiz = await fetchQuiz(quizId);
        const attempt = await createAttempt(quiz);
        setLoadState({ status: "ready", quiz, attempt });
      } catch (error) {
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load quiz.",
        });
      }
    }

    void load();
  }, [quizId]);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current !== null) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  const quiz = loadState.status === "ready" ? loadState.quiz : null;
  const attempt = loadState.status === "ready" ? loadState.attempt : null;
  const questions = useMemo(() => (quiz ? getAllQuestions(quiz) : []), [quiz]);
  const currentQuestion = questions[currentIndex];

  const filteredQuestions = useMemo(() => {
    const normalized = sidebarQuery.trim().toLowerCase();
    if (!normalized) {
      return questions;
    }

    return questions.filter((question, index) => `${index + 1}. ${question.title}`.toLowerCase().includes(normalized));
  }, [questions, sidebarQuery]);

  const activeQuiz = quiz;
  const activeAttempt = attempt;
  const activeQuestion = currentQuestion ?? null;
  const isTrainingMode = activeQuiz?.settings.mode === "training";
  const isTestingMode = activeQuiz?.settings.mode === "testing";
  const attemptCompleted = Boolean(activeAttempt && activeAttempt.submittedCount === questions.length && questions.length > 0);
  const reviewingAttempt = attemptCompleted && reviewingSubmittedAttempt;
  const currentRecord = activeQuestion && activeAttempt ? activeAttempt.answers[activeQuestion.id] : undefined;
  const submitted = Boolean(currentRecord);
  const storedAnswer = activeQuestion ? currentRecord?.input ?? drafts[activeQuestion.id] : undefined;
  const draftAnswer = activeQuestion ? storedAnswer ?? createInitialAnswer(activeQuestion) : {};
  const currentAnswerComplete = activeQuestion ? isAnswerComplete(activeQuestion, storedAnswer) : false;
  const allQuestionsAnswered = questions.every((question) =>
    isAnswerComplete(question, activeAttempt?.answers[question.id]?.input ?? drafts[question.id]),
  );
  const lastResult = currentRecord?.result ?? null;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;
  const testingDurationSeconds = Math.max(activeQuiz?.settings.timeLimitMinutes ?? 0, 0) * 60;
  const deadlineAt = isTestingMode && sessionStartedAt !== null ? sessionStartedAt + testingDurationSeconds * 1000 : null;

  useEffect(() => {
    if (!started || !isTestingMode || attemptCompleted || sessionStartedAt !== null) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setSessionStartedAt(Date.now());
      setRemainingSeconds(testingDurationSeconds);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [started, isTestingMode, attemptCompleted, sessionStartedAt, testingDurationSeconds]);

  useEffect(() => {
    if (!started || !isTestingMode || attemptCompleted || deadlineAt === null) {
      return;
    }

    const tick = () => {
      const nextRemaining = Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);
    };

    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, [started, isTestingMode, attemptCompleted, deadlineAt]);

  useEffect(() => {
    if (!started || !isTestingMode || attemptCompleted || remainingSeconds !== 0 || submitting || !activeQuiz || !activeAttempt) {
      return;
    }

    void (async () => {
      setSubmitting(true);
      try {
        const answerMap = Object.fromEntries(
          questions.map((question) => [
            question.id,
            normalizeAnswerForSubmission(question, activeAttempt.answers[question.id]?.input ?? drafts[question.id] ?? {}),
          ]),
        );
        const nextAttempt = await submitAttempt(activeAttempt.id, activeQuiz, answerMap);
        setLoadState({ status: "ready", quiz: activeQuiz, attempt: nextAttempt });
        setReviewingSubmittedAttempt(true);
        setCurrentIndex(0);
      } finally {
        setSubmitting(false);
      }
    })();
  }, [started, isTestingMode, attemptCompleted, remainingSeconds, submitting, questions, activeAttempt, activeQuiz, drafts]);

  if (loadState.status === "loading") {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-[var(--erg-shadow)]">
        Đang tải bài làm...
      </div>
    );
  }

  if (loadState.status === "error" || !activeQuiz || !activeAttempt || !activeQuestion) {
    return (
      <div className="rounded-3xl border border-red-100 bg-white p-8 text-red-600 shadow-[var(--erg-shadow)]">
        {loadState.status === "error" ? loadState.message : "Quiz unavailable."}
      </div>
    );
  }

  const readyQuiz: Quiz = activeQuiz;
  const readyAttempt: Attempt = activeAttempt;
  const readyQuestion: Question = activeQuestion;
  const resultDisplay: QuizResultDisplay = { ...defaultResultDisplay, ...(readyQuiz.result ?? {}) };

  const playerCardStyle = {
    backgroundColor: "var(--quiz-player-bg)",
    borderColor: "var(--quiz-canvas-border)",
  };
  const canvasStyle = {
    backgroundColor: "var(--quiz-player-bg)",
    borderColor: "var(--quiz-canvas-border)",
  };
  const headerStyle = {
    background: "var(--quiz-header-bg)",
    color: "var(--quiz-header-text)",
  };
  const accentButtonStyle = {
    background: "linear-gradient(135deg, var(--quiz-accent-start), var(--quiz-accent-end))",
  };
  const secondaryButtonStyle = {
    borderColor: "var(--quiz-canvas-border)",
    backgroundColor: "var(--quiz-player-bg)",
    color: "var(--quiz-option-text)",
  };
  const modeBadgeStyle = isTrainingMode
    ? {
        background: "linear-gradient(135deg, rgba(16,185,129,0.14), rgba(5,150,105,0.22))",
        color: "#047857",
      }
    : {
        background: "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(14,116,144,0.22))",
        color: "#1d4ed8",
      };
  const sidebarActiveStyle = {
    background: "var(--quiz-sidebar-active-bg)",
    color: "var(--quiz-sidebar-active-text)",
  };
  const sidebarInputStyle = {
    backgroundColor: "var(--quiz-input-bg)",
    borderColor: "var(--quiz-canvas-border)",
  };
  const testingTimerTone =
    remainingSeconds !== null && remainingSeconds <= 60
      ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
      : "bg-slate-100 text-slate-700";

  async function handleRevealAnswer() {
    if (!currentAnswerComplete || submitted) {
      return;
    }

    setSubmitting(true);
    try {
      const normalizedAnswer = normalizeAnswerForSubmission(readyQuestion, draftAnswer);
      const response = await submitAnswer(readyAttempt.id, readyQuiz, readyQuestion.id, normalizedAnswer);
      setLoadState({ status: "ready", quiz: readyQuiz, attempt: response.attempt });

      if (!isLastQuestion) {
        if (autoAdvanceRef.current !== null) {
          window.clearTimeout(autoAdvanceRef.current);
        }

        autoAdvanceRef.current = window.setTimeout(() => {
          setCurrentIndex((value) => Math.min(questions.length - 1, value + 1));
          autoAdvanceRef.current = null;
        }, 1600);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFinalizeAttempt() {
    setSubmitDialogMode(null);
    setSubmitting(true);
    try {
      const answerMap = Object.fromEntries(
        questions.map((question) => [
          question.id,
          normalizeAnswerForSubmission(question, readyAttempt.answers[question.id]?.input ?? drafts[question.id] ?? {}),
        ]),
      );
      const nextAttempt = await submitAttempt(readyAttempt.id, readyQuiz, answerMap);
      setLoadState({ status: "ready", quiz: readyQuiz, attempt: nextAttempt });
      setReviewingSubmittedAttempt(true);
      setCurrentIndex(0);
    } finally {
      setSubmitting(false);
    }
  }

  function handleRequestSubmit() {
    setSubmitDialogMode(allQuestionsAnswered ? "all-answered" : "confirm");
  }

  function handleReviewQuiz() {
    setReviewingSubmittedAttempt(true);
    setCurrentIndex(0);
  }

  function handleDraftChange(next: AnswerPayload) {
    setDrafts((current) => {
      const previous = current[readyQuestion.id];
      if (areAnswerPayloadsEqual(previous, next)) {
        return current;
      }

      return {
        ...current,
        [readyQuestion.id]: next,
      };
    });
  }

  function handleJumpToQuestion(index: number) {
    if (!started) {
      setStarted(true);
      if (!isTestingMode) {
        setRemainingSeconds(null);
      }
    }
    setCurrentIndex(index);
  }

  function renderSidebar() {
    return (
      <aside
        className={`flex min-h-[380px] min-w-0 flex-col overflow-hidden rounded-[28px] border shadow-[var(--erg-shadow)] ${playerViewportClass}`}
        style={playerCardStyle}
      >
        <div className="flex gap-1 bg-slate-100 px-2 pt-3">
          {(["outline", "notes"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`flex-1 rounded-t-xl px-3 py-2 text-xs font-extrabold tracking-wide ${
                sidebarTab === tab ? "shadow-[0_12px_28px_rgba(0,0,139,0.16)]" : "text-slate-700"
              }`}
              style={sidebarTab === tab ? sidebarActiveStyle : undefined}
              onClick={() => setSidebarTab(tab)}
            >
              {tab === "outline" ? "MỤC LỤC" : "GHI CHÚ"}
            </button>
          ))}
        </div>

        {sidebarTab === "outline" ? (
          <>
            <div className="relative bg-slate-100 px-3 py-3">
              <input
                type="search"
                value={sidebarQuery}
                onChange={(event) => setSidebarQuery(event.target.value)}
                placeholder="Tìm kiếm"
                className="min-h-9 w-full border px-3 pr-10 text-sm text-slate-600 outline-none"
                style={sidebarInputStyle}
              />
              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-lg text-slate-500">⌕</span>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-auto bg-slate-100 px-3 pb-4">
              {!started ? (
                <button
                  type="button"
                  className="flex items-start gap-3 rounded-2xl bg-slate-100 p-2 text-left"
                  onClick={() => setStarted(false)}
                >
                  <span className="h-11 w-[86px] flex-none rounded-sm bg-[linear-gradient(145deg,transparent_54%,#1794d8_55%,#1794d8_72%,transparent_73%),linear-gradient(140deg,transparent_70%,#d51471_71%,#d51471_94%,transparent_95%),#fff]" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <strong className="line-clamp-2 text-xs font-bold text-slate-600">1. Trang giới thiệu</strong>
                    <small className="text-[11px] text-slate-400">{readyQuiz.subtitle}</small>
                  </span>
                </button>
              ) : null}

              {filteredQuestions.map((question) => {
                const index = questions.findIndex((item) => item.id === question.id);
                const active = started && currentIndex === index;
                const answered = isAnswerComplete(question, readyAttempt.answers[question.id]?.input ?? drafts[question.id]);

                return (
                  <button
                    key={question.id}
                    type="button"
                    className={`flex items-start gap-3 rounded border p-2 text-left transition ${
                      active ? "border-transparent shadow-[0_18px_40px_rgba(0,0,139,0.18)]" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                    style={active ? sidebarActiveStyle : undefined}
                    onClick={() => handleJumpToQuestion(index)}
                  >
                    <span
                      className={`inline-flex h-11 w-[86px] flex-none items-center justify-center rounded-sm text-sm font-extrabold ${
                        active ? "bg-white/14 text-white" : "bg-[linear-gradient(135deg,#eef4ff,#dbeafe)]"
                      }`}
                      style={!active ? { color: "var(--quiz-accent-start)" } : undefined}
                    >
                      {answered ? "✓" : index + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <strong className={`line-clamp-3 text-xs font-bold ${active ? "text-white" : "text-slate-600"}`}>
                        {`${index + 1}. ${question.title}`}
                      </strong>
                      <small className={`text-[11px] ${active ? "text-white/75" : "text-slate-400"}`}>
                        {questionLabel(question)}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="grid gap-3 p-4 text-sm leading-6 text-slate-500">
            <h3 className="text-lg font-extrabold text-slate-800">Ghi chú cho giáo viên</h3>
            <p>
              Khu này có thể hiển thị ghi chú hướng dẫn, script giảng dạy, đáp án mẫu hoặc checklist để giống cách
              iSpring chia Outline và Notes.
            </p>
            <p>Ở bản clone sản phẩm thật, mình khuyến nghị cho phép authoring dashboard soạn note theo từng slide.</p>
          </div>
        )}
      </aside>
    );
  }

  if (!started) {
    return (
      <QuizThemeSurface quiz={readyQuiz} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section
          className={`flex flex-col rounded-[32px] border p-3 shadow-[var(--erg-shadow-lg)] ${playerViewportClass}`}
          style={playerCardStyle}
        >
          <div className="flex min-h-9 items-center justify-between px-3 pb-3 text-sm text-slate-500">
            <span>Tài nguyên</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden border" style={canvasStyle}>
            <div className="grid h-full overflow-auto gap-6 p-6 sm:p-10 lg:grid-cols-[minmax(340px,1fr)_minmax(280px,0.9fr)] lg:p-12">
              <div className="flex flex-col justify-center gap-4">
                <p className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--quiz-accent-start)" }}>
                  {quiz.subtitle}
                </p>
                <h1
                  className="max-w-[720px] text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
                  style={{ color: "var(--quiz-accent-end)" }}
                >
                  {quiz.title}
                </h1>
                <p className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--quiz-option-text)" }}>
                  Bấm &quot;Bắt đầu&quot; để bắt đầu làm bài.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em]" style={modeBadgeStyle}>
                    {isTrainingMode ? "Chế độ luyện tập" : "Chế độ kiểm tra"}
                  </span>
                  {isTrainingMode ? (
                    <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-[0_10px_24px_rgba(26,44,64,0.08)]">
                      Xem đáp án từng câu và tự động sang câu tiếp theo
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-[0_10px_24px_rgba(26,44,64,0.08)]">
                      Làm hết bài rồi mới nộp và chấm điểm
                    </span>
                  )}
                </div>
                <ul className="grid gap-2 text-lg leading-8 sm:text-[22px]" style={{ color: "var(--quiz-option-text)" }}>
                  <li>Lecture: Nguyen Phat Tai</li>
                  <li>Tong Thanh Nhan</li>
                  <li>Nguyen Hoang Minh</li>
                  <li>Tran Hoang Trinh</li>
                </ul>
              </div>

              <div
                className="relative overflow-hidden rounded-[28px]"
                style={{
                  background: `radial-gradient(circle at top left, rgba(255,255,255,0.4), transparent 30%), linear-gradient(145deg, var(--quiz-accent-start) 0%, var(--quiz-accent-end) 55%, #0f172a 100%)`,
                }}
              >
                <div className="absolute left-6 top-6 flex flex-col gap-2 rounded-3xl bg-white/92 p-6 shadow-[0_16px_38px_rgba(30,48,77,0.12)]">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: "var(--quiz-accent-start)" }}>
                    {isTrainingMode ? "LUYỆN TẬP" : "KIỂM TRA"}
                  </span>
                  <strong className="text-4xl font-black leading-none sm:text-[42px]" style={{ color: "var(--quiz-accent-end)" }}>
                    {isTrainingMode ? "Học theo bước" : "Làm bài đánh giá"}
                  </strong>
                  <span className="text-base font-bold text-slate-600">Version {quiz.version}</span>
                </div>
                <div className="absolute right-10 top-24 h-60 w-60 rounded-full bg-[rgb(255_255_255_/_0.12)] blur-sm sm:h-[312px] sm:w-[312px]" />
                <div className="absolute bottom-14 right-6 h-32 w-60 rotate-[-22deg] rounded-full bg-[rgb(204_0_34_/_0.3)] blur-sm sm:h-44 sm:w-80" />
                <div className="absolute bottom-14 left-16 h-20 w-20 rounded-full bg-[rgb(255_255_255_/_0.16)]" />
              </div>
            </div>
          </div>

          <div className="flex min-h-14 items-center justify-between gap-3 px-3 pt-4">
            <span className="text-sm font-bold tracking-[0.02em] text-slate-500">
              {isTrainingMode ? "Luyện tập: xem đáp án từng câu" : "Kiểm tra: nộp bài ở cuối cùng"}
            </span>
            <div className="ml-auto flex gap-2">
              <button
                className={navButtonClass}
                style={accentButtonStyle}
                type="button"
                onClick={() => {
                  setStarted(true);
                  if (!isTestingMode) {
                    setRemainingSeconds(null);
                  }
                }}
              >
                BẮT ĐẦU
              </button>
            </div>
          </div>
        </section>

        {renderSidebar()}
      </QuizThemeSurface>
    );
  }

  return (
    <QuizThemeSurface quiz={readyQuiz} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section
        className={`flex min-w-0 flex-col rounded-[32px] border p-3 shadow-[var(--erg-shadow-lg)] ${playerViewportClass}`}
        style={playerCardStyle}
      >
        <div className="flex min-h-9 items-center justify-between gap-3 px-3 pb-3 text-sm text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>Tài nguyên</span>
            <span className="text-slate-300">|</span>
            <span>{`Câu ${currentIndex + 1} / ${questions.length}`}</span>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
              {allQuestionsAnswered ? "Đã hoàn tất" : `${questions.filter((question) => isAnswerComplete(question, readyAttempt.answers[question.id]?.input ?? drafts[question.id])).length}/${questions.length} đã trả lời`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em]" style={modeBadgeStyle}>
              {readyQuiz.settings.mode}
            </span>
            {isTestingMode && remainingSeconds !== null ? (
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${testingTimerTone}`}>
                {formatTimer(remainingSeconds)}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className="relative min-h-[560px] min-w-0 flex-1 overflow-hidden rounded-[24px] border lg:flex lg:min-h-0 lg:flex-col"
          style={{
            ...canvasStyle,
            background:
              "radial-gradient(circle at 12% 84%, rgba(204,0,34,0.08), transparent 14%), radial-gradient(circle at 82% 76%, rgba(29,78,216,0.09), transparent 16%), radial-gradient(circle at 64% 20%, rgba(59,130,246,0.08), transparent 17%), radial-gradient(circle at 20% 26%, rgba(248,208,211,0.14), transparent 16%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,1))",
          }}
        >
          <div className="mx-3 mt-3 rounded-[20px] px-4 py-4 sm:mx-6 sm:mt-6 sm:px-5" style={headerStyle}>
            <h2 className="text-2xl font-bold leading-[1.18] sm:text-3xl lg:text-[40px]">
              {attemptCompleted && !reviewingSubmittedAttempt ? resultDisplay[readyAttempt.passed ? "passMessage" : "failMessage"] : readyQuestion.title}
            </h2>
          </div>

          <div className="relative min-h-[460px] overflow-auto px-4 pb-12 pt-5 sm:px-8 lg:min-h-0 lg:flex-1">
            {attemptCompleted && !reviewingSubmittedAttempt ? (
              <FinalResultScreen
                attempt={readyAttempt}
                resultDisplay={resultDisplay}
                onReview={handleReviewQuiz}
              />
            ) : null}

            {attemptCompleted && !reviewingSubmittedAttempt ? null : (
              <>
            {false ? (
              <div className="mb-5 overflow-hidden rounded-[26px] border border-slate-200 bg-white/90 shadow-[0_14px_28px_rgba(26,44,64,0.09)]">
                <div className="flex items-center justify-between px-4 py-3 text-sm font-black text-white" style={accentButtonStyle}>
                  <span>Kết quả bài làm</span>
                  <span>{readyAttempt.passed ? "Đạt" : "Chưa đạt"}</span>
                </div>
                <div className="grid gap-3 px-4 py-4 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Điểm</div>
                    <div className="mt-1 text-xl font-black text-slate-900">
                      {readyAttempt.totalScore}/{readyAttempt.maxScore}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Tỷ lệ</div>
                    <div className="mt-1 text-xl font-black text-slate-900">{readyAttempt.percent}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Đã nộp</div>
                    <div className="mt-1 text-xl font-black text-slate-900">
                      {readyAttempt.submittedCount}/{readyAttempt.totalQuestions}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Mục tiêu</div>
                    <div className="mt-1 text-xl font-black text-slate-900">{readyQuiz.settings.passPercent}%</div>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-4 py-4">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, readyAttempt.percent)}%`,
                        background: "linear-gradient(135deg, var(--quiz-accent-start), var(--quiz-accent-end))",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <QuestionRenderer
              question={readyQuestion}
              value={draftAnswer}
              onChange={handleDraftChange}
              submitted={submitted}
              reviewMode={submitted}
              result={lastResult}
            />

            {lastResult ? <QuestionFeedbackPanel result={lastResult} /> : null}

            {submitted && readyQuestion.kind === "hotspot" ? <AnswerKeyCard question={readyQuestion} /> : null}

            {isTrainingMode && submitted && !isLastQuestion ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-bold text-slate-500 shadow-[0_8px_20px_rgba(26,44,64,0.08)]">
                Đang chuyển sang câu tiếp theo...
              </div>
            ) : null}

            <div className="pointer-events-none absolute bottom-4 right-6 text-xl font-extrabold opacity-30 sm:text-2xl" style={{ color: "var(--quiz-option-text)" }}>
              ERG E-LEARNING
            </div>
              </>
            )}
          </div>
        </div>

        <div className="flex min-h-14 flex-col gap-3 px-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em]" style={modeBadgeStyle}>
              {isTrainingMode ? "Học theo từng câu" : "Chế độ kiểm tra"}
            </span>
            <span className="text-sm font-bold tracking-[0.02em] text-slate-600">
              {isTrainingMode
                ? "Nhấn Đáp án để xem kết quả và hệ thống tự động sang câu tiếp theo."
                : reviewingAttempt
                  ? "Đang xem lại kết quả. Màu xanh là đáp án đúng, màu đỏ/cam là câu trả lời cần sửa."
                  : allQuestionsAnswered
                  ? "Tất cả câu hỏi đã có câu trả lời. Bạn có thể nộp bài."
                  : "Dùng Quay lại / Tiếp theo để rà soát bài trước khi nộp."}
            </span>
          </div>

          {isTrainingMode ? (
            <div className="ml-auto flex items-center gap-2">
              {submitted ? (
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-600">
                  Đã mở đáp án
                </span>
              ) : null}
              <button
                className={navButtonClass}
                style={accentButtonStyle}
                type="button"
                disabled={!currentAnswerComplete || submitted || submitting}
                onClick={() => void handleRevealAnswer()}
              >
                {submitting ? "ĐANG XEM..." : isLastQuestion && submitted ? "HOÀN TẤT" : "ĐÁP ÁN"}
              </button>
            </div>
          ) : attemptCompleted && !reviewingSubmittedAttempt ? (
            <div className="ml-auto flex flex-wrap gap-2">
              {resultDisplay.showReviewButton ? (
                <button className={navButtonClass} style={accentButtonStyle} type="button" onClick={handleReviewQuiz}>
                  {resultDisplay.reviewButtonLabel}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                className={secondaryButtonClass}
                style={secondaryButtonStyle}
                type="button"
                disabled={isFirstQuestion || submitting}
                onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
              >
                QUAY LẠI
              </button>
              <button
                className={navButtonClass}
                style={accentButtonStyle}
                type="button"
                disabled={isLastQuestion || (!reviewingAttempt && !currentAnswerComplete) || submitting}
                onClick={() => setCurrentIndex((value) => Math.min(questions.length - 1, value + 1))}
              >
                TIẾP THEO
              </button>
              {allQuestionsAnswered && !attemptCompleted ? (
                <button
                  className={navButtonClass}
                  style={accentButtonStyle}
                type="button"
                disabled={submitting}
                  onClick={handleRequestSubmit}
                >
                  {submitting ? "ĐANG NỘP..." : "NỘP BÀI"}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {renderSidebar()}

      {submitDialogMode ? (
        <SubmitConfirmDialog
          mode={submitDialogMode}
          resultDisplay={resultDisplay}
          submitting={submitting}
          onCancel={() => setSubmitDialogMode(null)}
          onConfirm={() => void handleFinalizeAttempt()}
        />
      ) : null}
    </QuizThemeSurface>
  );
}

function FinalResultScreen({
  attempt,
  resultDisplay,
  onReview,
}: {
  attempt: Attempt;
  resultDisplay: QuizResultDisplay;
  onReview: () => void;
}) {
  const resultMessage = attempt.passed ? resultDisplay.passMessage : resultDisplay.failMessage;

  return (
    <div className="relative grid min-h-[500px] place-items-center overflow-hidden bg-white px-8 py-10">
      <div className="pointer-events-none absolute left-8 top-7 h-28 w-36 rounded-[52%] bg-emerald-100 opacity-70" />
      <div className="pointer-events-none absolute -left-20 top-52 h-28 w-80 rotate-[-24deg] rounded-full bg-pink-300 opacity-70" />
      <div className="pointer-events-none absolute right-[-72px] top-5 h-24 w-96 rotate-[-24deg] rounded-full bg-sky-300 opacity-80" />
      <div className="pointer-events-none absolute right-[-60px] top-28 h-24 w-72 rotate-[-24deg] rounded-full bg-pink-300 opacity-75" />
      <div className="pointer-events-none absolute bottom-8 right-28 h-44 w-56 rounded-[42%] bg-amber-100 opacity-80" />

      <div className="relative z-10 grid justify-items-center gap-5 text-center">
        <div
          className={`grid h-24 w-24 place-items-center rounded-full text-6xl font-light text-white ${
            attempt.passed ? "bg-emerald-500" : "bg-[#f35b48]"
          }`}
        >
          {attempt.passed ? "✓" : "×"}
        </div>
        <h2 className="text-3xl font-black tracking-[0.08em] text-[#b9535f] sm:text-4xl">
          {resultMessage}
        </h2>
        <div className="grid gap-2">
          <span className="text-2xl font-black text-[#173653]">Điểm</span>
          <strong className="text-3xl font-black text-[#b9535f]">
            {attempt.totalScore}/{attempt.maxScore}
          </strong>
          <span className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">
            {attempt.percent}%
          </span>
        </div>
        {resultDisplay.showReviewButton ? (
          <button
            type="button"
            onClick={onReview}
            className="min-h-14 rounded-lg border-2 border-blue-500 bg-[#1e6172] px-7 text-xl font-black uppercase tracking-[0.05em] text-white shadow-[0_14px_28px_rgba(29,78,216,0.18)]"
          >
            {resultDisplay.reviewButtonLabel}
          </button>
        ) : null}
        <div className="text-5xl font-black tracking-[0.06em] text-fuchsia-300 opacity-90">
          {resultDisplay.thankYouMessage}
        </div>
      </div>
    </div>
  );
}

function QuestionFeedbackPanel({ result }: { result: AnswerResult }) {
  const tone = result.correct ? "correct" : "wrong";
  const title = result.correct ? "Đáp án chính xác!" : result.partiallyRight ? "Đáp án gần đúng!" : "Đáp án chưa đúng!";
  const headerClass =
    tone === "correct"
      ? "bg-[#78b816]"
      : result.partiallyRight
        ? "bg-[#f59e0b]"
        : "bg-[#e65a4d]";

  return (
    <div className="mx-auto mt-8 w-full max-w-[884px] overflow-hidden rounded-lg bg-white shadow-[0_16px_38px_rgba(15,23,42,0.16)]">
      <div className={`flex min-h-14 items-center justify-between px-7 text-2xl font-black text-white ${headerClass}`}>
        <span>{title}</span>
        <span className="text-3xl font-light">⌄</span>
      </div>
      <div className="px-7 py-8 text-xl leading-8 text-slate-950">{result.message}</div>
    </div>
  );
}

function SubmitConfirmDialog({
  mode,
  resultDisplay,
  submitting,
  onCancel,
  onConfirm,
}: {
  mode: SubmitDialogMode;
  resultDisplay: QuizResultDisplay;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isAllAnswered = mode === "all-answered";

  return (
    <div className="fixed inset-0 z-[260] grid place-items-center bg-black/10">
      <div className="flex w-[min(590px,calc(100vw-56px))] items-center gap-4 border border-slate-300 bg-white px-7 py-8 shadow-[0_8px_24px_rgba(15,23,42,0.28)]">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-full border-2 border-slate-500 text-xl font-black text-slate-500">
          ?
        </div>
        <div className="grid flex-1 gap-6">
          <p className="text-sm font-medium text-slate-900">
            {isAllAnswered ? resultDisplay.submitAllPrompt : resultDisplay.confirmSubmitPrompt}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={onConfirm}
              className="min-h-9 min-w-[136px] bg-[#4f86dd] px-5 text-sm font-black text-white shadow-sm outline outline-1 outline-offset-[-4px] outline-white/45 disabled:opacity-60"
            >
              {submitting
                ? "SUBMITTING..."
                : isAllAnswered
                  ? resultDisplay.submitAllLabel
                  : resultDisplay.confirmYesLabel}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={onCancel}
              className="min-h-9 min-w-[136px] bg-[#4f86dd] px-5 text-sm font-black text-white shadow-sm disabled:opacity-60"
            >
              {isAllAnswered ? resultDisplay.returnToQuizLabel : resultDisplay.confirmNoLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnswerKeyCard({ question }: { question: Question }) {
  const lines = getAnswerKeyLines(question);

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_8px_20px_rgba(26,44,64,0.08)]">
      <div className="px-4 py-3 text-sm font-black text-white" style={{ background: "linear-gradient(135deg, var(--quiz-accent-start), var(--quiz-accent-end))" }}>
        Đáp án
      </div>
      <div className="grid gap-2 px-4 py-4 text-sm leading-6 text-slate-600">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function getAnswerKeyLines(question: Question): string[] {
  switch (question.kind) {
    case "single_choice":
    case "true_false":
      return (question.choices ?? []).filter((choice) => choice.correct).map((choice) => `Đáp án đúng: ${choice.label}`);
    case "multiple_response":
      return (question.choices ?? []).filter((choice) => choice.correct).map((choice) => `Đáp án đúng: ${choice.label}`);
    case "short_answer":
    case "fill_blank":
      return (question.textBlanks ?? []).map(
        (blank, index) => `${index + 1}. ${blank.label}: ${blank.correctAnswers[0] ?? ""}`,
      );
    case "numeric":
      return question.numericAnswer
        ? [`Đáp án đúng: ${question.numericAnswer.correctValue}${question.numericAnswer.unit ? ` ${question.numericAnswer.unit}` : ""}`]
        : [];
    case "matching":
      return (question.matching ?? []).map((pair, index) => `${index + 1}. ${pair.prompt} -> ${pair.response}`);
    case "sequence":
      return (question.sequenceItems ?? []).map((item, index) => `${index + 1}. ${item.label}`);
    case "inline_choice":
    case "select_from_lists":
      return (question.inlineBlanks ?? []).map(
        (blank, index) => `${index + 1}. ${blank.statement}: ${formatInlineOption(blank.correctOptionId)}`,
      );
    case "drag_words":
      return (question.wordSlots ?? []).map((slot, index) => {
        const word = question.wordBank?.find((item) => item.id === slot.correctWordId);
        return `${index + 1}. ${slot.label}: ${word?.label ?? ""}`;
      });
    case "hotspot":
      return ["Vùng đáp án đúng đã được hiển thị trên hình."];
    case "drag_drop":
      return (question.dragDropItems ?? []).map((item, index) => {
        const target = question.dropTargets?.find((candidate) => candidate.id === item.correctTargetId);
        return `${index + 1}. ${item.label} -> ${target?.label ?? ""}`;
      });
    case "likert_scale":
      return ["Câu khảo sát ghi nhận mức độ lựa chọn, không có đáp án đúng sai tuyệt đối."];
    case "essay":
      return (question.essayRubric ?? []).map((item) => `${item.label}: ${item.points}đ`);
    default:
      return [];
  }
}

function formatInlineOption(option: string) {
  if (option === "yes") {
    return "Có";
  }

  if (option === "no") {
    return "Không";
  }

  return option;
}

function areAnswerPayloadsEqual(left?: AnswerPayload, right?: AnswerPayload) {
  if (left === right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return (
    left.choiceId === right.choiceId &&
    stringArraysEqual(left.choiceIds, right.choiceIds) &&
    stringArraysEqual(left.matchingOrder, right.matchingOrder) &&
    stringArraysEqual(left.matchingConnectedRows, right.matchingConnectedRows) &&
    stringArraysEqual(left.sequenceOrder, right.sequenceOrder) &&
    recordsEqual(left.matchingAssignments, right.matchingAssignments) &&
    recordsEqual(left.inlineSelections, right.inlineSelections) &&
    recordsEqual(left.textResponses, right.textResponses) &&
    recordsEqual(left.dragWordPlacements, right.dragWordPlacements) &&
    recordsEqual(left.dragDropPlacements, right.dragDropPlacements) &&
    recordsEqual(left.likertResponses, right.likertResponses) &&
    left.numericValue === right.numericValue &&
    left.essayText === right.essayText &&
    left.hotspotPoint?.x === right.hotspotPoint?.x &&
    left.hotspotPoint?.y === right.hotspotPoint?.y
  );
}

function stringArraysEqual(left?: string[], right?: string[]) {
  if (left === right) {
    return true;
  }

  if (!left || !right || left.length !== right.length) {
    return false;
  }

  return left.every((item, index) => item === right[index]);
}

function recordsEqual(left?: Record<string, string>, right?: Record<string, string>) {
  if (left === right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => left[key] === right[key]);
}

function formatTimer(totalSeconds: number) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function questionLabel(question: Question) {
  switch (question.kind) {
    case "single_choice":
      return "Chọn 1 đáp án";
    case "multiple_response":
      return "Chọn nhiều đáp án";
    case "true_false":
      return "Đúng / Sai";
    case "short_answer":
      return "Trả lời ngắn";
    case "numeric":
      return "Số học";
    case "matching":
      return "Nối cặp";
    case "sequence":
      return "Sắp xếp thứ tự";
    case "fill_blank":
      return "Điền chỗ trống";
    case "inline_choice":
      return "Chọn trong dòng";
    case "select_from_lists":
      return "Chọn từ danh sách";
    case "drag_words":
      return "Kéo từ";
    case "hotspot":
      return "Điểm nóng";
    case "drag_drop":
      return "Kéo và thả";
    case "likert_scale":
      return "Thang Likert";
    case "essay":
      return "Tự luận";
    default:
      return "Câu hỏi";
  }
}
