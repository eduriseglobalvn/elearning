import type { QuestionType } from "@/features/quiz-editor/types/quiz-editor-types";

export type QuestionBankSubjectId = "mathematics" | "english" | "science" | "informatics";

export type QuestionBankDifficulty = "core" | "stretch" | "challenge";

export type QuestionBankStatus = "ready" | "reviewing" | "pilot";

export type QuestionBankChoice = {
  id: string;
  label: string;
  correct: boolean;
};

export type QuestionBankCategory = {
  id: string;
  label: string;
};

export type QuestionBankSubject = {
  id: QuestionBankSubjectId;
  label: string;
  categories: QuestionBankCategory[];
};

export type QuestionBankQuestion = {
  id: string;
  subjectId: QuestionBankSubjectId;
  categoryId: string;
  subjectLabel: string;
  categoryLabel: string;
  gradeLabel: string;
  type: QuestionType;
  difficulty: QuestionBankDifficulty;
  status: QuestionBankStatus;
  stem: string;
  objective: string;
  tags: string[];
  masteryRate: number;
  usageCount: number;
  schoolsUsing: number;
  lastUsedAt: string;
  recommendedCluster: string;
  rationale?: string;
  answer?: string;
  choices?: QuestionBankChoice[];
};
