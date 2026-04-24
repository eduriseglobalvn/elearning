import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { PlayerShell } from "@/components/quiz/player-shell";
import { Badge, Button, Card, ProgressBar } from "@/components/ui/dashboard-kit";
import { getCurrentAccount, logoutAccount } from "@/features/auth/api/auth-storage";
import type { TeacherAccount } from "@/features/auth/types/auth-types";
import { useI18n } from "@/features/i18n";
import {
  classLeaderboard,
  gradeLeaderboard,
  studentAssignments,
  studentDashboardProfile,
} from "@/features/student-dashboard/api/mock-student-dashboard";
import type {
  StudentAssignmentStatus,
  StudentDashboardAssignment,
  StudentLeaderboardEntry,
} from "@/features/student-dashboard/types/student-dashboard-types";
import { cn } from "@/lib/utils";

type StudentViewState =
  | { type: "dashboard" }
  | {
      type: "quiz";
      assignmentId: string;
    };

type StudentPageKey = "overview" | "assignments" | "ranking" | "account";

type DashboardCopy = {
  navItems: Array<{ key: StudentPageKey; label: string; icon: ReactNode }>;
  heroEyebrow: string;
  heroTitle: (name: string) => string;
  heroDescription: (taskTitle: string) => string;
  primaryAction: string;
  secondaryAction: string;
  stats: {
    open: string;
    overdue: string;
    average: string;
    classRank: string;
    gradeRank: string;
  };
  priority: {
    title: string;
    action: string;
    detail: (dueLabel: string) => string;
  };
  todayTitle: string;
  assignmentsTitle: string;
  assignmentsDescription: string;
  rankingTitle: string;
  rankingDescription: string;
  classRankingTitle: string;
  gradeRankingTitle: string;
  accountTitle: string;
  accountDescription: string;
  learningProfileTitle: string;
  loginStateTitle: string;
  accountActionsTitle: string;
  progressLabel: string;
  questionCountLabel: string;
  scoreLabel: string;
  scoreBadge: (score: number, maxScore: number) => string;
  pendingScore: string;
  assignmentAction: (status: StudentAssignmentStatus) => string;
  chartScoreLabel: string;
  youBadge: string;
  signedInAs: string;
  guestLabel: string;
  signIn: string;
  signOut: string;
  footerTitle: string;
  footerSubtitle: string;
  sessionBadge: string;
  sessionEyebrow: string;
  sessionDescription: (subject: string, teacher: string, dueLabel: string) => string;
  backToDashboard: string;
};

