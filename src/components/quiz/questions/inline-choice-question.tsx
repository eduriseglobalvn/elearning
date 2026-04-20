import { InlineChoiceSelect, QuestionBodyWithImage } from "@/components/quiz/questions/shared";
import type { QuestionComponentProps } from "@/components/quiz/questions/types";

export function InlineChoiceQuestion({ question, value, onChange, submitted = false }: QuestionComponentProps) {
  return (
    <QuestionBodyWithImage question={question}>
      <div className="flex flex-col gap-4">
        {question.inlineBlanks?.map((blank, index) => (
          <div key={blank.id} className="flex flex-wrap items-center gap-3">
            <span className="min-w-9 text-xl font-bold" style={{ color: "var(--quiz-option-text)" }}>
              {index + 1}.
            </span>
            {blank.selectPosition !== "after" ? (
              <InlineChoiceSelect blank={blank} submitted={submitted} value={value} onChange={onChange} />
            ) : null}
            <span className="min-w-[240px] flex-1 text-xl leading-[1.5] sm:text-2xl" style={{ color: "var(--quiz-option-text)" }}>
              {blank.statement}
            </span>
            {blank.selectPosition === "after" ? (
              <InlineChoiceSelect blank={blank} submitted={submitted} value={value} onChange={onChange} />
            ) : null}
          </div>
        ))}
      </div>
    </QuestionBodyWithImage>
  );
}
