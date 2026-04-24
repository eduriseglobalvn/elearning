"use client"

import * as React from "react"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GraphicEqIcon,
  MapIcon,
  MenuBookIcon,
  PieChartIcon,
  QuizIcon,
  SchoolIcon,
  SettingsIcon,
  SmartToyIcon,
  TerminalIcon,
} from "@/components/icons"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { useI18n } from "@/features/i18n"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({
  activeLeafId,
  onSelectLeaf,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activeLeafId: string
  onSelectLeaf: (leafId: string) => void
}) {
  const { t } = useI18n()

  const data = {
    user: {
      name: "Nguyen Ngoc Anh",
      email: "ngocanh@erg.vn",
      avatar: "",
    },
    teams: [
      {
        name: "ERG Learning",
        logo: <SchoolIcon />,
        plan: t("locale.teacherHub"),
      },
      {
        name: "ERG Training",
        logo: <GraphicEqIcon />,
        plan: t("locale.operations"),
      },
      {
        name: "ERG Internal",
        logo: <TerminalIcon />,
        plan: t("locale.workspace"),
      },
    ],
      navMain: [
      {
        title: t("dashboard.start"),
        url: "#",
        icon: <PieChartIcon />,
        items: [
          {
            title: t("dashboard.systemOverview"),
            leafId: "ops-overview",
          },
          {
            title: t("dashboard.platformStructure"),
            leafId: "school-pulse",
          },
        ],
      },
      {
        title: t("sidebar.manageLearningMaterials"),
        url: "#",
        icon: <QuizIcon />,
        items: [
          {
            title: t("sidebar.createNewQuiz"),
            leafId: "course-modules",
          },
          {
            title: t("sidebar.questionBank"),
            leafId: "question-bank",
          },
        ],
      },
      {
        title: t("sidebar.classroom"),
        url: "#",
        icon: <SmartToyIcon />,
        items: [
          {
            title: t("sidebar.classroomTracking"),
            leafId: "classroom-tracking",
          },
          {
            title: t("sidebar.assessmentControl"),
            leafId: "assessment-control",
          },
          {
            title: t("sidebar.classStudentManager"),
            leafId: "class-students",
          },
          {
            title: t("sidebar.classReports"),
            leafId: "class-reports",
          },
          {
            title: t("sidebar.studentJourney"),
            leafId: "student-journey",
          },
        ],
      },
      {
        title: t("sidebar.internalDocs"),
        url: "#",
        icon: <MenuBookIcon />,
        items: [
          {
            title: t("sidebar.userGuide"),
            leafId: "user-guide",
          },
          {
            title: t("sidebar.opsProcess"),
            leafId: "ops-process",
          },
        ],
      },
      {
        title: t("common.settings"),
        url: "#",
        icon: <SettingsIcon />,
        items: [
          {
            title: t("sidebar.generalSettings"),
            leafId: "general-settings",
          },
          {
            title: t("sidebar.permissions"),
            leafId: "permissions",
          },
        ],
      },
    ],
    projects: [
      {
        name: t("sidebar.questionBank"),
        leafId: "question-bank",
        icon: <QuizIcon />,
      },
      {
        name: t("sidebar.classReports"),
        leafId: "class-reports",
        icon: <PieChartIcon />,
      },
      {
        name: t("sidebar.classStudentManager"),
        leafId: "class-students",
        icon: <SchoolIcon />,
      },
      {
        name: t("sidebar.studentJourney"),
        leafId: "student-journey",
        icon: <MapIcon />,
      },
    ],
  }

  const navMain = data.navMain.map((group) => ({
    ...group,
    isActive: group.items.some((item) => item.leafId === activeLeafId),
  }))

  return (
    <Sidebar variant="inset" collapsible="icon" className="relative overflow-visible" {...props}>
      <SidebarEdgeToggle />
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} activeLeafId={activeLeafId} onSelectLeaf={onSelectLeaf} />
        <NavProjects projects={data.projects} activeLeafId={activeLeafId} onSelectLeaf={onSelectLeaf} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

function SidebarEdgeToggle() {
  const { state, toggleSidebar } = useSidebar()
  const { t } = useI18n()
  const isExpanded = state === "expanded"

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={isExpanded ? t("sidebar.collapseMenu") : t("sidebar.expandMenu")}
      className="absolute top-1/2 -right-3 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_10px_28px_-14px_rgba(15,23,42,0.35)] ring-4 ring-background transition hover:bg-slate-50 hover:text-slate-950"
    >
      {isExpanded ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
    </button>
  )
}