export function StudentDashboardWorkspace() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const copy: DashboardCopy = locale === "vi" ? viCopy : enCopy;
  const [activePage, setActivePage] = useState<StudentPageKey>("overview");
  const [viewState, setViewState] = useState<StudentViewState>({ type: "dashboard" });
  const [account, setAccount] = useState<TeacherAccount | null>(() => getCurrentAccount());

  const assignments = studentAssignments;
  const currentAssignment =
    viewState.type === "quiz"
      ? assignments.find((item) => item.id === viewState.assignmentId) ?? assignments[0]
      : assignments[0];
  const openAssignments = assignments.filter((assignment) => assignment.status !== "submitted");
  const overdueAssignments = assignments.filter((assignment) => assignment.status === "overdue");
  const completedAssignments = assignments.filter((assignment) => assignment.status === "submitted");
  const averageAssignmentScore = Math.round(
    completedAssignments.reduce((sum, assignment) => sum + (assignment.score ?? 0), 0) /
      Math.max(completedAssignments.length, 1),
  );
  const priorityAssignment = openAssignments[0] ?? assignments[0];

  function openAssignment(assignmentId: string) {
    setViewState({ type: "quiz", assignmentId });
  }

  function handleSignIn() {
    navigate("/");
  }

  function handleSignOut() {
    logoutAccount();
    setAccount(null);
    navigate("/");
  }

  if (viewState.type === "quiz" && currentAssignment) {
    return (
      <main className="min-h-screen bg-[#f7f8fb]">
        <StudentBrandHeader
          activePage={activePage}
          account={account}
          copy={copy}
          studentName={studentDashboardProfile.name}
          studentClass={studentDashboardProfile.className}
          onPageChange={(nextPage) => {
            setActivePage(nextPage);
            setViewState({ type: "dashboard" });
          }}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
        <BrandDivider />

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[var(--erg-red)]" />
                  <span className="text-xs font-semibold uppercase text-[var(--erg-red)]">
                    {copy.sessionEyebrow}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge className="border-[var(--erg-blue)]/10 bg-[var(--erg-blue)]/5 text-[var(--erg-blue)]" tone="outline">
                    {copy.sessionBadge}
                  </Badge>
                  <StatusPill status={currentAssignment.status} label={currentAssignment.statusLabel} />
                </div>
                <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight text-[var(--erg-blue)]">
                  {currentAssignment.title}
                </h1>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                  {copy.sessionDescription(
                    currentAssignment.subjectLabel,
                    currentAssignment.teacherName,
                    currentAssignment.dueLabel,
                  )}
                </p>
              </div>

              <Button
                variant="outline"
                className="border-slate-200 bg-white text-[var(--erg-blue)] hover:bg-slate-50"
                onClick={() => setViewState({ type: "dashboard" })}
              >
                <ArrowBackOutlinedIcon fontSize="inherit" />
                {copy.backToDashboard}
              </Button>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1600px] px-3 py-5">
          <PlayerShell quizId={currentAssignment.quizId} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <StudentBrandHeader
        activePage={activePage}
        account={account}
        copy={copy}
        studentName={studentDashboardProfile.name}
        studentClass={studentDashboardProfile.className}
        onPageChange={setActivePage}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />
      <BrandDivider />

      {activePage === "overview" ? (
        <OverviewView
          averageAssignmentScore={averageAssignmentScore}
          completedAssignments={completedAssignments}
          copy={copy}
          onOpenAssignment={openAssignment}
          onPageChange={setActivePage}
          openAssignments={openAssignments}
          overdueAssignments={overdueAssignments}
          priorityAssignment={priorityAssignment}
        />
      ) : null}

      {activePage === "assignments" ? (
        <AssignmentsView
          assignments={assignments}
          completedAssignments={completedAssignments}
          copy={copy}
          onOpenAssignment={openAssignment}
          openAssignments={openAssignments}
          overdueAssignments={overdueAssignments}
        />
      ) : null}

      {activePage === "ranking" ? (
        <RankingView copy={copy} />
      ) : null}

      {activePage === "account" ? (
        <AccountView
          account={account}
          averageAssignmentScore={averageAssignmentScore}
          copy={copy}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          openAssignments={openAssignments}
        />
      ) : null}

      <StudentFooter copy={copy} />
    </main>
  );
}

function OverviewView({
  averageAssignmentScore,
  completedAssignments,
  copy,
  onOpenAssignment,
  onPageChange,
  openAssignments,
  overdueAssignments,
  priorityAssignment,
}: {
  averageAssignmentScore: number;
  completedAssignments: StudentDashboardAssignment[];
  copy: DashboardCopy;
  onOpenAssignment: (assignmentId: string) => void;
  onPageChange: (page: StudentPageKey) => void;
  openAssignments: StudentDashboardAssignment[];
  overdueAssignments: StudentDashboardAssignment[];
  priorityAssignment: StudentDashboardAssignment;
}) {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--erg-red)]" />
              <span className="text-xs font-semibold uppercase text-[var(--erg-red)]">{copy.heroEyebrow}</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-[var(--erg-blue)] sm:text-5xl">
              {copy.heroTitle(studentDashboardProfile.name)}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              {copy.heroDescription(priorityAssignment.title)}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                className="bg-[var(--erg-blue)] px-5 text-white hover:bg-[#060b7a]"
                onClick={() => onOpenAssignment(priorityAssignment.id)}
              >
                {copy.primaryAction}
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 bg-white text-[var(--erg-blue)] hover:bg-slate-50"
                onClick={() => onPageChange("assignments")}
              >
                {copy.secondaryAction}
                <ArrowForwardOutlinedIcon fontSize="inherit" />
              </Button>
            </div>
          </div>

          <PriorityPanel
            assignment={priorityAssignment}
            copy={copy}
            onOpen={() => onOpenAssignment(priorityAssignment.id)}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<MenuBookOutlinedIcon fontSize="inherit" />} label={copy.stats.open} value={`${openAssignments.length}`} />
          <MetricCard icon={<QueryBuilderOutlinedIcon fontSize="inherit" />} label={copy.stats.overdue} value={`${overdueAssignments.length}`} tone="danger" />
          <MetricCard icon={<SchoolOutlinedIcon fontSize="inherit" />} label={copy.stats.average} value={`${averageAssignmentScore}`} />
          <MetricCard icon={<BarChartOutlinedIcon fontSize="inherit" />} label={copy.stats.classRank} value={`#${studentDashboardProfile.classRank}`} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-lg border border-slate-200 bg-white">
            <SectionHeader
              actionLabel={copy.secondaryAction}
              onAction={() => onPageChange("assignments")}
              title={copy.todayTitle}
            />
            <div className="grid gap-3 p-4">
              {openAssignments.slice(0, 3).map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  compact
                  copy={copy}
                  onOpen={() => onOpenAssignment(assignment.id)}
                />
              ))}
            </div>
          </section>

          <QuickRankingCard copy={copy} entries={classLeaderboard} onOpen={() => onPageChange("ranking")} />
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <ProfileStat label={copy.stats.gradeRank} value={`#${studentDashboardProfile.gradeRank}`} />
            <ProfileStat label={copy.stats.average} value={`${averageAssignmentScore}`} />
            <ProfileStat label={copy.assignmentsTitle} value={`${completedAssignments.length}/${studentDashboardProfile.totalAssignments}`} />
          </div>
        </div>
      </section>
    </>
  );
}

