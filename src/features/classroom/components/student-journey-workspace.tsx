import { useMemo, useState } from "react";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import { DashboardMetricCard, DashboardPageShell, DashboardSectionCard } from "@/components/dashboard/dashboard-page-shell";
import { Button, ProgressBar } from "@/components/ui/dashboard-kit";
import { useI18n } from "@/features/i18n";
import {
  classroomStudents,
  defaultStudentId,
  getLearnerJourney,
} from "@/features/classroom/api/mock-classroom-data";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";
import { cn } from "@/lib/utils";

export function StudentJourneyWorkspace({
  activeLeaf,
  onOpenLeaf,
}: {
  activeLeaf: DashboardLeaf;
  onOpenLeaf: (leafId: string) => void;
}) {
  const { locale } = useI18n();
  const copy = locale === "vi" ? viCopy : enCopy;
  const [studentId, setStudentId] = useState(defaultStudentId);

  const student = classroomStudents.find((item) => item.id === studentId) ?? classroomStudents[0];
  const journey = useMemo(() => getLearnerJourney(studentId), [studentId]);

  return (
    <DashboardPageShell
      badge={copy.badge}
      title={activeLeaf.title}
      description={copy.description}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={
        <>
          <select
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm outline-none"
          >
            {classroomStudents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} • {item.className}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => onOpenLeaf("class-reports")}>
            {copy.openReports}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <DashboardMetricCard
          label={copy.metrics.currentStudent}
          value={student?.name ?? "-"}
          detail={`${student?.className ?? "-"} • ${student?.schoolName ?? "-"}`}
          delta={student?.mentorNote ?? copy.emptyNote}
          icon={<RouteOutlinedIcon fontSize="inherit" />}
        />
        <DashboardMetricCard
          label={copy.metrics.progress}
          value={`${student?.progressRate ?? 0}%`}
          detail={copy.metrics.progressDetail}
          delta={copy.metrics.progressDelta}
          icon={<TimelineOutlinedIcon fontSize="inherit" />}
          tone="emerald"
        />
        <DashboardMetricCard
          label={copy.metrics.score}
          value={`${student?.averageScore ?? 0}`}
          detail={copy.metrics.scoreDetail}
          delta={copy.metrics.scoreDelta}
          icon={<FlagOutlinedIcon fontSize="inherit" />}
          tone="amber"
        />
        <DashboardMetricCard
          label={copy.metrics.currentWork}
          value={student?.currentAssignment ?? "-"}
          detail={student?.currentStage ?? "-"}
          delta={copy.metrics.currentWorkDelta}
          icon={<RouteOutlinedIcon fontSize="inherit" />}
          tone="blue"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <DashboardSectionCard title={copy.strengthTitle} description={copy.strengthDescription}>
          <div className="space-y-4">
            {journey?.strengths.map((strength) => (
              <div key={strength.label} className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-950">{strength.label}</div>
                  <div className="text-sm font-semibold text-slate-900">{strength.value}%</div>
                </div>
                <ProgressBar value={strength.value} className="mt-3 h-2.5 bg-slate-200" indicatorClassName="bg-blue-600" />
              </div>
            ))}

            <div className="rounded-[22px] border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-950">{copy.focusTitle}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {journey?.focusAreas.map((area) => (
                  <span key={area} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-700">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title={copy.timelineTitle} description={copy.timelineDescription}>
          <div className="space-y-4">
            {journey?.milestones.map((milestone) => (
              <div key={milestone.id} className="flex gap-4 rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="relative flex w-10 shrink-0 justify-center">
                  <span
                    className={cn(
                      "mt-1 block h-4 w-4 rounded-full",
                      milestone.state === "done"
                        ? "bg-emerald-500"
                        : milestone.state === "current"
                          ? "bg-blue-600"
                          : "bg-slate-300",
                    )}
                  />
                  <span className="absolute top-5 h-[calc(100%-8px)] w-px bg-slate-200" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-950">{milestone.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{milestone.detail}</div>
                </div>
              </div>
            ))}

            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-sm font-semibold text-slate-950">{copy.mentorTitle}</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">{journey?.mentorNote}</div>
            </div>
          </div>
        </DashboardSectionCard>
      </div>
    </DashboardPageShell>
  );
}

const viCopy = {
  badge: "Learner journey",
  description:
    "Hành trình học viên cho giáo viên nhìn rõ hơn điểm mạnh, điểm cần đẩy thêm và các mốc phát triển của từng em thay vì chỉ nhìn một con số tổng kết.",
  openReports: "Mở bảng thi đua",
  emptyNote: "Chưa có ghi chú",
  metrics: {
    currentStudent: "Học sinh đang xem",
    progress: "Tiến độ hiện tại",
    progressDetail: "Theo assignment đang chạy gần nhất.",
    progressDelta: "Dùng để xác định có cần nhắc ngay không",
    score: "Điểm trung bình",
    scoreDetail: "Theo các bài đã hoàn thành trong giai đoạn gần đây.",
    scoreDelta: "Quan sát song song với completion",
    currentWork: "Bài đang làm",
    currentWorkDelta: "Phù hợp để giáo viên follow ngay trong lớp",
  },
  strengthTitle: "Bản đồ năng lực",
  strengthDescription: "Hiển thị các trụ cột đang mạnh để giáo viên giao thêm nhiệm vụ đúng hướng.",
  focusTitle: "Điểm cần tiếp tục kéo",
  timelineTitle: "Mốc phát triển",
  timelineDescription: "Theo dõi các mốc đã đạt, đang bám và mục tiêu kế tiếp của học viên.",
  mentorTitle: "Ghi chú mentor",
};

const enCopy = {
  badge: "Learner journey",
  description:
    "The learner journey helps teachers see strengths, growth opportunities, and milestone progress for each student instead of relying on one summary score.",
  openReports: "Open leaderboard",
  emptyNote: "No note yet",
  metrics: {
    currentStudent: "Current learner",
    progress: "Current progress",
    progressDetail: "Based on the most recent live assignment.",
    progressDelta: "Useful for deciding whether to nudge now",
    score: "Average score",
    scoreDetail: "Based on recently completed work.",
    scoreDelta: "Review alongside completion",
    currentWork: "Current assignment",
    currentWorkDelta: "Useful for in-class follow-up",
  },
  strengthTitle: "Strength map",
  strengthDescription: "Shows where the student is strongest so teachers can assign richer work with more precision.",
  focusTitle: "Areas to keep pushing",
  timelineTitle: "Growth milestones",
  timelineDescription: "Track what has been achieved, what is being chased now, and what comes next.",
  mentorTitle: "Mentor note",
};
