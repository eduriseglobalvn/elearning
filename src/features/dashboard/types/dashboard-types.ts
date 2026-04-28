export type DashboardLeafVariant =
  | "admin-overview"
  | "admin-centers"
  | "admin-students"
  | "admin-sheet-import"
  | "admin-permissions"
  | "overview"
  | "school-pulse"
  | "question-bank"
  | "quiz-bank"
  | "quiz-editor"
  | "class-students"
  | "class-reports"
  | "placeholder";

export type DashboardLeaf = {
  id: string;
  title: string;
  breadcrumb: string[];
  description: string;
  variant: DashboardLeafVariant;
};

export type DashboardGroup = {
  iconKey?: "operations" | "materials" | "classroom" | "docs" | "settings" | "admin";
  title: string;
  items: DashboardLeaf[];
};
