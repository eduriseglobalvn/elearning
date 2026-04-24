import type { DashboardGroup, DashboardLeaf, DashboardLeafVariant } from "@/features/dashboard/types/dashboard-types";
import type { MessageKey } from "@/features/i18n";

type Translate = (key: MessageKey, params?: Record<string, string | number>) => string;

function createLeaf(
  id: string,
  title: string,
  sectionTitle: string,
  rootTitle: string,
  description: string,
  variant: DashboardLeafVariant,
): DashboardLeaf {
  return {
    id,
    title,
    breadcrumb: [rootTitle, sectionTitle, title],
    description,
    variant,
  };
}

export function buildDashboardSections(t: Translate): DashboardGroup[] {
  const root = t("dashboard.systemOverviewCrumb1");
  const operations = t("dashboard.start");
  const learningMaterials = t("sidebar.manageLearningMaterials");
  const classroom = t("sidebar.classroom");
  const internalDocs = t("sidebar.internalDocs");
  const settings = t("common.settings");
  const genericDescription = t("dashboard.defaultWorkspaceDescription");

  return [
    {
      title: operations,
      items: [
        createLeaf(
          "ops-overview",
          t("dashboard.systemOverview"),
          operations,
          root,
          t("dashboard.systemOverviewWorkspaceDesc"),
          "overview",
        ),
        createLeaf(
          "school-pulse",
          t("dashboard.platformStructure"),
          operations,
          root,
          t("dashboard.platformStructureWorkspaceDesc"),
          "school-pulse",
        ),
      ],
    },
    {
      title: learningMaterials,
      items: [
        createLeaf(
          "course-modules",
          t("sidebar.createNewQuiz"),
          learningMaterials,
          root,
          t("dashboard.quizEditorWorkspaceDesc"),
          "quiz-editor",
        ),
        createLeaf(
          "question-bank",
          t("sidebar.questionBank"),
          learningMaterials,
          root,
          genericDescription,
          "question-bank",
        ),
      ],
    },
    {
      title: classroom,
      items: [
        createLeaf(
          "classroom-tracking",
          t("sidebar.classroomTracking"),
          classroom,
          root,
          genericDescription,
          "classroom-tracking",
        ),
        createLeaf(
          "assessment-control",
          t("sidebar.assessmentControl"),
          classroom,
          root,
          genericDescription,
          "assessment-control",
        ),
        createLeaf(
          "class-students",
          t("sidebar.classStudentManager"),
          classroom,
          root,
          genericDescription,
          "class-students",
        ),
        createLeaf(
          "class-reports",
          t("sidebar.classReports"),
          classroom,
          root,
          genericDescription,
          "class-reports",
        ),
        createLeaf(
          "student-journey",
          t("sidebar.studentJourney"),
          classroom,
          root,
          genericDescription,
          "student-journey",
        ),
      ],
    },
    {
      title: internalDocs,
      items: [
        createLeaf("user-guide", t("sidebar.userGuide"), internalDocs, root, genericDescription, "placeholder"),
        createLeaf("ops-process", t("sidebar.opsProcess"), internalDocs, root, genericDescription, "placeholder"),
      ],
    },
    {
      title: settings,
      items: [
        createLeaf("general-settings", t("sidebar.generalSettings"), settings, root, genericDescription, "placeholder"),
        createLeaf("permissions", t("sidebar.permissions"), settings, root, genericDescription, "placeholder"),
      ],
    },
  ];
}
