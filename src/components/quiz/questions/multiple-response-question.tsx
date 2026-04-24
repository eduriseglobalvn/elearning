import { QuestionContentImage } from "@/components/quiz/questions/shared";
import type { QuestionComponentProps } from "@/components/quiz/questions/types";

export function MultipleResponseQuestion({
  question,
  value,
  onChange,
  submitted = false,
  reviewMode = false,
}: QuestionComponentProps) {
  const selectedIds = new Set(value.choiceIds ?? []);

  return (
    <div className={`grid gap-5 ${question.contentImage ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)] lg:items-start" : ""}`}>
      <div className="flex flex-col gap-3 sm:gap-4">
        {question.choices?.map((choice) => {
          const selected = selectedIds.has(choice.id);
          const showCorrect = reviewMode && choice.correct;
          const showWrong = reviewMode && selected && !choice.correct;
          const showStatus = reviewMode && (showCorrect || showWrong);
          const containerStyle = showCorrect
            ? { backgroundColor: "rgba(255,255,255,0.9)", borderColor: "transparent" }
            : showWrong
              ? { backgroundColor: "rgba(255,255,255,0.9)", borderColor: "transparent" }
              : selected
                ? { backgroundColor: "var(--quiz-option-selected-bg)" }
                : undefined;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={submitted}
              className="grid w-full grid-cols-[40px_36px_minmax(0,1fr)] items-start gap-3 rounded-xl border border-transparent px-2 py-3 text-left transition hover:bg-slate-200/20"
              style={containerStyle}
              onClick={() => {
                if (submitted) return;
                const next = new Set(value.choiceIds ?? []);
                if (next.has(choice.id)) next.delete(choice.id);
                else next.add(choice.id);
                onChange({ choiceIds: [...next] });
              }}
            >
              <ReviewStatusIcon correct={showCorrect} visible={showStatus} />
              <span
                className="mt-1 inline-flex h-7 w-7 flex-none items-center justify-center rounded-md border-2 bg-white"
                style={{
                  borderColor: showCorrect ? "#78b816" : showWrong ? "#ff8b3d" : selected ? "var(--quiz-accent-start)" : "#cfd8df",
                }}
              >
                {selected || showCorrect ? (
                  <span
                    className="h-3 w-3 rounded-[3px]"
                    style={{ backgroundColor: showCorrect ? "#78b816" : showWrong ? "#ff8b3d" : "var(--quiz-accent-start)" }}
                  />
                ) : null}
              </span>
              <span
                className="text-xl leading-[1.5] sm:text-2xl"
                style={{ color: showCorrect ? "#006d93" : showWrong ? "#ff8b3d" : reviewMode ? "#8fbfd3" : "var(--quiz-option-text)" }}
              >
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

function ReviewStatusIcon({ correct, visible }: { correct: boolean; visible: boolean }) {
  if (!visible) {
    return <span className="mt-0.5 h-8 w-8" />;
  }

  return (
    <span
      className="mt-0.5 grid h-8 w-8 place-items-center rounded-full text-lg font-black text-white"
      style={{ backgroundColor: correct ? "#78b816" : "#e65a4d" }}
    >
      {correct ? "✓" : "×"}
    </span>
  );
}