function AssignmentsView({
  assignments,
  completedAssignments,
  copy,
  onOpenAssignment,
  openAssignments,
  overdueAssignments,
}: {
  assignments: StudentDashboardAssignment[];
  completedAssignments: StudentDashboardAssignment[];
  copy: DashboardCopy;
  onOpenAssignment: (assignmentId: string) => void;
  openAssignments: StudentDashboardAssignment[];
  overdueAssignments: StudentDashboardAssignment[];
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8">
      <PageTitle
        description={copy.assignmentsDescription}
        icon={<AssignmentTurnedInOutlinedIcon fontSize="inherit" />}
        title={copy.assignmentsTitle}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <ProfileStat label={copy.stats.open} value={`${openAssignments.length}`} />
        <ProfileStat label={copy.stats.overdue} value={`${overdueAssignments.length}`} tone="danger" />
        <ProfileStat label={copy.stats.average} value={`${completedAssignments.length}/${assignments.length}`} />
      </div>

      <div className="mt-6 grid gap-4">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            copy={copy}
            onOpen={() => onOpenAssignment(assignment.id)}
          />
        ))}
      </div>
    </section>
  );
}

function RankingView({ copy }: { copy: DashboardCopy }) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8">
      <PageTitle
        description={copy.rankingDescription}
        icon={<BarChartOutlinedIcon fontSize="inherit" />}
        title={copy.rankingTitle}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <RankingPanel copy={copy} entries={classLeaderboard} title={copy.classRankingTitle} />
        <RankingPanel copy={copy} entries={gradeLeaderboard} title={copy.gradeRankingTitle} />
      </div>
    </section>
  );
}

