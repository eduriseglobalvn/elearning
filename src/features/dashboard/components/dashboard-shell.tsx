import { useEffect, useMemo, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { buildDashboardSections } from "@/features/dashboard/config/dashboard-navigation";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";
import {
  classroomSnapshots,
  classroomSchools,
  defaultClassId,
  defaultSchoolId,
  getSchoolSnapshots,
} from "@/features/classroom/api/mock-classroom-data";
import { useI18n } from "@/features/i18n";
import type { QuestionBankQuestion } from "@/features/question-bank";
import type { ContentScope, DashboardUserPermissions, ManagementScope } from "@/types/scope-types";

const COMPACT_DASHBOARD_BREAKPOINT = 1280;
const currentUserPermissions: DashboardUserPermissions = {
  canAccessGlobalErg: true,
  assignedCenterIds: ["school-erg-alpha", "school-erg-east"],
};

export function DashboardShell() {
  const { t } = useI18n();
  const [managementScope, setManagementScope] = useState<ManagementScope>({
    level: "class",
    centerId: defaultSchoolId,
    classId: defaultClassId,
  });
  const isAdminScope = currentUserPermissions.canAccessGlobalErg && managementScope.level === "global";
  const dashboardSections = useMemo(
    () => buildDashboardSections(t, { showAdminOperations: isAdminScope }),
    [isAdminScope, t],
  );
  const availableLeaves = useMemo(
    () => dashboardSections.flatMap((section) => section.items),
    [dashboardSections],
  );
  const defaultLeaf = dashboardSections[0]?.items[0] ?? dashboardSections[1]!.items[0]!;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLeafId, setActiveLeafId] = useState(defaultLeaf.id);
  const [pendingQuestionImports, setPendingQuestionImports] = useState<QuestionBankQuestion[]>([]);

  const activeLeaf = availableLeaves.find((leaf) => leaf.id === activeLeafId) ?? defaultLeaf;
  const allowedSchoolIds = currentUserPermissions.assignedCenterIds;
  const selectedSchoolId = managementScope.centerId ?? defaultSchoolId;
  const selectedSchool = classroomSchools.find((school) => school.id === selectedSchoolId) ?? classroomSchools[0];
  const firstClassInSchool = getSchoolSnapshots(selectedSchoolId)[0];
  const selectedClassId =
    managementScope.level === "class" ? managementScope.classId : firstClassInSchool?.id ?? defaultClassId;
  const isSchoolDenied =
    managementScope.level !== "global" &&
    !currentUserPermissions.canAccessGlobalErg &&
    Boolean(managementScope.centerId) &&
    !allowedSchoolIds.includes(managementScope.centerId);
  const contentScope: ContentScope =
    managementScope.level === "global"
      ? { type: "global" }
      : { type: "center", centerId: selectedSchool.id, centerName: selectedSchool.name };

  useEffect(() => {
    if (!availableLeaves.some((leaf) => leaf.id === activeLeafId)) {
      setActiveLeafId(defaultLeaf.id);
    }
  }, [activeLeafId, availableLeaves, defaultLeaf.id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${COMPACT_DASHBOARD_BREAKPOINT - 1}px)`);

    const syncSidebarState = (event?: MediaQueryListEvent) => {
      const isCompact = event?.matches ?? mediaQuery.matches;
      if (isCompact) {
        setSidebarOpen(false);
      }
    };

    syncSidebarState();
    mediaQuery.addEventListener("change", syncSidebarState);

    return () => mediaQuery.removeEventListener("change", syncSidebarState);
  }, []);

  function openLeaf(leafId: string) {
    setActiveLeafId(leafId);
  }

  function createQuizFromBank(questions: QuestionBankQuestion[]) {
    setPendingQuestionImports(questions);
    setActiveLeafId("course-modules");
  }

  function selectScopeRoot(value: string) {
    if (value === "global" && currentUserPermissions.canAccessGlobalErg) {
      setManagementScope({ level: "global" });
      setActiveLeafId("admin-overview");
      return;
    }

    const firstClass = getSchoolSnapshots(value)[0];
    setManagementScope(
      firstClass ? { level: "class", centerId: value, classId: firstClass.id } : { level: "center", centerId: value },
    );
    setActiveLeafId("ops-overview");
  }

  function selectScopeDetail(value: string) {
    if (managementScope.level === "global") {
      setManagementScope({ level: "global", centerId: value === "all" ? undefined : value });
      return;
    }

    if (value === "center") {
      setManagementScope({ level: "center", centerId: selectedSchoolId });
      return;
    }

    selectClass(value);
  }

  function selectClass(classId: string) {
    const nextClass = classroomSnapshots.find((snapshot) => snapshot.id === classId);
    if (nextClass) {
      setManagementScope({ level: "class", centerId: nextClass.schoolId, classId: nextClass.id });
    }
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#f4f8fd] text-slate-950">
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="h-full">
        <SidebarTrigger
          aria-label={t("sidebar.expandMenu")}
          className="fixed left-3 top-3 z-50 border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
        />
        <AppSidebar
          activeLeafId={activeLeaf.id}
          allowedSchoolIds={allowedSchoolIds}
          canAccessGlobalErg={currentUserPermissions.canAccessGlobalErg}
          dashboardSections={dashboardSections}
          managementScope={managementScope}
          onSelectClass={selectClass}
          onSelectLeaf={openLeaf}
          onSelectScopeDetail={selectScopeDetail}
          onSelectScopeRoot={selectScopeRoot}
          selectedClassId={selectedClassId}
          selectedSchoolId={selectedSchoolId}
        />
        <SidebarInset className="min-h-0 overflow-hidden">
          <DashboardContent
            activeLeaf={activeLeaf}
            canAccessGlobalErg={currentUserPermissions.canAccessGlobalErg}
            contentScope={contentScope}
            deniedSchoolName={isSchoolDenied ? selectedSchool?.name : undefined}
            managementScope={managementScope}
            onOpenLeaf={openLeaf}
            pendingQuestionImports={pendingQuestionImports}
            selectedClassId={selectedClassId}
            selectedSchoolId={selectedSchoolId}
            onQuestionImportsHandled={() => setPendingQuestionImports([])}
            onCreateQuizFromBank={createQuizFromBank}
          />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
