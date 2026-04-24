import { DragDropQuestion } from "@/components/quiz/questions/drag-drop-question";
import { DragWordsQuestion } from "@/components/quiz/questions/drag-words-question";
import { HotspotQuestion } from "@/components/quiz/questions/hotspot-question";
import { InlineChoiceQuestion } from "@/components/quiz/questions/inline-choice-question";
import { LikertQuestion } from "@/components/quiz/questions/likert-question";
import { MatchingQuestion } from "@/components/quiz/questions/matching-question";
import { MultipleResponseQuestion } from "@/components/quiz/questions/multiple-response-question";
import { SequenceQuestion } from "@/components/quiz/questions/sequence-question";
import { SingleChoiceQuestion } from "@/components/quiz/questions/single-choice-question";
import {
  EssayQuestion,
  FillBlankQuestion,
  NumericQuestion,
  ShortAnswerQuestion,
} from "@/components/quiz/questions/text-response-question";
import type { QuestionComponentProps } from "@/components/quiz/questions/types";

export function QuestionRenderer(props: QuestionComponentProps) {
  const { question } = props;

  switch (question.kind) {
    case "single_choice":
    case "true_false":
      return <SingleChoiceQuestion {...props} />;
    case "multiple_response":
      return <MultipleResponseQuestion {...props} />;
    case "short_answer":
      return <ShortAnswerQuestion {...props} />;
    case "numeric":
      return <NumericQuestion {...props} />;
    case "matching":
      return <MatchingQuestion {...props} />;
    case "sequence":
      return <SequenceQuestion {...props} />;
    case "fill_blank":
      return <FillBlankQuestion {...props} />;
    case "inline_choice":
    case "select_from_lists":
      return <InlineChoiceQuestion {...props} />;
    case "drag_words":
      return <DragWordsQuestion {...props} />;
    case "hotspot":
      return <HotspotQuestion {...props} />;
    case "drag_drop":
      return <DragDropQuestion {...props} />;
    case "likert_scale":
      return <LikertQuestion {...props} />;
    case "essay":
      return <EssayQuestion {...props} />;
    default:
      return null;
  }
}
