import { useMemo, useState } from "react";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { DashboardMetricCard, DashboardPageShell, DashboardSectionCard, DashboardSegmentedControl, DashboardStatusBadge } from "@/components/dashboard/dashboard-page-shell";
import { Button, ProgressBar } from "@/components/ui/dashboard-kit";
import { useI18n } from "@/features/i18n";
import {
  assignmentRuns,
  classroomClusters,
  classroomSchools,
  classroomSnapshots,
  interventionQueue,
} from "@/features/classroom/api/mock-classroom-data";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";

type OverviewMode = "center" | "school";

export function OverviewWorkspace({
  activeLeaf,
  mode,
  onOpenLeaf,
}: {
  activeLeaf: DashboardLeaf;
  mode: OverviewMode;
  onOpenLeaf: (leafId: string) => void;
}) {
  const { locale } = useI18n();
  const copy = locale === "vi" ? viCopy : enCopy;
  const [clusterId, setClusterId] = useState("all");

  const filteredSchools = useMemo(
    () =>
      classroomSchools.filter((school) => (clusterId === "all" ? true : school.clusterId === clusterId)),
    [clusterId],
  );
  const filteredSnapshots = useMemo(
    () =>
      classroomSnapshots.filter((snapshot) => (clusterId === "all" ? true : snapshot.clusterId === clusterId)),
    [clusterId],
  );

  const totals = useMemo(() => {
    const activeStudents = filteredSchools.reduce((sum, school) => sum + school.activeStudents, 0);
    const averageCompletion = Math.round(
      filteredSchools.reduce((sum, school) => sum + school.completionRate, 0) / Math.max(filteredSchools.length, 1),
    );
    const averageScore = Math.round(
      filteredSchools.reduce((sum, school) => sum + school.averageScore, 0) / Math.max(filteredSchools.length, 1),
    );
    const flaggedStudents = filteredSchools.reduce((sum, school) => sum + school.flaggedStudents, 0);

    return { activeStudents, averageCompletion, averageScore, flaggedStudents };
  }, [filteredSchools]);

  const riskiestClasses = useMemo(
    () => [...filteredSnapshots].sort((left, right) => right.riskStudents - left.riskStudents).slice(0, 4),
    [filteredSnapshots],
  );
  const topSchools = useMemo(
    () => [...filteredSchools].sort((left, right) => right.completionRate - left.completionRate),
    [filteredSchools],
  );

  return (
    <DashboardPageShell
      badge={mode === "center" ? copy.centerBadge : copy.schoolBadge}
      title={activeLeaf.title}
      description={mode === "center" ? copy.centerDescription : copy.schoolDescription}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={
        <>
          <DashboardSegmentedControl
            options={[
              { value: "all", label: copy.allClusters },
              ...classroomClusters.map((cluster) => ({ value: cluster.id, label: cluster.label })),
            ]}
            value={clusterId}
            onChange={setClusterId}
          />
          <Button variant="outline" onClick={() => onOpenLeaf("question-bank")}>
            {copy.openQuestionBank}
          </Button>
          <Button onClick={() => onOpenLeaf("course-modules")}>{copy.openQuizStudio}</Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <DashboardMetricCard
          label={copy.metrics.activeStudents}
          value={totals.activeStudents.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}
          detail={copy.metrics.activeStudentsDetail(filteredSchools.length)}
          delta={copy.metrics.activeStudentsDelta}
          icon={<AnalyticsOutlinedIcon fontSize="inherit" />}
        />
        <DashboardMetricCard
          label={copy.metrics.completion}
          value={`${totals.averageCompletion}%`}
          detail={copy.metrics.completionDetail}
          delta={copy.metrics.completionDelta}
          icon={<FactCheckOutlinedIcon fontSize="inherit" />}
          tone="emerald"
        />
        <DashboardMetricCard
          label={copy.metrics.averageScore}
          value={`${totals.averageScore}`}
          detail={copy.metrics.averageScoreDetail}
          delta={copy.metrics.averageScoreDelta}
          icon={<AutoGraphOutlinedIcon fontSize="inherit" />}
          tone="amber"
        />
        <DashboardMetricCard
          label={copy.metrics.flagged}
          value={`${totals.flaggedStudents}`}
          detail={copy.metrics.flaggedDetail}
          delta={copy.metrics.flaggedDelta}
          icon={<WarningAmberOutlinedIcon fontSize="inherit" />}
          tone="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <DashboardSectionCard
          title={mode === "center" ? copy.schoolBoardTitle : copy.classPulseTitle}
          description={mode === "center" ? copy.schoolBoardDescription : copy.classPulseDescription}
        >
          <div className="space-y-3">
            {(mode === "center" ? topSchools : filteredSnapshots).slice(0, 6).map((item) => {
              const isSchool = "principal" in item;

              return (
                <div key={item.id} className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-base font-semibold text-slate-950">
                        {isSchool ? item.name : `${item.className} • ${item.schoolName}`}
                      </div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">
                        {isSchool
                          ? `${copy.schoolPrincipal}: ${item.principal}`
                          : `${item.gradeLabel} • ${copy.teacherLabel}: ${item.homeroomTeacher}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <DashboardStatusBadge
                        label={
                          isSchool
                            ? `${item.activeClasses} ${copy.classroomsLabel}`
                            : `${item.activeAssignments} ${copy.activeAssignmentsLabel}`
                        }
                        tone="outline"
                      />
                      <DashboardStatusBadge
                        label={`${isSchool ? item.averageScore : item.averageScore} ${copy.pointsLabel}`}
                        tone="secondary"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.completionLabel}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {isSchool ? item.completionRate : item.completionRate}%
                      </div>
                      <ProgressBar
                        value={isSchool ? item.completionRate : item.completionRate}
                        className="mt-2 h-2.5 bg-slate-200"
                        indicatorClassName="bg-blue-600"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.overdueLabel}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {isSchool ? item.overdueAssignments : item.riskStudents}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {isSchool ? copy.pendingAssignments : copy.studentsNeedSupport}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.lastActivityLabel}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {isSchool ? copy.schoolSummaryHint : item.lastSubmissionAt}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {isSchool ? copy.schoolConsistencyHint : copy.lastSubmissionHint}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title={copy.assignmentTitle} description={copy.assignmentDescription}>
          <div className="space-y-3">
            {assignmentRuns.map((assignment) => (
              <div key={assignment.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{assignment.title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {assignment.subjectLabel} • {assignment.targetLevel}
                    </div>
                  </div>
                  <DashboardStatusBadge
                    label={`${assignment.activeClasses} ${copy.classroomsLabel}`}
                    tone="outline"
                  />
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
                    <div>{copy.needsReviewLabel}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">{assignment.dueLabel}</div>
              </div>
            ))}
          </div>
        </DashboardSectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <DashboardSectionCard title={copy.interventionTitle} description={copy.interventionDescription}>
          <div className="space-y-3">
            {interventionQueue.map((item) => (
              <div key={item.id} className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">
                      {item.studentName} • {item.className}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">{item.issue}</div>
                  </div>
                  <DashboardStatusBadge
                    label={copy.urgency[item.urgency]}
                    tone={item.urgency === "high" ? "danger" : item.urgency === "medium" ? "warning" : "outline"}
                  />
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  {item.schoolName} • {item.impact}
                </div>
              </div>
            ))}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title={copy.riskBoardTitle} description={copy.riskBoardDescription} action={<Button variant="outline" onClick={() => onOpenLeaf("class-reports")}>{copy.openCompetition}</Button>}>
          <div className="space-y-3">
            {riskiestClasses.map((snapshot, index) => (
              <div key={snapshot.id} className="flex items-center gap-4 rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-950">
                    {snapshot.className} • {snapshot.schoolName}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {snapshot.riskStudents} {copy.studentsNeedSupport} • {snapshot.competitionPoints} {copy.competitionPoints}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-950">{snapshot.completionRate}%</div>
                  <div className="text-xs text-slate-500">{copy.completionLabel}</div>
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
  centerBadge: "Learning ops",
  schoolBadge: "School pulse",
  centerDescription:
    "Bảng điều hành tổng hợp cho giáo viên và tổ trưởng: theo dõi tiến độ làm bài, chất lượng nộp bài và những điểm nghẽn cần can thiệp ngay.",
  schoolDescription:
    "So sánh nhanh hiệu suất theo trường và lớp để nhìn ra nơi đang chậm nhịp, nơi đang bứt tốc và nhóm học sinh cần hỗ trợ thêm.",
  allClusters: "Tất cả cụm",
  openQuestionBank: "Mở ngân hàng câu hỏi",
  openQuizStudio: "Mở quiz editor",
  openCompetition: "Xem bảng thi đua",
  metrics: {
    activeStudents: "Học sinh đang hoạt động",
    activeStudentsDetail: (count: number) => `${count} cơ sở đang được theo dõi realtime`,
    activeStudentsDelta: "Nhịp học duy trì tốt trong ca tối",
    completion: "Tỷ lệ hoàn thành",
    completionDetail: "Tính trên toàn bộ bài đang mở trong ngày.",
    completionDelta: "+4 điểm so với đầu tuần",
    averageScore: "Điểm trung bình",
    averageScoreDetail: "Theo bài đã nộp và được chấm tự động.",
    averageScoreDelta: "Mặt bằng khối 6 đang dẫn nhịp",
    flagged: "Học sinh cần hỗ trợ",
    flaggedDetail: "Nhóm chậm mở bài, bỏ dở hoặc rơi điểm mạnh.",
    flaggedDelta: "Ưu tiên xử lý trước 20:30",
  },
  schoolBoardTitle: "Toàn cảnh theo trường",
  schoolBoardDescription: "So sánh nhanh chất lượng vận hành của từng cơ sở trong cùng một cụm.",
  classPulseTitle: "Nhiệt độ theo lớp",
  classPulseDescription: "Đi sâu vào lớp đang chạy bài để xem chất lượng nộp và điểm rơi hỗ trợ.",
  schoolPrincipal: "Phụ trách",
  teacherLabel: "Giáo viên chủ nhiệm",
  classroomsLabel: "lớp",
  activeAssignmentsLabel: "bài đang mở",
  pointsLabel: "điểm",
  completionLabel: "Hoàn thành",
  overdueLabel: "Cần chú ý",
  pendingAssignments: "bài chậm hoặc quá hạn",
  studentsNeedSupport: "học sinh cần hỗ trợ",
  lastActivityLabel: "Nhịp gần nhất",
  schoolSummaryHint: "Ổn định trong 24 giờ",
  schoolConsistencyHint: "Theo cadence nộp bài toàn trường",
  lastSubmissionHint: "Phiên nộp gần nhất của lớp",
  assignmentTitle: "Bài tập đang chạy",
  assignmentDescription: "Nhìn nhanh bài nào đang có tỷ lệ hoàn thành tốt, bài nào sắp trễ hạn hoặc cần review thêm.",
  submittedLabel: "đã nộp",
  inProgressLabel: "đang làm",
  needsReviewLabel: "cần review",
  interventionTitle: "Danh sách can thiệp ngay",
  interventionDescription: "Những trường hợp có tác động trực tiếp đến tiến độ lớp hoặc trải nghiệm học sinh.",
  urgency: {
    high: "Ưu tiên cao",
    medium: "Theo dõi sát",
    low: "Nhắc nhẹ",
  },
  riskBoardTitle: "Lớp cần kéo nhịp",
  riskBoardDescription: "Nhóm lớp có completion thấp hoặc nhiều học sinh rơi khỏi nhịp thi đua.",
  competitionPoints: "điểm thi đua",
};

const enCopy = {
  centerBadge: "Learning ops",
  schoolBadge: "School pulse",
  centerDescription:
    "An operational dashboard for teachers and academic leads to track assignment progress, submission quality, and the bottlenecks that need intervention now.",
  schoolDescription:
    "Compare schools and classes quickly to spot slow groups, fast movers, and the learners who need closer support.",
  allClusters: "All clusters",
  openQuestionBank: "Open question bank",
  openQuizStudio: "Open quiz editor",
  openCompetition: "Open leaderboard",
  metrics: {
    activeStudents: "Active students",
    activeStudentsDetail: (count: number) => `${count} campuses tracked in real time`,
    activeStudentsDelta: "Healthy evening-learning rhythm",
    completion: "Completion rate",
    completionDetail: "Measured across all live assignments today.",
    completionDelta: "+4 pts versus the start of the week",
    averageScore: "Average score",
    averageScoreDetail: "Based on submitted work with auto-grading.",
    averageScoreDelta: "Grade 6 is setting the pace",
    flagged: "Students needing support",
    flaggedDetail: "Students who did not start, dropped mid-way, or lost momentum.",
    flaggedDelta: "Prioritize before 8:30 PM",
  },
  schoolBoardTitle: "School comparison",
  schoolBoardDescription: "A quick operational comparison across campuses in the same cluster.",
  classPulseTitle: "Class pulse",
  classPulseDescription: "A deeper view into the classes that are currently running assignments.",
  schoolPrincipal: "Lead",
  teacherLabel: "Homeroom teacher",
  classroomsLabel: "classes",
  activeAssignmentsLabel: "live assignments",
  pointsLabel: "pts",
  completionLabel: "Completion",
  overdueLabel: "Needs attention",
  pendingAssignments: "late or overdue items",
  studentsNeedSupport: "students need support",
  lastActivityLabel: "Latest rhythm",
  schoolSummaryHint: "Stable in the last 24 hours",
  schoolConsistencyHint: "Based on school-wide submission cadence",
  lastSubmissionHint: "Latest class submission window",
  assignmentTitle: "Live assignment run",
  assignmentDescription: "See which assignments are healthy, which are nearing deadline, and which need more review capacity.",
  submittedLabel: "submitted",
  inProgressLabel: "in progress",
  needsReviewLabel: "needs review",
  interventionTitle: "Immediate intervention queue",
  interventionDescription: "Cases that directly affect class momentum or learner experience.",
  urgency: {
    high: "High priority",
    medium: "Watch closely",
    low: "Gentle reminder",
  },
  riskBoardTitle: "Classes to pull forward",
  riskBoardDescription: "Classes with weaker completion or more students falling out of the competition rhythm.",
  competitionPoints: "competition pts",
};
