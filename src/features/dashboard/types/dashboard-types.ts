export type DashboardLeafVariant =
  | "overview"
  | "school-pulse"
  | "question-bank"
  | "quiz-editor"
  | "classroom-tracking"
  | "class-students"
  | "assessment-control"
  | "class-reports"
  | "student-journey"
  | "placeholder";

export type DashboardLeaf = {
  id: string;
  title: string;
  breadcrumb: string[];
  description: string;
  variant: DashboardLeafVariant;
};

export type DashboardGroup = {
  title: string;
  items: DashboardLeaf[];
};
