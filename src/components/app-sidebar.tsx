"use client"

import * as React from "react"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuBookIcon,
  PieChartIcon,
  QuizIcon,
  SchoolIcon,
  SettingsIcon,
  SmartToyIcon,
} from "@/components/icons"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { classroomSchools, getSchoolSnapshots } from "@/features/classroom/api/mock-classroom-data"
import type { DashboardGroup } from "@/features/dashboard/types/dashboard-types"
import { useI18n } from "@/features/i18n"
import type { ClassroomSchool, ClassroomSnapshot } from "@/features/classroom/types/classroom-types"
import { cn } from "@/lib/utils"
import type { ManagementScope } from "@/types/scope-types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({
  activeLeafId,
  allowedSchoolIds,
  canAccessGlobalErg,
  dashboardSections,
  managementScope,
  onSelectScopeDetail,
  onSelectScopeRoot,
  onSelectClass,
  onSelectLeaf,
  selectedClassId,
  selectedSchoolId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activeLeafId: string
  allowedSchoolIds: string[]
  canAccessGlobalErg: boolean
  dashboardSections: DashboardGroup[]
  managementScope: ManagementScope
  onSelectScopeDetail: (value: string) => void
  onSelectScopeRoot: (value: string) => void
  onSelectClass: (classId: string) => void
  onSelectLeaf: (leafId: string) => void
  selectedClassId: string
  selectedSchoolId: string
}) {
  const { locale } = useI18n()
  const accessibleSchoolIds = allowedSchoolIds ?? []
  const visibleSchools = canAccessGlobalErg
    ? classroomSchools
    : classroomSchools.filter((school) => accessibleSchoolIds.includes(school.id))
  const classOptions = getSchoolSnapshots(selectedSchoolId)

  const data = {
    user: {
      name: "Nguyen Ngoc Anh",
      email: "ngocanh@erg.vn",
      avatar: "",
    },
  }

  const navMain = dashboardSections.map((group) => ({
    ...group,
    url: "#",
    icon: getSectionIcon(group.iconKey),
    isActive: group.items.some((item) => item.id === activeLeafId),
    items: group.items.map((item) => ({
      title: item.title,
      leafId: item.id,
    })),
  }))

  return (
    <Sidebar variant="inset" collapsible="icon" className="relative overflow-visible" {...props}>
      <SidebarEdgeToggle />
      <SidebarHeader>
        <TeacherScopeSelector
          canAccessGlobalErg={canAccessGlobalErg}
          classes={classOptions}
          copy={locale === "vi" ? viScopeCopy : enScopeCopy}
          managementScope={managementScope}
          onSelectClass={onSelectClass}
          onSelectScopeDetail={onSelectScopeDetail}
          onSelectScopeRoot={onSelectScopeRoot}
          schools={visibleSchools}
          selectedClassId={selectedClassId}
          selectedSchoolId={selectedSchoolId}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} activeLeafId={activeLeafId} onSelectLeaf={onSelectLeaf} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

type TeacherScopeCopy = {
  app: string
  classLabel: string
  centerFilterLabel: string
  centerHelper: string
  centerLabel: string
  globalLabel: string
  globalOptionAllCenters: string
  helper: string
  noClass: string
  noSchool: string
  rootLabel: string
  schoolLabel: string
  students: string
  title: string
}

const viScopeCopy: TeacherScopeCopy = {
  app: "ERG Learning",
  classLabel: "Lớp",
  centerFilterLabel: "Trung tâm",
  centerHelper: "Lọc dữ liệu theo trung tâm",
  centerLabel: "Trung tâm",
  globalLabel: "ERG toàn hệ thống",
  globalOptionAllCenters: "Tất cả trung tâm",
  helper: "Theo lớp đã chọn",
  noClass: "Chưa có lớp trong trung tâm này",
  noSchool: "Chưa có trung tâm được phân công",
  rootLabel: "Phạm vi quản lý",
  schoolLabel: "Trung tâm",
  students: "học sinh",
  title: "Phạm vi quản lý",
}

const enScopeCopy: TeacherScopeCopy = {
  app: "ERG Learning",
  classLabel: "Class",
  centerFilterLabel: "Center",
  centerHelper: "Filter data by center",
  centerLabel: "Center",
  globalLabel: "ERG global",
  globalOptionAllCenters: "All centers",
  helper: "Selected class",
  noClass: "No class in this school",
  noSchool: "No assigned school",
  rootLabel: "Management scope",
  schoolLabel: "Center",
  students: "students",
  title: "Teaching scope",
}

function TeacherScopeSelector({
  canAccessGlobalErg,
  classes,
  copy,
  managementScope,
  onSelectClass,
  onSelectScopeDetail,
  onSelectScopeRoot,
  schools,
  selectedClassId,
  selectedSchoolId,
}: {
  canAccessGlobalErg: boolean
  classes: ClassroomSnapshot[]
  copy: TeacherScopeCopy
  managementScope: ManagementScope
  onSelectClass: (classId: string) => void
  onSelectScopeDetail: (value: string) => void
  onSelectScopeRoot: (value: string) => void
  schools: ClassroomSchool[]
  selectedClassId: string
  selectedSchoolId: string
}) {
  const scopeSelectId = React.useId()
  const detailSelectId = React.useId()
  const isGlobalScope = managementScope.level === "global"
  const selectedSchool = schools.find((school) => school.id === selectedSchoolId) ?? schools[0]
  const selectedClass = classes.find((classroom) => classroom.id === selectedClassId) ?? classes[0]
  const hasSchools = schools.length > 0
  const hasClasses = classes.length > 0
  const rootValue = isGlobalScope ? "global" : selectedSchool?.id ?? ""
  const detailLabel = isGlobalScope ? copy.centerFilterLabel : copy.classLabel
  const detailValue = isGlobalScope ? managementScope.centerId ?? "all" : managementScope.level === "class" ? selectedClass?.id ?? "center" : "center"
  const selectedGlobalCenter = isGlobalScope && managementScope.centerId
    ? schools.find((school) => school.id === managementScope.centerId)
    : undefined
  const selectedGlobalCenterClasses = selectedGlobalCenter ? getSchoolSnapshots(selectedGlobalCenter.id) : []
  const globalStudentCount = selectedGlobalCenterClasses.reduce((sum, classroom) => sum + classroom.studentCount, 0)
  const globalHelper = selectedGlobalCenter
    ? `${selectedGlobalCenterClasses.length} lớp · ${globalStudentCount} ${copy.students}`
    : `${schools.length} ${copy.centerLabel.toLowerCase()}`
  const detailHelper = isGlobalScope
    ? globalHelper
    : managementScope.level === "center"
      ? copy.centerHelper
      : copy.helper
  const compactTopTitle = isGlobalScope ? copy.globalLabel : selectedSchool?.name ?? copy.noSchool
  const compactBottomTitle = isGlobalScope
    ? selectedGlobalCenter?.name ?? copy.globalOptionAllCenters
    : selectedClass?.className ?? copy.noClass

  return (
    <>
      <div className="hidden flex-col items-center gap-2 py-1 group-data-[collapsible=icon]:flex">
        <div
          aria-label={`${copy.rootLabel}: ${compactTopTitle}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm"
          title={compactTopTitle}
        >
          <SchoolIcon className="h-4 w-4" />
        </div>
        <div
          aria-label={`${detailLabel}: ${compactBottomTitle}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
          title={compactBottomTitle}
        >
          <SmartToyIcon className="h-4 w-4" />
        </div>
      </div>

      <div
        className="space-y-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.45)] group-data-[collapsible=icon]:hidden"
        data-testid="teacher-scope-selector"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
            <SchoolIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-slate-950">{copy.app}</p>
            <p className="truncate text-[11px] text-slate-500">{copy.title}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor={scopeSelectId}>
            {copy.rootLabel}
          </label>
          <div className="relative">
            <select
              aria-label={copy.rootLabel}
              className={cn(
                "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-[13px] font-semibold text-slate-950 outline-none transition",
                "focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100",
                "disabled:cursor-not-allowed disabled:text-slate-400",
              )}
              disabled={!hasSchools}
              id={scopeSelectId}
              data-testid="scope-root-select"
              onChange={(event) => onSelectScopeRoot(event.target.value)}
              value={rootValue}
            >
              {hasSchools ? (
                <>
                  {canAccessGlobalErg ? <option value="global">{copy.globalLabel}</option> : null}
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">{copy.noSchool}</option>
              )}
            </select>
            <ChevronRightIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 translate-y-[-50%] rotate-90 text-slate-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500" htmlFor={detailSelectId}>
            {detailLabel}
          </label>
          <div className="relative">
            <select
              aria-label={detailLabel}
              className={cn(
                "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-[13px] font-semibold text-slate-950 outline-none transition",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              )}
              disabled={isGlobalScope ? !hasSchools : !hasClasses}
              id={detailSelectId}
              data-testid="scope-detail-select"
              onChange={(event) => {
                if (isGlobalScope) {
                  onSelectScopeDetail(event.target.value)
                  return
                }

                if (event.target.value === "center") {
                  onSelectScopeDetail(event.target.value)
                  return
                }

                onSelectClass(event.target.value)
              }}
              value={detailValue}
            >
              {isGlobalScope ? (
                <>
                  <option value="all">{copy.globalOptionAllCenters}</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </>
              ) : hasClasses ? (
                <>
                  <option value="center">{copy.centerLabel}: {selectedSchool?.name ?? copy.noSchool}</option>
                  {classes.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.className}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">{copy.noClass}</option>
              )}
            </select>
            <ChevronRightIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 translate-y-[-50%] rotate-90 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
          <span className="truncate">{detailHelper}</span>
          {!isGlobalScope && selectedClass && managementScope.level === "class" ? (
            <span className="ml-2 shrink-0 font-semibold text-slate-950">
              {selectedClass.studentCount} {copy.students}
            </span>
          ) : null}
        </div>
      </div>
    </>
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

function getSectionIcon(iconKey: DashboardGroup["iconKey"]) {
  if (iconKey === "materials") return <QuizIcon />
  if (iconKey === "classroom") return <SmartToyIcon />
  if (iconKey === "docs") return <MenuBookIcon />
  if (iconKey === "settings") return <SettingsIcon />
  if (iconKey === "admin") return <SchoolIcon />

  return <PieChartIcon />
}
