import { HotspotQuestion } from "@/components/quiz/questions/hotspot-question";
import { InlineChoiceQuestion } from "@/components/quiz/questions/inline-choice-question";
import { MatchingQuestion } from "@/components/quiz/questions/matching-question";
import { MultipleResponseQuestion } from "@/components/quiz/questions/multiple-response-question";
import { SequenceQuestion } from "@/components/quiz/questions/sequence-question";
import { SingleChoiceQuestion } from "@/components/quiz/questions/single-choice-question";
import type { QuestionComponentProps } from "@/components/quiz/questions/types";

export function QuestionRenderer(props: QuestionComponentProps) {
  const { question } = props;

  switch (question.kind) {
    case "single_choice":
      return <SingleChoiceQuestion {...props} />;
    case "multiple_response":
      return <MultipleResponseQuestion {...props} />;
    case "matching":
      return <MatchingQuestion {...props} />;
    case "sequence":
      return <SequenceQuestion {...props} />;
    case "inline_choice":
      return <InlineChoiceQuestion {...props} />;
    case "hotspot":
      return <HotspotQuestion {...props} />;
    default:
      return null;
  }
}
