import { useMemo, useState } from "react";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

import { DashboardMetricCard, DashboardPageShell, DashboardSectionCard, DashboardSegmentedControl, DashboardStatusBadge } from "@/components/dashboard/dashboard-page-shell";
import { Button, ProgressBar } from "@/components/ui/dashboard-kit";
import { useI18n } from "@/features/i18n";
import { getLeaderboard, leaderboardByScope } from "@/features/classroom/api/mock-classroom-data";
import type { LeaderboardScope } from "@/features/classroom/types/classroom-types";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";

export function ClassReportsWorkspace({
  activeLeaf,
  onOpenLeaf,
}: {
  activeLeaf: DashboardLeaf;
  onOpenLeaf: (leafId: string) => void;
}) {
  const { locale } = useI18n();
  const copy = locale === "vi" ? viCopy : enCopy;
  const [scope, setScope] = useState<LeaderboardScope>("class");

  const leaderboard = useMemo(() => getLeaderboard(scope), [scope]);
  const leader = leaderboard[0];
  const runnerUp = leaderboard[1];
  const risingStar = [...leaderboard].sort((left, right) => right.momentum - left.momentum)[0];

  return (
    <DashboardPageShell
      badge={copy.badge}
      title={activeLeaf.title}
      description={copy.description}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={
        <>
          <DashboardSegmentedControl
            options={[
              { value: "class", label: copy.scope.class },
              { value: "grade", label: copy.scope.grade },
              { value: "school", label: copy.scope.school },
              { value: "cluster", label: copy.scope.cluster },
            ]}
            value={scope}
            onChange={(value) => setScope(value as LeaderboardScope)}
          />
          <Button variant="outline" onClick={() => onOpenLeaf("student-journey")}>
            {copy.openJourney}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <DashboardMetricCard
          label={copy.metrics.topRank}
          value={leader?.name ?? "-"}
          detail={`${leader?.className ?? "-"} • ${leader?.schoolName ?? "-"}`}
          delta={leader?.badge ?? copy.noBadge}
          icon={<WorkspacePremiumOutlinedIcon fontSize="inherit" />}
          tone="amber"
        />
        <DashboardMetricCard
          label={copy.metrics.secondRank}
          value={runnerUp?.name ?? "-"}
          detail={`${runnerUp?.completionRate ?? 0}% ${copy.completionLabel}`}
          delta={copy.metrics.secondRankDelta}
          icon={<MilitaryTechOutlinedIcon fontSize="inherit" />}
          tone="blue"
        />
        <DashboardMetricCard
          label={copy.metrics.risingStar}
          value={risingStar?.name ?? "-"}
          detail={`${risingStar?.momentum ?? 0} ${copy.momentumLabel}`}
          delta={copy.metrics.risingStarDelta}
          icon={<StarsOutlinedIcon fontSize="inherit" />}
          tone="emerald"
        />
        <DashboardMetricCard
          label={copy.metrics.scopeSize}
          value={`${leaderboardByScope[scope].length}`}
          detail={copy.metrics.scopeSizeDetail(scope)}
          delta={copy.metrics.scopeSizeDelta}
          icon={<EmojiEventsOutlinedIcon fontSize="inherit" />}
          tone="violet"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <DashboardSectionCard title={copy.leaderboardTitle} description={copy.leaderboardDescription}>
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold text-slate-950">{entry.name}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {entry.className} • {entry.schoolName}
                    </div>
                  </div>
                  <DashboardStatusBadge label={entry.badge} tone={index === 0 ? "success" : "secondary"} />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.scoreLabel}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{entry.score}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.completionLabel}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{entry.completionRate}%</div>
                    <ProgressBar value={entry.completionRate} className="mt-2 h-2.5 bg-slate-200" indicatorClassName="bg-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{copy.momentumLabel}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">+{entry.momentum}</div>
                    <div className="mt-1 text-xs text-slate-500">{copy.pointsThisWeek}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title={copy.evaluationTitle} description={copy.evaluationDescription}>
          <div className="space-y-3">
            <EvaluationCard
              title={copy.evaluation.fastTrackTitle}
              description={copy.evaluation.fastTrackDescription}
              tone="success"
            />
            <EvaluationCard
              title={copy.evaluation.steadyTitle}
              description={copy.evaluation.steadyDescription}
              tone="secondary"
            />
            <EvaluationCard
              title={copy.evaluation.coachTitle}
              description={copy.evaluation.coachDescription}
              tone="warning"
            />
          </div>
        </DashboardSectionCard>
      </div>
    </DashboardPageShell>
  );
}

