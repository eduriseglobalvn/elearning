import { useEffect, useState } from "react";

import { InlineChoiceSelect, QuestionBodyWithImage } from "@/components/quiz/questions/shared";
import type { QuestionComponentProps } from "@/components/quiz/questions/types";
import type { AnswerPayload } from "@/lib/types";

export function InlineChoiceQuestion({
  question,
  value,
  onChange,
  submitted = false,
  reviewMode = false,
  result,
}: QuestionComponentProps) {
  const [revealedBlankId, setRevealedBlankId] = useState<string | null>(null);
  const revealedWrongBlank = reviewMode
    ? question.inlineBlanks?.find((blank) => {
        if (blank.id !== revealedBlankId) {
          return false;
        }

        const selected = value.inlineSelections?.[blank.id];
        const correct = result?.correctInlineSelections?.[blank.id] ?? blank.correctOptionId;
        return selected && selected !== correct;
      })
    : null;
  const revealedWrongCorrectValue = revealedWrongBlank
    ? result?.correctInlineSelections?.[revealedWrongBlank.id] ?? revealedWrongBlank.correctOptionId
    : null;

  useEffect(() => {
    if (!reviewMode || !revealedBlankId) {
      return;
    }

    const revealedBlank = question.inlineBlanks?.find((blank) => blank.id === revealedBlankId);
    const selected = revealedBlank ? value.inlineSelections?.[revealedBlank.id] : null;
    const correct = revealedBlank
      ? result?.correctInlineSelections?.[revealedBlank.id] ?? revealedBlank.correctOptionId
      : null;

    if (!revealedBlank || !selected || selected === correct) {
      setRevealedBlankId(null);
    }
  }, [question.inlineBlanks, result?.correctInlineSelections, revealedBlankId, reviewMode, value.inlineSelections]);

  function handleChange(nextValue: AnswerPayload) {
    setRevealedBlankId(null);
    onChange(nextValue);
  }

  return (
    <QuestionBodyWithImage question={question}>
      <div className="relative flex flex-col gap-4">
        {question.inlineBlanks?.map((blank, index) => (
          <div key={blank.id} className="flex flex-wrap items-center gap-3">
            <span className="min-w-9 text-xl font-bold" style={{ color: "var(--quiz-option-text)" }}>
              {index + 1}.
            </span>
            {blank.selectPosition !== "after" ? (
              <InlineChoiceSelect
                blank={blank}
                correctValue={result?.correctInlineSelections?.[blank.id] ?? blank.correctOptionId}
                reviewMode={reviewMode}
                submitted={submitted}
                value={value}
                onChange={handleChange}
                onRevealCorrectAnswer={() => setRevealedBlankId(blank.id)}
              />
            ) : null}
            <span className="min-w-[240px] flex-1 text-xl leading-[1.5] sm:text-2xl" style={{ color: "var(--quiz-option-text)" }}>
              {blank.statement}
            </span>
            {blank.selectPosition === "after" ? (
              <InlineChoiceSelect
                blank={blank}
                correctValue={result?.correctInlineSelections?.[blank.id] ?? blank.correctOptionId}
                reviewMode={reviewMode}
                submitted={submitted}
                value={value}
                onChange={handleChange}
                onRevealCorrectAnswer={() => setRevealedBlankId(blank.id)}
              />
            ) : null}
          </div>
        ))}
        {revealedWrongBlank && revealedWrongCorrectValue ? (
          <div className="ml-[min(44vw,520px)] mt-1 w-[244px] rounded-lg border border-slate-200 bg-white px-7 py-6 shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
            <div className="text-xl font-black text-slate-950">Correct Answers</div>
            <div className="mt-5 flex items-center gap-3 text-base font-semibold text-slate-800">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#78b816] text-sm font-black text-white">
                ✓
              </span>
              <span>{formatInlineValue(revealedWrongCorrectValue)}</span>
            </div>
          </div>
        ) : null}
      </div>
    </QuestionBodyWithImage>
  );
}

function formatInlineValue(value: string) {
  if (value === "yes") {
    return "Có";
  }

  if (value === "no") {
    return "Không";
  }

  return value;
}
