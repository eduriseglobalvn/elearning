import { useMemo, useState } from "react";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

import { DashboardMetricCard, DashboardPageShell, DashboardSectionCard, DashboardSegmentedControl, DashboardStatusBadge } from "@/components/dashboard/dashboard-page-shell";
import { Button, ProgressBar } from "@/components/ui/dashboard-kit";
import { useI18n } from "@/features/i18n";
import {
  assignmentRuns,
  classroomSchools,
  defaultSchoolId,
  getSchoolSnapshots,
} from "@/features/classroom/api/mock-classroom-data";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";

export function ClassroomTrackingWorkspace({
  activeLeaf,
  onOpenLeaf,
}: {
  activeLeaf: DashboardLeaf;
  onOpenLeaf: (leafId: string) => void;
}) {
  const { locale } = useI18n();
  const copy = locale === "vi" ? viCopy : enCopy;
  const [schoolId, setSchoolId] = useState(defaultSchoolId);

  const school = classroomSchools.find((item) => item.id === schoolId) ?? classroomSchools[0];
  const schoolClasses = useMemo(() => getSchoolSnapshots(schoolId), [schoolId]);
  const highlightedAssignments = useMemo(
    () =>
      assignmentRuns
        .filter((assignment) => assignment.targetLevel === schoolClasses[0]?.gradeLabel || assignment.activeClasses >= 4)
        .slice(0, 3),
    [schoolClasses],
  );

  return (
    <DashboardPageShell
      badge={copy.badge}
      title={activeLeaf.title}
      description={copy.description}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={
        <>
          <DashboardSegmentedControl
            options={classroomSchools.map((item) => ({ value: item.id, label: item.name }))}
            value={schoolId}
            onChange={setSchoolId}
          />
          <Button variant="outline" onClick={() => onOpenLeaf("class-students")}>
            {copy.openStudents}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <DashboardMetricCard
          label={copy.metrics.school}
          value={school?.name ?? "-"}
          detail={`${copy.schoolLead}: ${school?.principal ?? "-"}`}
          delta={copy.metrics.schoolDelta}
          icon={<ApartmentOutlinedIcon fontSize="inherit" />}
        />
        <DashboardMetricCard
          label={copy.metrics.classes}
          value={`${schoolClasses.length}`}
          detail={copy.metrics.classesDetail}
          delta={copy.metrics.classesDelta}
          icon={<GroupOutlinedIcon fontSize="inherit" />}
          tone="emerald"
        />
        <DashboardMetricCard
          label={copy.metrics.liveAssignments}
          value={`${highlightedAssignments.length}`}
          detail={copy.metrics.liveAssignmentsDetail}
          delta={copy.metrics.liveAssignmentsDelta}
          icon={<AssignmentTurnedInOutlinedIcon fontSize="inherit" />}
          tone="amber"
        />
        <DashboardMetricCard
          label={copy.metrics.nextDeadline}
          value={schoolClasses[0]?.lastSubmissionAt ?? "-"}
          detail={copy.metrics.nextDeadlineDetail}
          delta={copy.metrics.nextDeadlineDelta}
          icon={<TimerOutlinedIcon fontSize="inherit" />}
          tone="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <DashboardSectionCard title={copy.classesTitle} description={copy.classesDescription}>
          <div className="space-y-3">
            {schoolClasses.map((snapshot) => (
              <div key={snapshot.id} className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-base font-semibold text-slate-950">{snapshot.className}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {snapshot.gradeLabel} • {copy.teacherLabel}: {snapshot.homeroomTeacher}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <DashboardStatusBadge label={`${snapshot.activeAssignments} ${copy.assignmentsLabel}`} tone="outline" />
                    <DashboardStatusBadge label={`${snapshot.riskStudents} ${copy.supportLabel}`} tone={snapshot.riskStudents >= 5 ? "warning" : "secondary"} />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {copy.completionLabel}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{snapshot.completionRate}%</div>
                    <ProgressBar value={snapshot.completionRate} className="mt-2 h-2.5 bg-slate-200" indicatorClassName="bg-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {copy.averageScoreLabel}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{snapshot.averageScore}</div>
                    <div className="mt-1 text-xs text-slate-500">{copy.autoGradedHint}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {copy.lastSubmissionLabel}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{snapshot.lastSubmissionAt}</div>
                    <div className="mt-1 text-xs text-slate-500">{copy.liveHeartbeatHint}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title={copy.scheduleTitle} description={copy.scheduleDescription} action={<Button variant="outline" onClick={() => onOpenLeaf("assessment-control")}>{copy.openAssignmentCenter}</Button>}>
          <div className="space-y-3">
            {highlightedAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{assignment.title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {assignment.subjectLabel} • {assignment.targetLevel}
                    </div>
                  </div>
                  <DashboardStatusBadge label={assignment.dueLabel} tone="outline" />
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-900">{assignment.completionRate}%</div>
                <ProgressBar value={assignment.completionRate} className="mt-2 h-2.5 bg-slate-200" indicatorClassName="bg-emerald-500" />
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-500">
                  <div>
                    <div className="font-semibold text-slate-900">{assignment.submittedCount}</div>
                    <div>{copy.submittedLabel}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{assignment.inProgressCount}</div>
                    <div>{copy.inProgressLabel}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{assignment.needsReviewCount}</div>
                    <div>{copy.reviewLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSectionCard>
      </div>
    </DashboardPageShell>
  );
}

const viCopy = {
  badge: "Classroom tracking",
  description:
    "Theo dõi tình hình lớp theo từng cơ sở: lớp nào đang đúng nhịp, lớp nào sắp trễ hạn và lớp nào cần giáo viên can thiệp ngay trong ngày.",
  openStudents: "Mở quản lý học sinh",
  openAssignmentCenter: "Mở lịch giao bài",
  schoolLead: "Phụ trách",
  metrics: {
    school: "Cơ sở đang theo dõi",
    schoolDelta: "Có thể đổi nhanh theo cơ sở",
    classes: "Lớp đang chạy",
    classesDetail: "Các lớp có assignment mở trong ngày.",
    classesDelta: "Tập trung vào lớp cùng một cơ sở",
    liveAssignments: "Bài tập đang mở",
    liveAssignmentsDetail: "Chỉ hiển thị những assignment còn tác động tới tiến độ.",
    liveAssignmentsDelta: "Ưu tiên bài sắp hết hạn",
    nextDeadline: "Nhịp nộp gần nhất",
    nextDeadlineDetail: "Dùng để quan sát lớp có bị đứng nhịp không.",
    nextDeadlineDelta: "Theo heartbeat nộp bài của lớp đầu bảng",
  },
  classesTitle: "Tình hình lớp đang vận hành",
  classesDescription: "Mỗi thẻ đại diện cho một lớp và trạng thái assignment đang chạy trong cơ sở đã chọn.",
  teacherLabel: "Giáo viên chủ nhiệm",
  assignmentsLabel: "bài mở",
  supportLabel: "cần hỗ trợ",
  completionLabel: "Hoàn thành",
  averageScoreLabel: "Điểm trung bình",
  autoGradedHint: "Theo phần đã chấm tự động",
  lastSubmissionLabel: "Lần nộp gần nhất",
  liveHeartbeatHint: "Dùng để phát hiện lớp đang chậm nhịp",
  scheduleTitle: "Bài tập cần giữ nhịp",
  scheduleDescription: "Những assignment cần giáo viên nhìn sát để tránh hụt completion vào cuối ngày.",
  submittedLabel: "đã nộp",
  inProgressLabel: "đang làm",
  reviewLabel: "chờ review",
};

const enCopy = {
  badge: "Classroom tracking",
  description:
    "Track class health by campus: which classes are on rhythm, which are nearing deadline, and which need same-day teacher intervention.",
  openStudents: "Open student management",
  openAssignmentCenter: "Open assignment center",
  schoolLead: "Lead",
  metrics: {
    school: "Tracked campus",
    schoolDelta: "Switch quickly across campuses",
    classes: "Live classes",
    classesDetail: "Classes with assignments open today.",
    classesDelta: "Focus on a single campus at a time",
    liveAssignments: "Live assignments",
    liveAssignmentsDetail: "Only assignments still affecting progress are shown.",
    liveAssignmentsDelta: "Prioritize those nearing deadline",
    nextDeadline: "Latest submission rhythm",
    nextDeadlineDetail: "Used to detect classes losing pace.",
    nextDeadlineDelta: "Based on the leading class heartbeat",
  },
  classesTitle: "Operational class health",
  classesDescription: "Each card represents a class and the assignment flow currently running in the selected campus.",
  teacherLabel: "Homeroom teacher",
  assignmentsLabel: "live items",
  supportLabel: "need support",
  completionLabel: "Completion",
  averageScoreLabel: "Average score",
  autoGradedHint: "Based on auto-graded work",
  lastSubmissionLabel: "Latest submission",
  liveHeartbeatHint: "Useful for detecting lost momentum",
  scheduleTitle: "Assignments to hold steady",
  scheduleDescription: "Assignments that need closer teacher attention to avoid end-of-day completion drops.",
  submittedLabel: "submitted",
  inProgressLabel: "in progress",
  reviewLabel: "awaiting review",
};
