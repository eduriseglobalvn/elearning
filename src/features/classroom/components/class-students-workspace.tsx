import { useDeferredValue, useMemo, useState } from "react";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import { DashboardMetricCard, DashboardPageShell, DashboardSectionCard, DashboardStatusBadge } from "@/components/dashboard/dashboard-page-shell";
import { Button, Input, ProgressBar } from "@/components/ui/dashboard-kit";
import { useI18n } from "@/features/i18n";
import {
  classroomSnapshots,
  defaultClassId,
  getStudentsByClass,
} from "@/features/classroom/api/mock-classroom-data";
import type { ClassroomStudent } from "@/features/classroom/types/classroom-types";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";
import { cn } from "@/lib/utils";

export function ClassStudentsWorkspace({
  activeLeaf,
  onOpenLeaf,
}: {
  activeLeaf: DashboardLeaf;
  onOpenLeaf: (leafId: string) => void;
}) {
  const { locale } = useI18n();
  const copy = locale === "vi" ? viCopy : enCopy;
  const [classId, setClassId] = useState(defaultClassId);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const deferredSearchValue = useDeferredValue(searchValue);

  const currentClass = classroomSnapshots.find((snapshot) => snapshot.id === classId) ?? classroomSnapshots[0];
  const students = useMemo(() => getStudentsByClass(classId), [classId]);
  const visibleStudents = useMemo(() => {
    const keyword = deferredSearchValue.trim().toLowerCase();
    if (!keyword) {
      return students;
    }

    return students.filter((student) => {
      const haystack = `${student.name} ${student.currentAssignment} ${student.currentStage} ${student.mentorNote}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [deferredSearchValue, students]);

  const selectedStudent = visibleStudents.find((student) => student.id === selectedStudentId) ?? visibleStudents[0] ?? students[0] ?? null;
  const steadyCount = students.filter((student) => student.status === "steady").length;
  const aheadCount = students.filter((student) => student.status === "ahead").length;
  const supportCount = students.filter((student) => student.status === "support").length;

  return (
    <DashboardPageShell
      badge={copy.badge}
      title={activeLeaf.title}
      description={copy.description}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={
        <>
          <div className="relative min-w-[240px]">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => onOpenLeaf("class-reports")}>
            {copy.openReports}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <DashboardMetricCard
          label={copy.metrics.currentClass}
          value={currentClass?.className ?? "-"}
          detail={`${currentClass?.schoolName ?? "-"} • ${currentClass?.homeroomTeacher ?? "-"}`}
          delta={copy.metrics.currentClassDelta}
          icon={<GroupOutlinedIcon fontSize="inherit" />}
        />
        <DashboardMetricCard
          label={copy.metrics.ahead}
          value={`${aheadCount}`}
          detail={copy.metrics.aheadDetail}
          delta={copy.metrics.aheadDelta}
          icon={<EmojiEventsOutlinedIcon fontSize="inherit" />}
          tone="emerald"
        />
        <DashboardMetricCard
          label={copy.metrics.steady}
          value={`${steadyCount}`}
          detail={copy.metrics.steadyDetail}
          delta={copy.metrics.steadyDelta}
          icon={<TrendingUpOutlinedIcon fontSize="inherit" />}
          tone="blue"
        />
        <DashboardMetricCard
          label={copy.metrics.support}
          value={`${supportCount}`}
          detail={copy.metrics.supportDetail}
          delta={copy.metrics.supportDelta}
          icon={<TrendingUpOutlinedIcon fontSize="inherit" />}
          tone="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <DashboardSectionCard
          title={copy.tableTitle}
          description={copy.tableDescription}
          action={
            <select
              value={classId}
              onChange={(event) => {
                setClassId(event.target.value);
                setSelectedStudentId(null);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm outline-none"
            >
              {classroomSnapshots.map((snapshot) => (
                <option key={snapshot.id} value={snapshot.id}>
                  {snapshot.className} • {snapshot.schoolName}
                </option>
              ))}
            </select>
          }
        >
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <div className="grid grid-cols-[minmax(0,1.05fr)_0.9fr_120px_120px_130px] gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span>{copy.table.student}</span>
              <span>{copy.table.currentWork}</span>
              <span>{copy.table.progress}</span>
              <span>{copy.table.average}</span>
              <span className="text-right">{copy.table.status}</span>
            </div>

            <div className="divide-y divide-slate-200 bg-white">
              {visibleStudents.map((student) => {
                const active = selectedStudent?.id === student.id;

                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudentId(student.id)}
                    className={cn(
                      "grid w-full grid-cols-[minmax(0,1.05fr)_0.9fr_120px_120px_130px] gap-3 px-4 py-4 text-left transition",
                      active ? "bg-blue-50/70" : "hover:bg-slate-50/80",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                          {student.avatarSeed}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-950">{student.name}</div>
                          <div className="truncate text-sm text-slate-500">{student.lastActivity}</div>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-950">{student.currentAssignment}</div>
                      <div className="truncate text-sm text-slate-500">{student.currentStage}</div>
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <div className="text-sm font-semibold text-slate-900">{student.progressRate}%</div>
                      <ProgressBar
                        value={student.progressRate}
                        className="h-2.5 bg-slate-200"
                        indicatorClassName={student.progressRate >= 80 ? "bg-emerald-500" : student.progressRate >= 45 ? "bg-amber-500" : "bg-rose-500"}
                      />
                    </div>
                    <div className="flex items-center text-sm font-semibold text-slate-900">{student.averageScore}</div>
                    <div className="flex items-center justify-end">
                      <DashboardStatusBadge
                        label={copy.status[student.status]}
                        tone={student.status === "ahead" ? "success" : student.status === "steady" ? "secondary" : "warning"}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title={copy.studentPanelTitle} description={copy.studentPanelDescription}>
          {selectedStudent ? <StudentDetailCard student={selectedStudent} copy={copy} /> : null}
        </DashboardSectionCard>
      </div>
    </DashboardPageShell>
  );
}

function StudentDetailCard({
  student,
  copy,
}: {
  student: ClassroomStudent;
  copy: typeof viCopy;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-slate-900 text-base font-semibold text-white">
            {student.avatarSeed}
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-950">{student.name}</div>
            <div className="mt-1 text-sm text-slate-500">
              {student.className} • {student.schoolName}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-white/70 bg-white p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.progressLabel}</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{student.progressRate}%</div>
          </div>
          <div className="rounded-[18px] border border-white/70 bg-white p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.scoreLabel}</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{student.averageScore}</div>
          </div>
          <div className="rounded-[18px] border border-white/70 bg-white p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.streakLabel}</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{student.streakDays}</div>
          </div>
          <div className="rounded-[18px] border border-white/70 bg-white p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.completedLabel}</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{student.completedAssignments}</div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="text-sm font-semibold text-slate-950">{copy.currentAssignmentTitle}</div>
        <div className="mt-2 text-sm leading-6 text-slate-500">{student.currentAssignment}</div>
        <div className="mt-3 rounded-[18px] bg-slate-50 px-4 py-3 text-sm text-slate-600">{student.currentStage}</div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="text-sm font-semibold text-slate-950">{copy.mentorNoteTitle}</div>
        <div className="mt-2 text-sm leading-6 text-slate-500">{student.mentorNote}</div>
      </div>
    </div>
  );
}

const viCopy = {
  badge: "Class students",
  description:
    "Quản lý học sinh ngay trong lớp hiện tại: em nào đang làm bài nào, tiến độ ra sao và giáo viên nên can thiệp theo cách nào.",
  searchPlaceholder: "Tìm theo tên, bài đang làm hoặc ghi chú...",
  openReports: "Mở báo cáo thi đua",
  metrics: {
    currentClass: "Lớp hiện tại",
    currentClassDelta: "Đổi lớp để xem roster chi tiết",
    ahead: "Đang bứt tốc",
    aheadDetail: "Nhóm có thể giao thêm challenge.",
    aheadDelta: "Có thể kéo vào thi đua lớp",
    steady: "Đúng nhịp",
    steadyDetail: "Giữ được tiến độ làm bài ổn định.",
    steadyDelta: "Ưu tiên giữ flow hiện tại",
    support: "Cần hỗ trợ",
    supportDetail: "Nguy cơ trễ hạn hoặc rơi khỏi chuỗi học.",
    supportDelta: "Nên nhắc trong hôm nay",
  },
  tableTitle: "Danh sách học sinh trong lớp",
  tableDescription: "Nhìn nhanh bài đang làm, tiến độ và tình trạng học tập để giáo viên ra quyết định ngay.",
  table: {
    student: "Học sinh",
    currentWork: "Đang làm",
    progress: "Tiến độ",
    average: "TB điểm",
    status: "Trạng thái",
  },
  status: {
    ahead: "Bứt tốc",
    steady: "Ổn định",
    support: "Cần hỗ trợ",
  },
  studentPanelTitle: "Hồ sơ thao tác nhanh",
  studentPanelDescription: "Tập trung vào một học sinh để xem tình hình hiện tại và gợi ý hành động.",
  progressLabel: "Tiến độ",
  scoreLabel: "TB điểm",
  streakLabel: "Chuỗi ngày",
  completedLabel: "Bài hoàn thành",
  currentAssignmentTitle: "Bài đang làm",
  mentorNoteTitle: "Gợi ý cho giáo viên",
};

const enCopy = {
  badge: "Class students",
  description:
    "Manage the current class roster in detail: who is working on which assignment, how far they are, and how the teacher should intervene.",
  searchPlaceholder: "Search by name, live assignment, or note...",
  openReports: "Open competition reports",
  metrics: {
    currentClass: "Current class",
    currentClassDelta: "Switch classes to review the roster",
    ahead: "Accelerating",
    aheadDetail: "Good candidates for challenge work.",
    aheadDelta: "Can be moved into competition focus",
    steady: "On rhythm",
    steadyDetail: "Maintaining healthy submission flow.",
    steadyDelta: "Protect the current flow",
    support: "Need support",
    supportDetail: "At risk of late submission or losing continuity.",
    supportDelta: "Should be nudged today",
  },
  tableTitle: "Students in class",
  tableDescription: "See live work, progress, and learning state so the teacher can decide fast.",
  table: {
    student: "Student",
    currentWork: "Current work",
    progress: "Progress",
    average: "Avg score",
    status: "Status",
  },
  status: {
    ahead: "Ahead",
    steady: "Steady",
    support: "Support",
  },
  studentPanelTitle: "Quick action profile",
  studentPanelDescription: "Focus on one student to review the current state and the best teacher action.",
  progressLabel: "Progress",
  scoreLabel: "Avg score",
  streakLabel: "Streak",
  completedLabel: "Completed",
  currentAssignmentTitle: "Current assignment",
  mentorNoteTitle: "Teacher recommendation",
};