function AccountView({
  account,
  averageAssignmentScore,
  copy,
  onSignIn,
  onSignOut,
  openAssignments,
}: {
  account: TeacherAccount | null;
  averageAssignmentScore: number;
  copy: DashboardCopy;
  onSignIn: () => void;
  onSignOut: () => void;
  openAssignments: StudentDashboardAssignment[];
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8">
      <PageTitle
        description={copy.accountDescription}
        icon={<AccountCircleOutlinedIcon fontSize="inherit" />}
        title={copy.accountTitle}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-lg bg-[var(--erg-blue)] text-xl font-semibold text-white">
                {studentDashboardProfile.name.slice(0, 1)}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-[var(--erg-blue)]">{studentDashboardProfile.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {studentDashboardProfile.className} • {studentDashboardProfile.schoolName}
                </p>
              </div>
            </div>
            <StatusPill status={openAssignments.length > 0 ? "in_progress" : "submitted"} label={openAssignments.length > 0 ? copy.stats.open : copy.stats.average} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ProfileStat label={copy.stats.average} value={`${averageAssignmentScore}`} />
            <ProfileStat label={copy.stats.classRank} value={`#${studentDashboardProfile.classRank}`} />
            <ProfileStat label={copy.stats.gradeRank} value={`#${studentDashboardProfile.gradeRank}`} />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-[var(--erg-blue)]">{copy.loginStateTitle}</h3>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            <div className="font-semibold text-slate-900">{account?.fullName ?? copy.guestLabel}</div>
            <div>{account?.email ?? copy.guestLabel}</div>
            <div>{account ? copy.signedInAs : copy.guestLabel}</div>
          </div>

          <h3 className="mt-6 text-lg font-semibold text-[var(--erg-blue)]">{copy.accountActionsTitle}</h3>
          <div className="mt-4 grid gap-3">
            <Button className="bg-[var(--erg-blue)] text-white hover:bg-[#060b7a]" onClick={onSignIn}>
              <LoginOutlinedIcon fontSize="inherit" />
              {copy.signIn}
            </Button>
            <Button variant="outline" className="border-slate-200 bg-white text-[var(--erg-red)] hover:bg-rose-50" onClick={onSignOut}>
              <LogoutOutlinedIcon fontSize="inherit" />
              {copy.signOut}
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
}

function StudentBrandHeader({
  account,
  activePage,
  copy,
  studentName,
  studentClass,
  onPageChange,
  onSignIn,
  onSignOut,
}: {
  account: TeacherAccount | null;
  activePage: StudentPageKey;
  copy: DashboardCopy;
  studentName: string;
  studentClass: string;
  onPageChange: (page: StudentPageKey) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <BrandWordmark />
          <div className="lg:hidden">
            <ProfileMenu
              account={account}
              copy={copy}
              menuOpen={accountMenuOpen}
              studentClass={studentClass}
              studentName={studentName}
              onMenuOpenChange={setAccountMenuOpen}
              onPageChange={onPageChange}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
            />
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {copy.navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
                activePage === item.key
                  ? "bg-[var(--erg-blue)] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[var(--erg-blue)]",
              )}
              onClick={() => onPageChange(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ProfileMenu
            account={account}
            copy={copy}
            menuOpen={accountMenuOpen}
            studentClass={studentClass}
            studentName={studentName}
            onMenuOpenChange={setAccountMenuOpen}
            onPageChange={onPageChange}
            onSignIn={onSignIn}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({
  account,
  copy,
  menuOpen,
  studentClass,
  studentName,
  onMenuOpenChange,
  onPageChange,
  onSignIn,
  onSignOut,
}: {
  account: TeacherAccount | null;
  copy: DashboardCopy;
  menuOpen: boolean;
  studentClass: string;
  studentName: string;
  onMenuOpenChange: (open: boolean) => void;
  onPageChange: (page: StudentPageKey) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const initial = studentName.trim().slice(0, 1).toUpperCase();
  const signedInLabel = account ? copy.signedInAs : copy.guestLabel;

  function handleAccountClick() {
    onPageChange("account");
    onMenuOpenChange(false);
  }

  function handleAuthClick() {
    onMenuOpenChange(false);
    if (account) {
      onSignOut();
      return;
    }
    onSignIn();
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={menuOpen}
        className={cn(
          "flex min-w-[214px] items-center gap-3 rounded-xl border bg-white px-3 py-2 text-left shadow-[0_14px_32px_-28px_rgba(15,23,42,0.45)] transition hover:border-[var(--erg-blue)]/25 hover:bg-slate-50",
          menuOpen ? "border-[var(--erg-blue)]/30 ring-4 ring-[var(--erg-blue)]/6" : "border-slate-200",
        )}
        onClick={() => onMenuOpenChange(!menuOpen)}
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--erg-blue)] text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-[var(--erg-blue)]">{studentName}</span>
          <span className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
            <span>{studentClass}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{signedInLabel}</span>
          </span>
        </span>
        <ExpandMoreOutlinedIcon
          className={cn("shrink-0 text-slate-400 transition", menuOpen ? "rotate-180" : "rotate-0")}
          fontSize="small"
        />
      </button>

      {menuOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_64px_-32px_rgba(15,23,42,0.35)]">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-sm font-semibold text-slate-950">{studentName}</div>
            <div className="mt-1 text-xs text-slate-500">{studentClass}</div>
          </div>

          <div className="grid gap-1 p-2">
            <button
              type="button"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[var(--erg-blue)]"
              onClick={handleAccountClick}
            >
              <SettingsOutlinedIcon fontSize="small" />
              {copy.accountTitle}
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50",
                account ? "text-[var(--erg-red)]" : "text-[var(--erg-blue)]",
              )}
              onClick={handleAuthClick}
            >
              {account ? <LogoutOutlinedIcon fontSize="small" /> : <LoginOutlinedIcon fontSize="small" />}
              {account ? copy.signOut : copy.signIn}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BrandWordmark() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex items-end text-4xl font-black leading-none">
        <span className="text-[var(--erg-blue)]">ER</span>
        <span className="text-[var(--erg-red)]">G</span>
      </div>
      <div className="hidden min-w-0 sm:block">
        <div className="truncate text-2xl font-semibold leading-none text-[var(--erg-blue)]">EDURISE GLOBAL</div>
        <div className="mt-1 text-[11px] font-semibold uppercase text-slate-400">Learn today, lead tomorrow</div>
      </div>
    </div>
  );
}

function BrandDivider() {
  return <div className="h-1 bg-[linear-gradient(90deg,#cc0022_0%,#00008b_50%,#cc0022_100%)]" />;
}

function PageTitle({ description, icon, title }: { description: string; icon: ReactNode; title: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[var(--erg-blue)]/6 text-[var(--erg-blue)]">
          {icon}
        </span>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--erg-blue)]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  actionLabel,
  onAction,
  title,
}: {
  actionLabel: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <h2 className="text-xl font-semibold text-[var(--erg-blue)]">{title}</h2>
      <button type="button" className="text-sm font-semibold text-[var(--erg-blue)]" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
}

