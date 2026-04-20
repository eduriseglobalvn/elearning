import type { ReactNode } from "react";

import type { AnswerPayload, Question } from "@/lib/types";

export function QuestionBodyWithImage({
  question,
  children,
}: {
  question: Question;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      {question.contentImage ? <QuestionContentImage question={question} /> : null}
      {children}
    </div>
  );
}

export function QuestionContentImage({
  question,
  className = "",
}: {
  question: Question;
  className?: string;
}) {
  if (!question.contentImage) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${className}`.trim()}
      style={{ borderColor: "var(--quiz-canvas-border)" }}
    >
      <img
        src={question.contentImage.url}
        alt={question.contentImage.alt ?? question.title}
        className="block h-auto max-h-[420px] w-full object-contain"
      />
    </div>
  );
}

export function InlineChoiceSelect({
  blank,
  submitted,
  value,
  onChange,
}: {
  blank: NonNullable<Question["inlineBlanks"]>[number];
  submitted: boolean;
  value: AnswerPayload;
  onChange: (next: AnswerPayload) => void;
}) {
  return (
    <label className="flex-none">
      <select
        className="min-h-13 min-w-[180px] rounded-lg border-2 px-4 text-xl font-bold outline-none"
        disabled={submitted}
        style={{
          borderColor: "var(--quiz-canvas-border)",
          backgroundColor: "var(--quiz-input-bg)",
          color: "var(--quiz-option-text)",
        }}
        value={value.inlineSelections?.[blank.id] ?? ""}
        onChange={(event) =>
          onChange({
            inlineSelections: {
              ...(value.inlineSelections ?? {}),
              [blank.id]: event.target.value,
            },
          })
        }
      >
        <option value="">- Chọn -</option>
        {blank.options.map((option) => (
          <option key={option} value={option}>
            {option === "yes" ? "Có" : option === "no" ? "Không" : option}
          </option>
        ))}
      </select>
    </label>
  );
}
