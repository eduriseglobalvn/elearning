import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";

import { DashboardMetricCard, DashboardPageShell, DashboardSectionCard, DashboardStatusBadge } from "@/components/dashboard/dashboard-page-shell";
import { Button, ProgressBar } from "@/components/ui/dashboard-kit";
import { useI18n } from "@/features/i18n";
import { assignmentRuns } from "@/features/classroom/api/mock-classroom-data";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";

export function AssessmentControlWorkspace({
  activeLeaf,
  onOpenLeaf,
}: {
  activeLeaf: DashboardLeaf;
  onOpenLeaf: (leafId: string) => void;
}) {
  const { locale } = useI18n();
  const copy = locale === "vi" ? viCopy : enCopy;

  const totalSubmitted = assignmentRuns.reduce((sum, assignment) => sum + assignment.submittedCount, 0);
  const totalInProgress = assignmentRuns.reduce((sum, assignment) => sum + assignment.inProgressCount, 0);
  const totalReview = assignmentRuns.reduce((sum, assignment) => sum + assignment.needsReviewCount, 0);
  const averageCompletion = Math.round(
    assignmentRuns.reduce((sum, assignment) => sum + assignment.completionRate, 0) / Math.max(assignmentRuns.length, 1),
  );

  return (
    <DashboardPageShell
      badge={copy.badge}
      title={activeLeaf.title}
      description={copy.description}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={<Button variant="outline" onClick={() => onOpenLeaf("classroom-tracking")}>{copy.backToTracking}</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <DashboardMetricCard
          label={copy.metrics.scheduled}
          value={`${assignmentRuns.length}`}
          detail={copy.metrics.scheduledDetail}
          delta={copy.metrics.scheduledDelta}
          icon={<EventAvailableOutlinedIcon fontSize="inherit" />}
        />
        <DashboardMetricCard
          label={copy.metrics.submitted}
          value={`${totalSubmitted}`}
          detail={copy.metrics.submittedDetail}
          delta={copy.metrics.submittedDelta}
          icon={<PlaylistAddCheckOutlinedIcon fontSize="inherit" />}
          tone="emerald"
        />
        <DashboardMetricCard
          label={copy.metrics.inProgress}
          value={`${totalInProgress}`}
          detail={copy.metrics.inProgressDetail}
          delta={copy.metrics.inProgressDelta}
          icon={<FactCheckOutlinedIcon fontSize="inherit" />}
          tone="blue"
        />
        <DashboardMetricCard
          label={copy.metrics.review}
          value={`${totalReview}`}
          detail={copy.metrics.reviewDetail}
          delta={copy.metrics.reviewDelta}
          icon={<RuleOutlinedIcon fontSize="inherit" />}
          tone="amber"
        />
      </div>

      <DashboardSectionCard title={copy.boardTitle} description={copy.boardDescription}>
        <div className="space-y-3">
          {assignmentRuns.map((assignment) => (
            <div key={assignment.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-950">{assignment.title}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {assignment.subjectLabel} • {assignment.targetLevel}
                  </div>
                </div>
                <DashboardStatusBadge label={assignment.dueLabel} tone="outline" />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_120px_120px_120px]">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.completionLabel}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{assignment.completionRate}%</div>
                  <ProgressBar value={assignment.completionRate} className="mt-2 h-2.5 bg-slate-200" indicatorClassName="bg-blue-600" />
                  <div className="mt-2 text-xs text-slate-500">{copy.averageCompletionHint(averageCompletion)}</div>
                </div>
                <MetricBox label={copy.submittedLabel} value={assignment.submittedCount} />
                <MetricBox label={copy.inProgressLabel} value={assignment.inProgressCount} />
                <MetricBox label={copy.reviewLabel} value={assignment.needsReviewCount} />
              </div>
            </div>
          ))}
        </div>
      </DashboardSectionCard>
    </DashboardPageShell>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-slate-50/80 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}

const viCopy = {
  badge: "Assignment control",
  description:
    "Khu điều phối bài kiểm tra giúp giáo viên nhìn được lịch giao, lượng bài đang làm, lượng bài chờ review và sức khỏe completion của từng assignment.",
  backToTracking: "Quay lại điều phối lớp",
  metrics: {
    scheduled: "Bài đang lên lịch",
    scheduledDetail: "Những bài vẫn còn tác động tới tiến độ trong ngày.",
    scheduledDelta: "Ưu tiên kiểm soát bài gần hạn",
    submitted: "Lượt nộp",
    submittedDetail: "Tổng bài đã nộp vào hệ thống hôm nay.",
    submittedDelta: "Dùng để đánh giá tải review",
    inProgress: "Đang làm",
    inProgressDetail: "Học sinh đang mở bài hoặc làm dở.",
    inProgressDelta: "Theo dõi để nhắc trước giờ cao điểm",
    review: "Chờ review",
    reviewDetail: "Khối lượng phản hồi giáo viên cần xử lý.",
    reviewDelta: "Nên ưu tiên assignment tự luận trước",
  },
  boardTitle: "Bảng điều phối assignment",
  boardDescription: "Mỗi assignment hiển thị completion, lượng nộp và tải review để giáo viên biết nên chạm vào đâu trước.",
  completionLabel: "Completion",
  averageCompletionHint: (value: number) => `Mặt bằng completion toàn bảng: ${value}%`,
  submittedLabel: "Đã nộp",
  inProgressLabel: "Đang làm",
  reviewLabel: "Chờ review",
};

const enCopy = {
  badge: "Assignment control",
  description:
    "This assignment control area helps teachers monitor the release schedule, live workload, pending review, and completion health of every active assessment.",
  backToTracking: "Back to class tracking",
  metrics: {
    scheduled: "Scheduled items",
    scheduledDetail: "Assignments still affecting progress today.",
    scheduledDelta: "Prioritize those closest to deadline",
    submitted: "Submitted runs",
    submittedDetail: "Total submissions received today.",
    submittedDelta: "Useful for estimating review load",
    inProgress: "In progress",
    inProgressDetail: "Students currently inside an assignment flow.",
    inProgressDelta: "Watch before peak study hours",
    review: "Awaiting review",
    reviewDetail: "Teacher feedback volume that still needs handling.",
    reviewDelta: "Prioritize written responses first",
  },
  boardTitle: "Assignment control board",
  boardDescription: "Each assignment surfaces completion, submission load, and review demand so teachers know where to focus first.",
  completionLabel: "Completion",
  averageCompletionHint: (value: number) => `Board-wide average completion: ${value}%`,
  submittedLabel: "Submitted",
  inProgressLabel: "In progress",
  reviewLabel: "Needs review",
};
