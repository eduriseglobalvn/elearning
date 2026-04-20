import type { AnswerPayload, Question } from "@/lib/types";

export type QuestionComponentProps = {
  question: Question;
  value: AnswerPayload;
  onChange: (next: AnswerPayload) => void;
  submitted?: boolean;
  reviewMode?: boolean;
};