function PriorityPanel({
  assignment,
  copy,
  onOpen,
}: {
  assignment: StudentDashboardAssignment;
  copy: DashboardCopy;
  onOpen: () => void;
}) {
  return (
    <section className="rounded-lg bg-[var(--erg-blue)] p-6 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-white/70">{copy.priority.title}</div>
          <h2 className="mt-4 text-2xl font-semibold leading-snug">{assignment.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/78">{copy.priority.detail(assignment.dueLabel)}</p>
        </div>
        <div className="shrink-0">
          <StatusPill status={assignment.status} label={assignment.statusLabel} />
        </div>
      </div>
      <ProgressBar value={assignment.progressRate} className="mt-5 h-2.5 bg-white/20" indicatorClassName="bg-white" />
      <Button className="mt-5 bg-white text-[var(--erg-blue)] hover:bg-white/90" onClick={onOpen}>
        {copy.priority.action}
      </Button>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "default" | "danger";
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-500">{label}</div>
          <div className={cn("mt-2 text-3xl font-semibold", tone === "danger" ? "text-[var(--erg-red)]" : "text-[var(--erg-blue)]")}>
            {value}
          </div>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--erg-blue)]/6 text-[var(--erg-blue)]">
          {icon}
        </span>
      </div>
    </section>
  );
}

function QuickRankingCard({
  copy,
  entries,
  onOpen,
}: {
  copy: DashboardCopy;
  entries: StudentLeaderboardEntry[];
  onOpen: () => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <SectionHeader actionLabel={copy.rankingTitle} onAction={onOpen} title={copy.classRankingTitle} />
      <div className="grid gap-3 p-4">
        {entries.slice(0, 4).map((entry, index) => (
          <QuickStudentRow
            key={entry.id}
            entry={entry}
            index={index}
            scoreLabel={copy.chartScoreLabel}
            youBadge={copy.youBadge}
          />
        ))}
      </div>
    </section>
  );
}

function QuickStudentRow({
  entry,
  index,
  scoreLabel,
  youBadge,
}: {
  entry: StudentLeaderboardEntry;
  index: number;
  scoreLabel: string;
  youBadge: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-3",
        entry.isCurrentStudent ? "border-[var(--erg-blue)]/20 bg-[var(--erg-blue)]/5" : "border-slate-200 bg-white",
      )}
    >
      <div
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-semibold",
          index === 0
            ? "bg-amber-100 text-amber-700"
            : entry.isCurrentStudent
              ? "bg-[var(--erg-blue)] text-white"
              : "bg-slate-100 text-slate-600",
        )}
      >
        {getInitials(entry.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--erg-blue)]">#{index + 1}</span>
          <span className="truncate text-sm font-semibold text-slate-950">{entry.name}</span>
          {entry.isCurrentStudent ? (
            <Badge className="border-[var(--erg-red)]/10 bg-[var(--erg-red)]/5 text-[var(--erg-red)]" tone="outline">
              {youBadge}
            </Badge>
          ) : null}
        </div>
        <div className="mt-1 text-xs text-slate-500">{entry.className}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-lg font-semibold text-[var(--erg-blue)]">{entry.averageScore}</div>
        <div className="text-xs text-slate-500">{scoreLabel}</div>
      </div>
    </div>
  );
}

