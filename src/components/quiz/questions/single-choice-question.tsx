import { QuestionContentImage } from "@/components/quiz/questions/shared";
import type { QuestionComponentProps } from "@/components/quiz/questions/types";

export function SingleChoiceQuestion({
  question,
  value,
  onChange,
  submitted = false,
  reviewMode = false,
}: QuestionComponentProps) {
  const selectedId = value.choiceId;

  return (
    <div className={`grid gap-5 ${question.contentImage ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)] lg:items-start" : ""}`}>
      <div className="flex flex-col gap-3 sm:gap-4">
        {question.choices?.map((choice) => {
          const selected = selectedId === choice.id;
          const showCorrect = reviewMode && choice.correct;
          const showWrong = reviewMode && selected && !choice.correct;
          const containerStyle = showCorrect
            ? { backgroundColor: "#ecfdf5", borderColor: "#86efac" }
            : showWrong
              ? { backgroundColor: "#fff1f2", borderColor: "#fda4af" }
              : selected
                ? { backgroundColor: "var(--quiz-option-selected-bg)" }
                : undefined;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={submitted}
              className="flex w-full items-start gap-4 rounded-xl border border-transparent px-3 py-3 text-left transition hover:bg-slate-200/20"
              style={containerStyle}
              onClick={() => {
                if (submitted) return;
                onChange({ choiceId: choice.id });
              }}
            >
              <span
                className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 bg-white"
                style={{ borderColor: showCorrect ? "#22c55e" : showWrong ? "#ef4444" : "var(--quiz-canvas-border)" }}
              >
                {selected || showCorrect ? (
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: showCorrect ? "#22c55e" : showWrong ? "#ef4444" : "var(--quiz-accent-start)" }}
                  />
                ) : null}
              </span>
              <span className="text-xl leading-[1.5] sm:text-2xl" style={{ color: "var(--quiz-option-text)" }}>
                {choice.label}
              </span>
            </button>
          );
        })}
      </div>
      {question.contentImage ? <QuestionContentImage question={question} className="lg:sticky lg:top-0" /> : null}
    </div>
  );
}
