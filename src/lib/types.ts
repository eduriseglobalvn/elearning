export type Theme = {
  pageBackground: string;
  playerBackground: string;
  canvasBorder: string;
  headerBackground: string;
  headerText: string;
  accentStart: string;
  accentEnd: string;
  optionText: string;
  optionSelectedBackground: string;
  inputBackground: string;
  sidebarActiveBackground: string;
  sidebarActiveText: string;
};

export type QuizSettings = {
  mode: "training" | "testing";
  timeLimitMinutes?: number;
  passPercent: number;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  revealFeedbackPerStep: boolean;
};

export type QuizResultDisplay = {
  passMessage: string;
  failMessage: string;
  reviewButtonLabel: string;
  thankYouMessage: string;
  showReviewButton: boolean;
  submitAllPrompt: string;
  confirmSubmitPrompt: string;
  submitAllLabel: string;
  returnToQuizLabel: string;
  confirmYesLabel: string;
  confirmNoLabel: string;
};

export type Feedback = {
  correct: string;
  incorrect: string;
  partial: string;
};

export type QuestionImage = {
  url: string;
  alt?: string;
};

export type Choice = {
  id: string;
  label: string;
  correct: boolean;
};

export type MatchingPair = {
  id: string;
  prompt: string;
  response: string;
};

export type SequenceItem = {
  id: string;
  label: string;
};

export type InlineBlank = {
  id: string;
  statement: string;
  options: string[];
  correctOptionId: string;
  selectPosition?: "before" | "after";
};

export type HotspotArea = {
  id: string;
  shape: "rect" | "ellipse" | "polygon";
  x: number;
  y: number;
  width: number;
  height: number;
  correct: boolean;
};

export type HotspotImage = {
  url: string;
  width: number;
  height: number;
};

export type QuestionKind =
  | "single_choice"
  | "multiple_response"
  | "matching"
  | "sequence"
  | "inline_choice"
  | "hotspot";

export type Question = {
  id: string;
  kind: QuestionKind;
  title: string;
  instructions?: string;
  points: number;
  feedback: Feedback;
  contentImage?: QuestionImage;
  choices?: Choice[];
  matching?: MatchingPair[];
  sequenceItems?: SequenceItem[];
  inlineBlanks?: InlineBlank[];
  hotspotImage?: HotspotImage;
  hotspotAreas?: HotspotArea[];
};

export type Section = {
  id: string;
  title: string;
  questions: Question[];
};

export type Quiz = {
  id: string;
  title: string;
  subtitle: string;
  version: string;
  description: string;
  themeId: string;
  theme: Theme;
  settings: QuizSettings;
  result?: QuizResultDisplay;
  sections: Section[];
};

export type QuizSummary = {
  id: string;
  title: string;
  subtitle: string;
  version: string;
  sectionCount: number;
  questionCount: number;
};

export type HotspotPoint = {
  x: number;
  y: number;
};

export type AnswerPayload = {
  choiceId?: string;
  choiceIds?: string[];
  matchingOrder?: string[];
  matchingAssignments?: Record<string, string>;
  matchingConnectedRows?: string[];
  sequenceOrder?: string[];
  inlineSelections?: Record<string, string>;
  hotspotPoint?: HotspotPoint;
};

export type AnswerResult = {
  questionId: string;
  correct: boolean;
  partiallyRight: boolean;
  awardedPoints: number;
  maxPoints: number;
  message: string;
  correctChoiceIds?: string[];
  correctMatchingOrder?: string[];
  correctSequenceOrder?: string[];
  correctInlineSelections?: Record<string, string>;
};

export type AnswerRecord = {
  questionId: string;
  input: AnswerPayload;
  result: AnswerResult;
};

export type Attempt = {
  id: string;
  quizId: string;
  submittedCount: number;
  totalQuestions: number;
  totalScore: number;
  maxScore: number;
  percent: number;
  passed: boolean;
  answers: Record<string, AnswerRecord>;
};

export type StudentProgressStatus = "not_started" | "in_progress" | "submitted";

export type StudentProgress = {
  id: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  mode: QuizSettings["mode"];
  status: StudentProgressStatus;
  currentQuestionIndex: number;
  currentQuestionTitle: string;
  answeredCount: number;
  totalQuestions: number;
  percentComplete: number;
  score: number | null;
  passed: boolean | null;
  startedAt: string | null;
  submittedAt: string | null;
  lastActiveAt: string;
};
