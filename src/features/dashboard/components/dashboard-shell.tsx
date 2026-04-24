import { useEffect, useMemo, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { buildDashboardSections } from "@/features/dashboard/config/dashboard-navigation";
import { DashboardContent } from "@/features/dashboard/components/dashboard-content";
import { useI18n } from "@/features/i18n";
import type { QuestionBankQuestion } from "@/features/question-bank";

const COMPACT_DASHBOARD_BREAKPOINT = 1280;

export function DashboardShell() {
  const { t } = useI18n();
  const dashboardSections = buildDashboardSections(t);
  const availableLeaves = useMemo(
    () => dashboardSections.flatMap((section) => section.items),
    [dashboardSections],
  );
  const defaultLeaf = dashboardSections[0]?.items[0] ?? dashboardSections[1]!.items[0]!;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLeafId, setActiveLeafId] = useState(defaultLeaf.id);
  const [pendingQuestionImports, setPendingQuestionImports] = useState<QuestionBankQuestion[]>([]);

  const activeLeaf = availableLeaves.find((leaf) => leaf.id === activeLeafId) ?? defaultLeaf;

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

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#f4f8fd] text-slate-950">
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="h-full">
        <AppSidebar activeLeafId={activeLeaf.id} onSelectLeaf={openLeaf} />
        <SidebarInset className="min-h-0 overflow-hidden">
          <DashboardContent
            activeLeaf={activeLeaf}
            onOpenLeaf={openLeaf}
            pendingQuestionImports={pendingQuestionImports}
            onQuestionImportsHandled={() => setPendingQuestionImports([])}
            onCreateQuizFromBank={createQuizFromBank}
          />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