function EvaluationCard({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "success" | "secondary" | "warning";
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-950">{title}</div>
          <div className="mt-1 text-sm leading-6 text-slate-500">{description}</div>
        </div>
        <DashboardStatusBadge
          label={tone === "success" ? "A" : tone === "secondary" ? "B+" : "Coach"}
          tone={tone}
        />
      </div>
    </div>
  );
}

const viCopy = {
  badge: "Competition report",
  description:
    "Báo cáo kết quả và thi đua được gom về một nơi để giáo viên nhìn được học sinh nổi bật, học sinh bứt tốc và học sinh cần kèm thêm theo lớp, khối, trường hoặc cụm.",
  openJourney: "Mở hành trình học viên",
  scope: {
    class: "Theo lớp",
    grade: "Theo khối",
    school: "Theo trường",
    cluster: "Theo cụm",
  },
  metrics: {
    topRank: "Đứng đầu hiện tại",
    secondRank: "Bám đuổi gần nhất",
    secondRankDelta: "Khoảng cách đang thu hẹp",
    risingStar: "Ngôi sao tăng tốc",
    risingStarDelta: "Tăng mạnh trong 7 ngày",
    scopeSize: "Số học sinh trên bảng",
    scopeSizeDetail: (scope: LeaderboardScope) =>
      scope === "class"
        ? "Đang so trong phạm vi lớp hiện tại"
        : scope === "grade"
          ? "Đang so trên toàn bộ cùng khối"
          : scope === "school"
            ? "Đang so trong cùng trường"
            : "Đang so giữa các cơ sở",
    scopeSizeDelta: "Có thể dùng để công bố thi đua theo tuần",
  },
  noBadge: "Chưa có huy hiệu",
  completionLabel: "hoàn thành",
  momentumLabel: "điểm tăng tốc",
  scoreLabel: "Điểm",
  pointsThisWeek: "điểm thi đua tuần này",
  leaderboardTitle: "Bảng xếp hạng",
  leaderboardDescription: "Kết hợp điểm, completion và động lượng tiến bộ để xếp hạng một cách công bằng hơn cho giáo viên.",
  evaluationTitle: "Khung đánh giá nhanh",
  evaluationDescription: "Giáo viên có thể dùng để gắn nhãn mức độ hiện tại trước khi trao đổi với phụ huynh hoặc cố vấn học tập.",
  evaluation: {
    fastTrackTitle: "Nhóm A - Fast track",
    fastTrackDescription: "Điểm cao, completion ổn định và có sức kéo thi đua cho cả lớp.",
    steadyTitle: "Nhóm B+ - Giữ nhịp tốt",
    steadyDescription: "Hoàn thành đều, nên duy trì thử thách vừa phải để tránh chững nhịp.",
    coachTitle: "Nhóm Coach - Cần kèm",
    coachDescription: "Cần tăng checkpoint, phản hồi ngắn và cơ chế nhắc việc sát hơn.",
  },
};

const enCopy = {
  badge: "Competition report",
  description:
    "Class results and competition are combined here so teachers can spot standout learners, rising stars, and students who need more coaching by class, grade, school, or cluster.",
  openJourney: "Open learner journey",
  scope: {
    class: "By class",
    grade: "By grade",
    school: "By school",
    cluster: "By cluster",
  },
  metrics: {
    topRank: "Current leader",
    secondRank: "Closest challenger",
    secondRankDelta: "The gap is tightening",
    risingStar: "Rising star",
    risingStarDelta: "Strong growth over 7 days",
    scopeSize: "Students on board",
    scopeSizeDetail: (scope: LeaderboardScope) =>
      scope === "class"
        ? "Currently comparing within one class"
        : scope === "grade"
          ? "Currently comparing across the grade"
          : scope === "school"
            ? "Currently comparing within one school"
            : "Currently comparing across campuses",
    scopeSizeDelta: "Good for weekly competition publishing",
  },
  noBadge: "No badge yet",
  completionLabel: "completion",
  momentumLabel: "momentum pts",
  scoreLabel: "Score",
  pointsThisWeek: "competition points this week",
  leaderboardTitle: "Leaderboard",
  leaderboardDescription: "Blends score, completion, and growth momentum so rankings feel fairer for teachers.",
  evaluationTitle: "Quick evaluation frame",
  evaluationDescription: "Useful for fast labeling before a parent update or an academic coaching conversation.",
  evaluation: {
    fastTrackTitle: "Group A - Fast track",
    fastTrackDescription: "High score, stable completion, and strong competition pull for the class.",
    steadyTitle: "Group B+ - Strong rhythm",
    steadyDescription: "Consistent completion and ready for moderate challenge without overload.",
    coachTitle: "Coach group - Needs support",
    coachDescription: "Needs tighter checkpoints, shorter feedback loops, and stronger reminders.",
  },
};
