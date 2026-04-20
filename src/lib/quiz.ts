import type {
  AnswerPayload,
  AnswerResult,
  HotspotArea,
  HotspotPoint,
  MatchingPair,
  Question,
  Quiz,
} from "@/lib/types";

export function getAllQuestions(quiz: Quiz): Question[] {
  return quiz.sections.flatMap((section) => section.questions);
}

export function getQuestionById(quiz: Quiz, questionId: string): Question | undefined {
  return getAllQuestions(quiz).find((question) => question.id === questionId);
}

export function scoreQuestion(question: Question, answer: AnswerPayload): AnswerResult {
  const result: AnswerResult = {
    questionId: question.id,
    correct: false,
    partiallyRight: false,
    awardedPoints: 0,
    maxPoints: question.points,
    message: question.feedback.incorrect,
  };

  switch (question.kind) {
    case "single_choice": {
      const correctIds = question.choices?.filter((choice) => choice.correct).map((choice) => choice.id) ?? [];
      result.correctChoiceIds = correctIds;
      if (answer.choiceId && correctIds[0] === answer.choiceId) {
        result.correct = true;
        result.awardedPoints = question.points;
        result.message = question.feedback.correct;
      }
      return result;
    }
    case "multiple_response": {
      const correctIds = question.choices?.filter((choice) => choice.correct).map((choice) => choice.id) ?? [];
      const chosenIds = [...(answer.choiceIds ?? [])].sort();
      const expectedIds = [...correctIds].sort();
      result.correctChoiceIds = expectedIds;
      if (JSON.stringify(chosenIds) === JSON.stringify(expectedIds)) {
        result.correct = true;
        result.awardedPoints = question.points;
        result.message = question.feedback.correct;
        return result;
      }

      const matched = chosenIds.filter((choiceId) => expectedIds.includes(choiceId)).length;
      if (matched > 0 && expectedIds.length > 0) {
        result.partiallyRight = true;
        result.awardedPoints = Math.floor((question.points * matched) / expectedIds.length);
        result.message = question.feedback.partial;
      }
      return result;
    }
    case "matching": {
      const correctOrder = question.matching?.map((pair) => pair.id) ?? [];
      result.correctMatchingOrder = correctOrder;
      const currentOrder = normalizeMatchingOrder(question.matching ?? [], answer);
      if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
        result.correct = true;
        result.awardedPoints = question.points;
        result.message = question.feedback.correct;
        return result;
      }
      const matched = currentOrder.filter((item, index) => item === correctOrder[index]).length;
      if (matched > 0 && correctOrder.length > 0) {
        result.partiallyRight = true;
        result.awardedPoints = Math.floor((question.points * matched) / correctOrder.length);
        result.message = question.feedback.partial;
      }
      return result;
    }
    case "sequence": {
      const correctOrder = question.sequenceItems?.map((item) => item.id) ?? [];
      const currentOrder = answer.sequenceOrder ?? [];
      result.correctSequenceOrder = correctOrder;
      if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
        result.correct = true;
        result.awardedPoints = question.points;
        result.message = question.feedback.correct;
        return result;
      }
      const matched = currentOrder.filter((item, index) => item === correctOrder[index]).length;
      if (matched > 0 && correctOrder.length > 0) {
        result.partiallyRight = true;
        result.awardedPoints = Math.floor((question.points * matched) / correctOrder.length);
        result.message = question.feedback.partial;
      }
      return result;
    }
    case "inline_choice": {
      const correctInlineSelections = Object.fromEntries(
        (question.inlineBlanks ?? []).map((blank) => [blank.id, blank.correctOptionId]),
      );
      result.correctInlineSelections = correctInlineSelections;
      const matched = (question.inlineBlanks ?? []).filter(
        (blank) => answer.inlineSelections?.[blank.id] === blank.correctOptionId,
      ).length;

      if (matched === (question.inlineBlanks?.length ?? 0)) {
        result.correct = true;
        result.awardedPoints = question.points;
        result.message = question.feedback.correct;
        return result;
      }
      if (matched > 0 && (question.inlineBlanks?.length ?? 0) > 0) {
        result.partiallyRight = true;
        result.awardedPoints = Math.floor((question.points * matched) / (question.inlineBlanks?.length ?? 1));
        result.message = question.feedback.partial;
      }
      return result;
    }
    case "hotspot": {
      const point = answer.hotspotPoint;
      const area = question.hotspotAreas?.find((candidate) => candidate.correct);
      if (point && area && pointInArea(point, area)) {
        result.correct = true;
        result.awardedPoints = question.points;
        result.message = question.feedback.correct;
      }
      return result;
    }
    default:
      return result;
  }
}

export function isAnswerComplete(question: Question, answer?: AnswerPayload | null): boolean {
  if (!answer) {
    return false;
  }

  switch (question.kind) {
    case "single_choice":
      return Boolean(answer.choiceId);
    case "multiple_response":
      return (answer.choiceIds?.length ?? 0) > 0;
    case "matching":
      return (answer.matchingOrder?.length ?? 0) > 0;
    case "sequence":
      return (answer.sequenceOrder?.length ?? 0) > 0;
    case "inline_choice":
      return (question.inlineBlanks ?? []).every((blank) => Boolean(answer.inlineSelections?.[blank.id]));
    case "hotspot":
      return Boolean(answer.hotspotPoint);
    default:
      return false;
  }
}

export function normalizeAnswerForSubmission(question: Question, answer?: AnswerPayload | null): AnswerPayload {
  const safeAnswer = answer ?? {};

  if (question.kind === "matching") {
    if (safeAnswer.matchingOrder?.length) {
      return safeAnswer;
    }

    if (safeAnswer.matchingAssignments) {
      return {
        ...safeAnswer,
        matchingOrder: normalizeMatchingOrder(question.matching ?? [], safeAnswer),
      };
    }
  }

  return safeAnswer;
}

function pointInArea(point: HotspotPoint, area: HotspotArea): boolean {
  return (
    point.x >= area.x &&
    point.x <= area.x + area.width &&
    point.y >= area.y &&
    point.y <= area.y + area.height
  );
}

export function createInitialAnswer(question: Question): AnswerPayload {
  switch (question.kind) {
    case "multiple_response":
      return { choiceIds: [] };
    case "matching":
      return {
        matchingOrder: [...(question.matching ?? [])].map((pair) => pair.id).reverse(),
        matchingConnectedRows: [],
      };
    case "sequence":
      return {
        sequenceOrder: [...(question.sequenceItems ?? [])].map((item) => item.id).reverse(),
      };
    case "inline_choice":
      return { inlineSelections: {} };
    default:
      return {};
  }
}

export function normalizeMatchingOrder(pairs: MatchingPair[], answer: AnswerPayload): string[] {
  if (answer.matchingOrder && answer.matchingOrder.length) {
    return answer.matchingOrder;
  }

  if (!answer.matchingAssignments) {
    return [];
  }

  return pairs.map((pair) => answer.matchingAssignments?.[pair.id] ?? "");
}