function RankingPanel({
  copy,
  entries,
  title,
}: {
  copy: DashboardCopy;
  entries: StudentLeaderboardEntry[];
  title: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-xl font-semibold text-[var(--erg-blue)]">{title}</h2>
      </div>
      <div className="p-5">
        <RankingBarChart entries={entries} scoreLabel={copy.chartScoreLabel} />
        <div className="mt-6 grid gap-3">
          {entries.map((entry, index) => (
            <LeaderboardRow
              key={entry.id}
              entry={entry}
              index={index}
              scoreLabel={copy.chartScoreLabel}
              youBadge={copy.youBadge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RankingBarChart({
  entries,
  scoreLabel,
}: {
  entries: StudentLeaderboardEntry[];
  scoreLabel: string;
}) {
  const maxScore = Math.max(...entries.map((entry) => entry.averageScore), 1);

  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="flex h-56 items-end gap-3 border-b border-slate-200 pb-3">
        {entries.map((entry, index) => {
          const height = Math.max(18, Math.round((entry.averageScore / maxScore) * 100));
          return (
            <div key={entry.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="text-sm font-semibold text-[var(--erg-blue)]">{entry.averageScore}</div>
              <div
                className={cn(
                  "w-full max-w-14 rounded-t-md",
                  entry.isCurrentStudent ? "bg-[var(--erg-red)]" : index === 0 ? "bg-amber-500" : "bg-[var(--erg-blue)]",
                )}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))` }}>
        {entries.map((entry) => (
          <div key={entry.id} className="truncate text-center text-xs font-semibold text-slate-600" title={entry.name}>
            {shortName(entry.name)}
          </div>
        ))}
      </div>
      <div className="mt-3 text-center text-xs font-semibold uppercase text-slate-400">{scoreLabel}</div>
    </div>
  );
}

function AssignmentCard({
  assignment,
  compact = false,
  copy,
  onOpen,
}: {
  assignment: StudentDashboardAssignment;
  compact?: boolean;
  copy: DashboardCopy;
  onOpen: () => void;
}) {
  const statusMeta = assignmentStatusMeta[assignment.status];
  const actionable = assignment.status !== "submitted";

  return (
    <Card className={cn("rounded-lg border bg-white shadow-none", statusMeta.cardClassName)}>
      <div className={compact ? "p-4" : "p-5"}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={assignment.status} label={assignment.statusLabel} />
              <CompactBadge>{assignment.subjectLabel}</CompactBadge>
            </div>

            <h3 className="mt-3 text-xl font-semibold leading-snug text-[var(--erg-blue)]">{assignment.title}</h3>
            {!compact ? (
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{assignment.teacherName}</span>
                <span>•</span>
                <span>{assignment.dueLabel}</span>
                <span>•</span>
                <span>{assignment.lastActivityLabel}</span>
              </div>
            ) : (
              <div className="mt-2 text-sm text-slate-500">{assignment.dueLabel}</div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {assignment.score !== null ? (
              <Badge className="border-[var(--erg-blue)]/10 bg-[var(--erg-blue)]/5 text-[var(--erg-blue)]" tone="outline">
                {copy.scoreLabel}: {copy.scoreBadge(assignment.score, assignment.maxScore)}
              </Badge>
            ) : null}

            <Button
              variant={actionable ? "default" : "outline"}
              className={cn(
                actionable
                  ? assignment.status === "overdue"
                    ? "bg-[var(--erg-red)] text-white hover:bg-[#b0001d]"
                    : "bg-[var(--erg-blue)] text-white hover:bg-[#060b7a]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
              )}
              onClick={actionable ? onOpen : undefined}
              disabled={!actionable}
            >
              {copy.assignmentAction(assignment.status)}
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_120px_120px]">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase text-slate-400">{copy.progressLabel}</span>
              <span className="text-sm font-semibold text-slate-900">{assignment.progressRate}%</span>
            </div>
            <ProgressBar value={assignment.progressRate} className="mt-2 h-2.5 bg-slate-100" indicatorClassName={statusMeta.progressClassName} />
            {!compact ? <p className="mt-3 text-sm leading-7 text-slate-500">{assignment.focusNote}</p> : null}
          </div>

          {!compact ? (
            <>
              <CompactStat label={copy.questionCountLabel} value={`${assignment.answeredCount}/${assignment.totalQuestions}`} />
              <CompactStat label={copy.scoreLabel} value={assignment.score !== null ? `${assignment.score}` : copy.pendingScore} />
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function CompactBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase text-slate-600">
      {children}
    </span>
  );
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-semibold text-[var(--erg-blue)]">{value}</div>
    </div>
  );
}

function ProfileStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={cn("mt-2 text-2xl font-semibold", tone === "danger" ? "text-[var(--erg-red)]" : "text-[var(--erg-blue)]")}>
        {value}
      </div>
    </div>
  );
}

function LeaderboardRow({
  entry,
  index,
  scoreLabel,
  youBadge,
}: {
  entry: StudentLeaderboardEntry;
  index: number;
  scoreLabel: string;
  youBadge: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 rounded-lg border px-4 py-3", entry.isCurrentStudent ? "border-[var(--erg-blue)]/20 bg-[var(--erg-blue)]/5" : "border-slate-200 bg-white")}>
      <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-semibold", index === 0 ? "bg-amber-100 text-amber-700" : "bg-[var(--erg-blue)]/8 text-[var(--erg-blue)]")}>
        #{index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-950">{entry.name}</span>
          {entry.isCurrentStudent ? (
            <Badge className="border-[var(--erg-red)]/10 bg-[var(--erg-red)]/5 text-[var(--erg-red)]" tone="outline">
              {youBadge}
            </Badge>
          ) : null}
        </div>
        <div className="mt-1 text-xs text-slate-500">{entry.className} • {entry.schoolName}</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-[var(--erg-blue)]">{entry.averageScore}</div>
        <div className="text-xs text-slate-500">{scoreLabel}</div>
      </div>
    </div>
  );
}

function StatusPill({ status, label }: { status: StudentAssignmentStatus; label: string }) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold uppercase", assignmentStatusMeta[status].chipClassName)}>
      {label}
    </span>
  );
}

function StudentFooter({ copy }: { copy: DashboardCopy }) {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <BrandDivider />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold text-[var(--erg-blue)]">{copy.footerTitle}</div>
          <div className="mt-1 text-sm text-slate-500">{copy.footerSubtitle}</div>
        </div>
        <div className="text-sm font-semibold text-slate-500">ERG Edurise Global</div>
      </div>
    </footer>
  );
}

function shortName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length <= 2 ? name : `${parts[0]} ${parts[parts.length - 1]}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.slice(0, 1) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].slice(0, 1) : "";
  return `${first}${last}`.toUpperCase();
}

const assignmentStatusMeta: Record<
  StudentAssignmentStatus,
  {
    chipClassName: string;
    progressClassName: string;
    cardClassName: string;
  }
> = {
  not_started: {
    chipClassName: "border-slate-200 bg-slate-50 text-slate-600",
    progressClassName: "bg-slate-400",
    cardClassName: "border-slate-200",
  },
  in_progress: {
    chipClassName: "border-amber-200 bg-amber-50 text-amber-700",
    progressClassName: "bg-amber-500",
    cardClassName: "border-amber-100",
  },
  submitted: {
    chipClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    progressClassName: "bg-emerald-500",
    cardClassName: "border-emerald-100",
  },
  overdue: {
    chipClassName: "border-rose-200 bg-rose-50 text-rose-700",
    progressClassName: "bg-rose-500",
    cardClassName: "border-rose-100",
  },
};

const viCopy: DashboardCopy = {
  navItems: [
    { key: "overview", label: "Tổng quan", icon: <HomeOutlinedIcon fontSize="small" /> },
    { key: "assignments", label: "Bài tập", icon: <AssignmentTurnedInOutlinedIcon fontSize="small" /> },
    { key: "ranking", label: "Xếp hạng", icon: <BarChartOutlinedIcon fontSize="small" /> },
  ],
  heroEyebrow: "Bảng học tập",
  heroTitle: (name: string) => `Chào ${name}, chọn bài cần làm hôm nay.`,
  heroDescription: (taskTitle: string) =>
    `Ưu tiên của bạn là "${taskTitle}". Màn hình này gom bài tập, tiến độ và xếp hạng vào từng trang rõ ràng để bạn không phải tìm lâu.`,
  primaryAction: "Làm bài ưu tiên",
  secondaryAction: "Xem bài tập",
  stats: {
    open: "Bài đang mở",
    overdue: "Bài quá hạn",
    average: "Điểm trung bình",
    classRank: "Hạng lớp",
    gradeRank: "Hạng khối",
  },
  priority: {
    title: "Việc nên làm ngay",
    action: "Vào làm bài",
    detail: (dueLabel: string) => `Hạn: ${dueLabel}. Hoàn thành bài này trước để giữ nhịp học.`,
  },
  todayTitle: "Bài cần xử lý hôm nay",
  assignmentsTitle: "Bài tập",
  assignmentsDescription: "Tất cả bài được giao, trạng thái quá hạn, tiến độ hoàn thành và điểm số.",
  rankingTitle: "Xếp hạng",
  rankingDescription: "Theo dõi top trong lớp và trong khối bằng biểu đồ cột, dễ nhìn hơn cho học sinh.",
  classRankingTitle: "Top trong lớp",
  gradeRankingTitle: "Top trong khối",
  accountTitle: "Quản lý tài khoản",
  accountDescription: "Thông tin hồ sơ học sinh, trạng thái đăng nhập và các thao tác tài khoản.",
  learningProfileTitle: "Hồ sơ học tập",
  loginStateTitle: "Trạng thái đăng nhập",
  accountActionsTitle: "Thao tác tài khoản",
  progressLabel: "Tiến độ",
  questionCountLabel: "Câu đã làm",
  scoreLabel: "Điểm",
  scoreBadge: (score: number, maxScore: number) => `${score}/${maxScore}`,
  pendingScore: "Chờ chấm",
  assignmentAction: (status: StudentAssignmentStatus) =>
    status === "in_progress" ? "Làm tiếp" : status === "overdue" ? "Làm ngay" : status === "submitted" ? "Đã nộp" : "Bắt đầu",
  chartScoreLabel: "điểm TB",
  youBadge: "Bạn",
  signedInAs: "Đã đăng nhập",
  guestLabel: "Chưa đăng nhập",
  signIn: "Đăng nhập",
  signOut: "Đăng xuất",
  footerTitle: "ERG Edurise Global",
  footerSubtitle: "Learn today, lead tomorrow",
  sessionBadge: "Quiz session",
  sessionEyebrow: "Phiên làm bài",
  sessionDescription: (subject: string, teacher: string, dueLabel: string) =>
    `${subject} • ${teacher} • ${dueLabel}. Hoàn thành trọn phiên để hệ thống cập nhật tiến độ và điểm số.`,
  backToDashboard: "Quay lại",
};

const enCopy: DashboardCopy = {
  navItems: [
    { key: "overview", label: "Overview", icon: <HomeOutlinedIcon fontSize="small" /> },
    { key: "assignments", label: "Assignments", icon: <AssignmentTurnedInOutlinedIcon fontSize="small" /> },
    { key: "ranking", label: "Ranking", icon: <BarChartOutlinedIcon fontSize="small" /> },
  ],
  heroEyebrow: "Learning board",
  heroTitle: (name: string) => `Hi ${name}, choose what to finish today.`,
  heroDescription: (taskTitle: string) =>
    `Your priority is "${taskTitle}". Assignments, progress, and ranking are separated into clear pages so students can find the next action quickly.`,
  primaryAction: "Open priority task",
  secondaryAction: "View assignments",
  stats: {
    open: "Open tasks",
    overdue: "Overdue",
    average: "Average score",
    classRank: "Class rank",
    gradeRank: "Grade rank",
  },
  priority: {
    title: "Best next action",
    action: "Start task",
    detail: (dueLabel: string) => `Due: ${dueLabel}. Finish this first to keep your learning pace.`,
  },
  todayTitle: "Tasks to handle today",
  assignmentsTitle: "Assignments",
  assignmentsDescription: "All assigned tasks, overdue status, completion progress, and score.",
  rankingTitle: "Ranking",
  rankingDescription: "Track class and grade leaders with simple bar charts.",
  classRankingTitle: "Top in class",
  gradeRankingTitle: "Top in grade",
  accountTitle: "Manage account",
  accountDescription: "Student profile, login state, and account actions.",
  learningProfileTitle: "Learning profile",
  loginStateTitle: "Login state",
  accountActionsTitle: "Account actions",
  progressLabel: "Progress",
  questionCountLabel: "Questions",
  scoreLabel: "Score",
  scoreBadge: (score: number, maxScore: number) => `${score}/${maxScore}`,
  pendingScore: "Pending",
  assignmentAction: (status: StudentAssignmentStatus) =>
    status === "in_progress" ? "Continue" : status === "overdue" ? "Do now" : status === "submitted" ? "Submitted" : "Start",
  chartScoreLabel: "avg score",
  youBadge: "You",
  signedInAs: "Signed in",
  guestLabel: "Not signed in",
  signIn: "Sign in",
  signOut: "Sign out",
  footerTitle: "ERG Edurise Global",
  footerSubtitle: "Learn today, lead tomorrow",
  sessionBadge: "Quiz session",
  sessionEyebrow: "Quiz mode",
  sessionDescription: (subject: string, teacher: string, dueLabel: string) =>
    `${subject} • ${teacher} • ${dueLabel}. Finish the full session to refresh progress and score.`,
  backToDashboard: "Back",
};
