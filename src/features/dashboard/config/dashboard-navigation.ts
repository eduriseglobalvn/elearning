import type { DashboardGroup, DashboardLeaf, DashboardLeafVariant } from "@/features/dashboard/types/dashboard-types";
import type { MessageKey } from "@/features/i18n";

type Translate = (key: MessageKey, params?: Record<string, string | number>) => string;

type BuildDashboardSectionsOptions = {
  showAdminOperations?: boolean;
};

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

export function buildDashboardSections(t: Translate, options: BuildDashboardSectionsOptions = {}): DashboardGroup[] {
  const root = t("dashboard.systemOverviewCrumb1");
  const operations = t("dashboard.start");
  const learningMaterials = t("sidebar.manageLearningMaterials");
  const classroom = t("sidebar.classroom");
  const internalDocs = t("sidebar.internalDocs");
  const settings = t("common.settings");
  const genericDescription = t("dashboard.defaultWorkspaceDescription");

  if (options.showAdminOperations) {
    return [
      {
        iconKey: "admin",
        title: operations,
        items: [
          createLeaf(
            "admin-overview",
            "Tổng quan hệ thống",
            operations,
            root,
            "Theo dõi trung tâm, học sinh, dữ liệu import và quyền truy cập ở cấp ERG.",
            "admin-overview",
          ),
          createLeaf(
            "admin-centers",
            "Quản lý trung tâm",
            operations,
            root,
            "Thêm mới, chỉnh sửa và theo dõi trạng thái vận hành của từng trung tâm.",
            "admin-centers",
          ),
          createLeaf(
            "admin-students",
            "Quản lý học sinh",
            operations,
            root,
            "Tra cứu học sinh toàn hệ thống hoặc theo từng trung tâm/lớp.",
            "admin-students",
          ),
          createLeaf(
            "admin-sheet-import",
            "Nhập học sinh từ Google Sheet",
            operations,
            root,
            "Kiểm tra dữ liệu sheet, map cột, tạo username và trả kết quả cho admin.",
            "admin-sheet-import",
          ),
          createLeaf(
            "admin-permissions",
            "Phân quyền",
            operations,
            root,
            "Kiểm soát ai được dùng scope ERG, trung tâm và học liệu toàn hệ thống.",
            "admin-permissions",
          ),
        ],
      },
      {
        iconKey: "materials",
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
          createLeaf(
            "quiz-bank",
            t("sidebar.quizBank"),
            learningMaterials,
            root,
            genericDescription,
            "quiz-bank",
          ),
        ],
      },
      {
        iconKey: "settings",
        title: settings,
        items: [
          createLeaf("general-settings", t("sidebar.generalSettings"), settings, root, genericDescription, "placeholder"),
          createLeaf("permissions", t("sidebar.permissions"), settings, root, genericDescription, "placeholder"),
        ],
      },
    ];
  }

  return [
    {
      iconKey: "operations",
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
      iconKey: "materials",
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
        createLeaf(
          "quiz-bank",
          t("sidebar.quizBank"),
          learningMaterials,
          root,
          genericDescription,
          "quiz-bank",
        ),
      ],
    },
    {
      iconKey: "classroom",
      title: classroom,
      items: [
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
      ],
    },
    {
      iconKey: "docs",
      title: internalDocs,
      items: [
        createLeaf("user-guide", t("sidebar.userGuide"), internalDocs, root, genericDescription, "placeholder"),
        createLeaf("ops-process", t("sidebar.opsProcess"), internalDocs, root, genericDescription, "placeholder"),
      ],
    },
    {
      iconKey: "settings",
      title: settings,
      items: [
        createLeaf("general-settings", t("sidebar.generalSettings"), settings, root, genericDescription, "placeholder"),
        createLeaf("permissions", t("sidebar.permissions"), settings, root, genericDescription, "placeholder"),
      ],
    },
  ];
}
