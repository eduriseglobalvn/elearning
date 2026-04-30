import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { PlayerShell } from "@/components/quiz/player-shell";
import { Badge, Button, Card, ProgressBar } from "@/components/ui/dashboard-kit";
import { getCurrentAccount, logoutAccount } from "@/features/auth/api/auth-storage";
import type { TeacherAccount } from "@/features/auth/types/auth-types";
import { useI18n } from "@/features/i18n";
import {
  studentAssignments,
  studentDashboardProfile,
  studentDiscussionThreads,
  studentTeacherAnnouncements,
} from "@/features/student-dashboard/api/mock-student-dashboard";
import profanityWords from "@/features/student-dashboard/config/profanity-words.json";
import type {
  StudentAssignmentAttempt,
  StudentAssignmentStatus,
  StudentDashboardAssignment,
  StudentDiscussionImageAttachment,
  StudentDiscussionThread,
  StudentTeacherAnnouncement,
} from "@/features/student-dashboard/types/student-dashboard-types";
import { cn } from "@/lib/utils";

type StudentViewState =
  | { type: "dashboard" }
  | {
      type: "quiz";
      assignmentId: string;
    };

type StudentPageKey = "overview" | "assignments" | "scores" | "discussion" | "announcements" | "account";

type DiscussionScrollTarget = {
  replyId?: string;
  threadId: string;
};

type StudentDiscussionNotification = DiscussionScrollTarget & {
  id: string;
  primaryText: string;
  secondaryText: string;
  timeLabel: string;
  unread: boolean;
};

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
    completed: string;
  };
  priority: {
    title: string;
    action: string;
    detail: (dueLabel: string) => string;
  };
  todayTitle: string;
  assignmentsTitle: string;
  assignmentsDescription: string;
  scoresTitle: string;
  scoresDescription: string;
  bestScoreLabel: string;
  recentResultsTitle: string;
  noRecentResults: string;
  attemptDurationLabel: string;
  discussionTitle: string;
  discussionDescription: string;
  discussionComposerTitle: string;
  discussionTitlePlaceholder: string;
  discussionBodyPlaceholder: string;
  discussionAttachmentAction: string;
  discussionAttachmentHint: string;
  discussionRemoveAttachment: string;
  discussionModerationWarning: string;
  discussionPostAction: string;
  discussionReplyPlaceholder: string;
  discussionReplyAction: string;
  discussionRepliesLabel: (count: number) => string;
  discussionResolvedLabel: string;
  discussionRelatedLabel: string;
  discussionEmptyTitle: string;
  discussionEmptyDescription: string;
  discussionPageLabel: (page: number, totalPages: number) => string;
  discussionPreviousPage: string;
  discussionNextPage: string;
  announcementTitle: string;
  announcementDescription: string;
  announcementHeroTitle: string;
  announcementHeroEmpty: string;
  announcementPinnedLabel: string;
  notificationTitle: string;
  notificationEmpty: string;
  notificationNewTopicLabel: string;
  notificationImageOnly: string;
  notificationNewThread: (authorName: string) => string;
  notificationNewReply: (authorName: string) => string;
  notificationTopicContext: (title: string) => string;
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
  const [discussionThreads, setDiscussionThreads] = useState<StudentDiscussionThread[]>(studentDiscussionThreads);
  const [discussionNotifications, setDiscussionNotifications] = useState<StudentDiscussionNotification[]>(() =>
    createInitialDiscussionNotifications(studentDiscussionThreads, locale),
  );
  const [discussionScrollTarget, setDiscussionScrollTarget] = useState<DiscussionScrollTarget | null>(null);

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
  const teacherAnnouncements = studentTeacherAnnouncements;
  const pinnedAnnouncement = teacherAnnouncements.find((announcement) => announcement.isPinned) ?? teacherAnnouncements[0];

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

  function createDiscussionThread({
    attachments,
    content,
    title,
  }: {
    attachments: StudentDiscussionImageAttachment[];
    content: string;
    title: string;
  }) {
    const now = Date.now();
    const safeTitle = maskProfanity(title);
    const safeContent = maskProfanity(content);
    const threadId = `discussion-${now}`;
    const nextThread: StudentDiscussionThread = {
      id: threadId,
      title: safeTitle.value,
      content: safeContent.value,
      authorName: studentDashboardProfile.name,
      authorInitials: getInitials(studentDashboardProfile.name),
      createdAtLabel: locale === "vi" ? "Vừa xong" : "Just now",
      createdAtMs: now,
      className: studentDashboardProfile.className,
      isResolved: false,
      attachments,
      moderationWarning: safeTitle.hasProfanity || safeContent.hasProfanity,
      replies: [],
    };

    setDiscussionThreads((currentThreads) => [nextThread, ...currentThreads]);
    pushDiscussionNotification({
      id: `notification-${threadId}`,
      primaryText: copy.notificationNewThread(nextThread.authorName),
      secondaryText: nextThread.title,
      replyId: undefined,
      threadId,
      timeLabel: locale === "vi" ? "Vừa xong" : "Just now",
      unread: true,
    });
  }

  function replyToDiscussionThread(threadId: string, content: string, attachments: StudentDiscussionImageAttachment[]) {
    const now = Date.now();
    const safeContent = maskProfanity(content);
    const replyId = `reply-${threadId}-${now}`;
    const threadTitle = discussionThreads.find((thread) => thread.id === threadId)?.title ?? copy.discussionTitle;

    setDiscussionThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              replies: [
                ...thread.replies,
                {
                  id: replyId,
                  authorName: studentDashboardProfile.name,
                  authorInitials: getInitials(studentDashboardProfile.name),
                  createdAtLabel: locale === "vi" ? "Vừa xong" : "Just now",
                  createdAtMs: now,
                  content: safeContent.value,
                  attachments,
                  moderationWarning: safeContent.hasProfanity,
                },
              ],
            }
          : thread,
      ),
    );
    pushDiscussionNotification({
      id: `notification-${replyId}`,
      primaryText: copy.notificationNewReply(studentDashboardProfile.name),
      secondaryText: copy.notificationTopicContext(threadTitle),
      replyId,
      threadId,
      timeLabel: locale === "vi" ? "Vừa xong" : "Just now",
      unread: true,
    });
  }

  function pushDiscussionNotification(notification: StudentDiscussionNotification) {
    setDiscussionNotifications((currentNotifications) => [notification, ...currentNotifications].slice(0, 8));
  }

  function handleDiscussionNotificationClick(target: DiscussionScrollTarget) {
    setActivePage("discussion");
    setDiscussionScrollTarget(target);
    setDiscussionNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.threadId === target.threadId && notification.replyId === target.replyId
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  }

  if (viewState.type === "quiz" && currentAssignment) {
    return (
      <main className="min-h-screen bg-[#f7f8fb]">
        <StudentBrandHeader
          activePage={activePage}
          account={account}
          copy={copy}
          notifications={discussionNotifications}
          studentName={studentDashboardProfile.name}
          studentClass={studentDashboardProfile.className}
          onNotificationClick={handleDiscussionNotificationClick}
          onPageChange={(nextPage) => {
            setActivePage(nextPage);
            setViewState({ type: "dashboard" });
          }}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-[var(--erg-blue)]/10 bg-[var(--erg-blue)]/5 text-[var(--erg-blue)]" tone="outline">
                    {copy.sessionBadge}
                  </Badge>
                  <StatusPill status={currentAssignment.status} label={currentAssignment.statusLabel} />
                </div>
                <h1 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight text-[var(--erg-blue)]">
                  {currentAssignment.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
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

        <div className="mx-auto w-full max-w-[1480px] px-3 py-4">
          <PlayerShell assignmentId={currentAssignment.id} quizId={currentAssignment.quizId} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <StudentBrandHeader
        activePage={activePage}
        account={account}
        copy={copy}
        notifications={discussionNotifications}
        studentName={studentDashboardProfile.name}
        studentClass={studentDashboardProfile.className}
        onNotificationClick={handleDiscussionNotificationClick}
        onPageChange={setActivePage}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {activePage === "overview" ? (
        <OverviewView
          copy={copy}
          announcement={pinnedAnnouncement}
          onOpenAssignment={openAssignment}
          onPageChange={setActivePage}
          openAssignments={openAssignments}
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

      {activePage === "scores" ? (
        <ScoresView assignments={assignments} copy={copy} />
      ) : null}

      {activePage === "discussion" ? (
        <DiscussionView
          copy={copy}
          scrollTarget={discussionScrollTarget}
          studentName={studentDashboardProfile.name}
          threads={discussionThreads}
          onCreateThread={createDiscussionThread}
          onScrollHandled={() => setDiscussionScrollTarget(null)}
          onReply={replyToDiscussionThread}
        />
      ) : null}

      {activePage === "announcements" ? (
        <AnnouncementsView
          announcements={teacherAnnouncements}
          copy={copy}
        />
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
  announcement,
  copy,
  onOpenAssignment,
  onPageChange,
  openAssignments,
  priorityAssignment,
}: {
  announcement: StudentTeacherAnnouncement | undefined;
  copy: DashboardCopy;
  onOpenAssignment: (assignmentId: string) => void;
  onPageChange: (page: StudentPageKey) => void;
  openAssignments: StudentDashboardAssignment[];
  priorityAssignment: StudentDashboardAssignment;
}) {
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-500">{copy.heroEyebrow}</div>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-[var(--erg-blue)] sm:text-3xl">
              {copy.heroTitle(studentDashboardProfile.name)}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {copy.heroDescription(priorityAssignment.title)}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              className="bg-[var(--erg-blue)] px-4 text-white hover:bg-[#060b7a]"
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
            </Button>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {announcement?.isPinned ? <CompactBadge>{copy.announcementPinnedLabel}</CompactBadge> : null}
                <CompactBadge>{announcement?.targetLabel ?? studentDashboardProfile.className}</CompactBadge>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-[var(--erg-blue)]">
                {announcement?.title ?? copy.announcementHeroTitle}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                {announcement?.content ?? copy.announcementHeroEmpty}
              </p>
              {announcement ? (
                <div className="mt-2 text-xs font-semibold text-slate-500">
                  {announcement.teacherName} • {announcement.createdAtLabel}
                </div>
              ) : null}
            </div>

            <Button
              variant="outline"
              className="shrink-0 border-slate-200 bg-white text-[var(--erg-blue)] hover:bg-slate-50"
              onClick={() => onPageChange("announcements")}
            >
              {copy.announcementTitle}
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white">
        <SectionHeader
          actionLabel={copy.secondaryAction}
          onAction={() => onPageChange("assignments")}
          title={copy.todayTitle}
        />
        <div className="grid gap-2 p-3">
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

    </section>
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
    <section className="mx-auto max-w-[1480px] px-4 py-6">
      <PageTitle
        description={copy.assignmentsDescription}
        icon={<AssignmentTurnedInOutlinedIcon fontSize="inherit" />}
        title={copy.assignmentsTitle}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ProfileStat label={copy.stats.open} value={`${openAssignments.length}`} />
        <ProfileStat label={copy.stats.overdue} value={`${overdueAssignments.length}`} tone="danger" />
        <ProfileStat label={copy.stats.average} value={`${completedAssignments.length}/${assignments.length}`} />
      </div>

      <div className="mt-4 grid gap-3">
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

function ScoresView({ assignments, copy }: { assignments: StudentDashboardAssignment[]; copy: DashboardCopy }) {
  const attemptedAssignments = assignments.filter((assignment) => assignment.attempts.length > 0);

  return (
    <section className="mx-auto max-w-[1480px] px-4 py-6">
      <PageTitle
        description={copy.scoresDescription}
        icon={<AssignmentTurnedInOutlinedIcon fontSize="inherit" />}
        title={copy.scoresTitle}
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {attemptedAssignments.map((assignment) => (
          <AssignmentScoreCard key={assignment.id} assignment={assignment} copy={copy} />
        ))}
      </div>
    </section>
  );
}

function DiscussionView({
  copy,
  scrollTarget,
  studentName,
  threads,
  onCreateThread,
  onScrollHandled,
  onReply,
}: {
  copy: DashboardCopy;
  scrollTarget: DiscussionScrollTarget | null;
  studentName: string;
  threads: StudentDiscussionThread[];
  onCreateThread: (thread: { attachments: StudentDiscussionImageAttachment[]; content: string; title: string }) => void;
  onScrollHandled: () => void;
  onReply: (threadId: string, content: string, attachments: StudentDiscussionImageAttachment[]) => void;
}) {
  const discussionPageSize = 3;
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [threadAttachments, setThreadAttachments] = useState<StudentDiscussionImageAttachment[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyAttachments, setReplyAttachments] = useState<Record<string, StudentDiscussionImageAttachment[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedTarget, setHighlightedTarget] = useState<DiscussionScrollTarget | null>(null);
  const sortedThreads = useMemo(
    () => [...threads].sort((left, right) => getThreadActivityMs(right) - getThreadActivityMs(left)),
    [threads],
  );
  const totalPages = Math.max(1, Math.ceil(sortedThreads.length / discussionPageSize));
  const visibleThreads = sortedThreads.slice((currentPage - 1) * discussionPageSize, currentPage * discussionPageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!scrollTarget) {
      return;
    }

    const targetThreadIndex = sortedThreads.findIndex((thread) => thread.id === scrollTarget.threadId);
    if (targetThreadIndex < 0) {
      return;
    }

    const nextPage = Math.floor(targetThreadIndex / discussionPageSize) + 1;
    setCurrentPage(nextPage);
    setHighlightedTarget(scrollTarget);

    window.setTimeout(() => {
      const targetId = scrollTarget.replyId
        ? getDiscussionReplyDomId(scrollTarget.replyId)
        : getDiscussionThreadDomId(scrollTarget.threadId);
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
      onScrollHandled();
    }, 80);

    const highlightTimer = window.setTimeout(() => setHighlightedTarget(null), 2400);
    return () => window.clearTimeout(highlightTimer);
  }, [onScrollHandled, scrollTarget, sortedThreads]);

  function handleCreateThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = threadTitle.trim();
    const nextContent = threadContent.trim();
    if (!nextTitle || (!nextContent && threadAttachments.length === 0)) {
      return;
    }

    onCreateThread({
      attachments: threadAttachments,
      title: nextTitle,
      content: nextContent,
    });
    setThreadTitle("");
    setThreadContent("");
    setThreadAttachments([]);
  }

  function handleReply(threadId: string) {
    const nextReply = replyDrafts[threadId]?.trim();
    const nextAttachments = replyAttachments[threadId] ?? [];
    if (!nextReply && nextAttachments.length === 0) {
      return;
    }

    onReply(threadId, nextReply, nextAttachments);
    setReplyDrafts((currentDrafts) => ({ ...currentDrafts, [threadId]: "" }));
    setReplyAttachments((currentAttachments) => ({ ...currentAttachments, [threadId]: [] }));
  }

  async function handleThreadAttachmentChange(files: FileList | null) {
    const nextAttachments = await createImageAttachments(files);
    setThreadAttachments((currentAttachments) => [...currentAttachments, ...nextAttachments]);
  }

  async function handleReplyAttachmentChange(threadId: string, files: FileList | null) {
    const nextAttachments = await createImageAttachments(files);
    setReplyAttachments((currentAttachments) => ({
      ...currentAttachments,
      [threadId]: [...(currentAttachments[threadId] ?? []), ...nextAttachments],
    }));
  }

  return (
    <section className="mx-auto max-w-[1480px] px-4 py-6">
      <PageTitle
        description={copy.discussionDescription}
        icon={<ForumOutlinedIcon fontSize="inherit" />}
        title={copy.discussionTitle}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <form className="rounded-xl border border-slate-200 bg-white p-4" onSubmit={handleCreateThread}>
          <div className="flex items-center gap-3">
            <Avatar initials={getInitials(studentName)} />
            <div>
              <h2 className="text-base font-semibold text-[var(--erg-blue)]">{copy.discussionComposerTitle}</h2>
              <p className="mt-0.5 text-xs text-slate-500">{studentName}</p>
            </div>
          </div>

          <input
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--erg-blue)] focus:ring-2 focus:ring-[var(--erg-blue)]/10"
            placeholder={copy.discussionTitlePlaceholder}
            value={threadTitle}
            onChange={(event) => setThreadTitle(event.target.value)}
          />

          <textarea
            className="mt-3 min-h-[132px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[var(--erg-blue)] focus:ring-2 focus:ring-[var(--erg-blue)]/10"
            placeholder={copy.discussionBodyPlaceholder}
            value={threadContent}
            onChange={(event) => setThreadContent(event.target.value)}
          />

          <AttachmentPicker
            attachments={threadAttachments}
            buttonLabel={copy.discussionAttachmentAction}
            hint={copy.discussionAttachmentHint}
            inputId="discussion-thread-images"
            removeLabel={copy.discussionRemoveAttachment}
            onChange={handleThreadAttachmentChange}
            onRemove={(attachmentId) =>
              setThreadAttachments((currentAttachments) =>
                currentAttachments.filter((attachment) => attachment.id !== attachmentId),
              )
            }
          />

          <Button className="mt-3 w-full bg-[var(--erg-blue)] text-white hover:bg-[#060b7a]" type="submit">
            {copy.discussionPostAction}
          </Button>
        </form>

        <div className="min-h-0">
          <div className="max-h-[720px] overflow-y-auto pr-2">
          <div className="grid gap-3">
          {visibleThreads.length > 0 ? (
            visibleThreads.map((thread) => {
              const sortedReplies = [...thread.replies].sort((left, right) => right.createdAtMs - left.createdAtMs);

              return (
              <article
                key={thread.id}
                className={cn(
                  "scroll-mt-28 rounded-xl border p-4 transition-colors duration-500",
                  highlightedTarget?.threadId === thread.id && !highlightedTarget.replyId
                    ? "border-amber-200 bg-amber-50/70"
                    : "border-slate-200 bg-white",
                )}
                id={getDiscussionThreadDomId(thread.id)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <Avatar initials={thread.authorInitials} />
                      <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <CompactBadge>{thread.className}</CompactBadge>
                        {thread.isResolved ? (
                          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase text-emerald-700">
                            {copy.discussionResolvedLabel}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--erg-blue)]">{thread.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{thread.content}</p>
                      {thread.moderationWarning ? <ModerationNotice copy={copy} /> : null}
                      <ImageAttachmentGrid attachments={thread.attachments} />
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{thread.authorName}</span>
                        <span>{thread.createdAtLabel}</span>
                        {thread.relatedAssignmentTitle ? (
                          <span>
                            {copy.discussionRelatedLabel}: {thread.relatedAssignmentTitle}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-lg bg-slate-50 px-3 py-2 text-center">
                    <div className="text-lg font-semibold text-[var(--erg-blue)]">{thread.replies.length}</div>
                    <div className="text-xs font-semibold uppercase text-slate-400">
                      {copy.discussionRepliesLabel(thread.replies.length)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                  {sortedReplies.slice(0, 3).map((reply) => (
                    <div
                      key={reply.id}
                      className={cn(
                        "scroll-mt-28 flex gap-3 rounded-lg p-3 transition-colors duration-500",
                        highlightedTarget?.replyId === reply.id ? "bg-amber-50 ring-1 ring-amber-200" : "bg-slate-50",
                      )}
                      id={getDiscussionReplyDomId(reply.id)}
                    >
                      <Avatar initials={reply.authorInitials} size="sm" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-900">{reply.authorName}</span>
                          <span className="text-slate-500">{reply.createdAtLabel}</span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{reply.content}</p>
                        {reply.moderationWarning ? <ModerationNotice copy={copy} /> : null}
                        <ImageAttachmentGrid attachments={reply.attachments} compact />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <div className="min-w-0 flex-1">
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--erg-blue)] focus:ring-2 focus:ring-[var(--erg-blue)]/10"
                      placeholder={copy.discussionReplyPlaceholder}
                      value={replyDrafts[thread.id] ?? ""}
                      onChange={(event) =>
                        setReplyDrafts((currentDrafts) => ({
                          ...currentDrafts,
                          [thread.id]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleReply(thread.id);
                        }
                      }}
                    />
                    <AttachmentPicker
                      attachments={replyAttachments[thread.id] ?? []}
                      buttonLabel={copy.discussionAttachmentAction}
                      hint={copy.discussionAttachmentHint}
                      inputId={`discussion-reply-images-${thread.id}`}
                      removeLabel={copy.discussionRemoveAttachment}
                      onChange={(files) => handleReplyAttachmentChange(thread.id, files)}
                      onRemove={(attachmentId) =>
                        setReplyAttachments((currentAttachments) => ({
                          ...currentAttachments,
                          [thread.id]: (currentAttachments[thread.id] ?? []).filter(
                            (attachment) => attachment.id !== attachmentId,
                          ),
                        }))
                      }
                    />
                  </div>
                  <Button
                    className="bg-[var(--erg-blue)] px-4 text-white hover:bg-[#060b7a] sm:self-start"
                    type="button"
                    onClick={() => handleReply(thread.id)}
                  >
                    {copy.discussionReplyAction}
                  </Button>
                </div>
              </article>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-[var(--erg-blue)]">{copy.discussionEmptyTitle}</h2>
              <p className="mt-2 text-sm text-slate-500">{copy.discussionEmptyDescription}</p>
            </div>
          )}
          </div>
          </div>

          {totalPages > 1 ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <Button
                variant="outline"
                className="border-slate-200 bg-white text-[var(--erg-blue)] hover:bg-slate-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                {copy.discussionPreviousPage}
              </Button>
              <div className="text-sm font-semibold text-slate-500">
                {copy.discussionPageLabel(currentPage, totalPages)}
              </div>
              <Button
                variant="outline"
                className="border-slate-200 bg-white text-[var(--erg-blue)] hover:bg-slate-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                {copy.discussionNextPage}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function AnnouncementsView({
  announcements,
  copy,
}: {
  announcements: StudentTeacherAnnouncement[];
  copy: DashboardCopy;
}) {
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-6">
      <PageTitle
        description={copy.announcementDescription}
        icon={<NotificationsNoneOutlinedIcon fontSize="inherit" />}
        title={copy.announcementTitle}
      />

      <div className="mt-4 grid gap-3">
        {announcements.map((announcement) => (
          <article
            key={announcement.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {announcement.isPinned ? <CompactBadge>{copy.announcementPinnedLabel}</CompactBadge> : null}
                  <CompactBadge>{announcement.targetLabel}</CompactBadge>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-[var(--erg-blue)]">{announcement.title}</h2>
                <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">{announcement.content}</p>
              </div>
              <div className="shrink-0 rounded-lg bg-slate-50 px-3 py-2 text-right text-xs text-slate-500">
                <div className="font-semibold text-slate-700">{announcement.teacherName}</div>
                <div className="mt-1">{announcement.createdAtLabel}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AttachmentPicker({
  attachments,
  buttonLabel,
  hint,
  inputId,
  removeLabel,
  onChange,
  onRemove,
}: {
  attachments: StudentDiscussionImageAttachment[];
  buttonLabel: string;
  hint: string;
  inputId: string;
  removeLabel: string;
  onChange: (files: FileList | null) => void;
  onRemove: (attachmentId: string) => void;
}) {
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <label
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-[var(--erg-blue)] transition hover:bg-slate-50"
          htmlFor={inputId}
        >
          <ImageOutlinedIcon fontSize="small" />
          {buttonLabel}
        </label>
        <input
          accept="image/*"
          className="sr-only"
          id={inputId}
          multiple
          type="file"
          onChange={(event) => {
            onChange(event.target.files);
            event.target.value = "";
          }}
        />
        <span className="text-xs text-slate-500">{hint}</span>
      </div>

      {attachments.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img alt={attachment.name} className="h-full w-full object-cover" src={attachment.url} />
              <button
                type="button"
                className="absolute inset-x-1 bottom-1 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-[var(--erg-red)] opacity-0 shadow-sm transition group-hover:opacity-100"
                onClick={() => onRemove(attachment.id)}
              >
                {removeLabel}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ImageAttachmentGrid({
  attachments,
  compact = false,
}: {
  attachments: StudentDiscussionImageAttachment[];
  compact?: boolean;
}) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className={cn("mt-3 flex flex-wrap gap-2", compact && "mt-2")}>
      {attachments.map((attachment) => (
        <a
          key={attachment.id}
          className={cn(
            "block overflow-hidden rounded-lg border border-slate-200 bg-slate-50",
            compact ? "h-16 w-16" : "h-28 w-28",
          )}
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          title={attachment.name}
        >
          <img alt={attachment.name} className="h-full w-full object-cover" src={attachment.url} />
        </a>
      ))}
    </div>
  );
}

function ModerationNotice({ copy }: { copy: DashboardCopy }) {
  return (
    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
      {copy.discussionModerationWarning}
    </div>
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
    <section className="mx-auto max-w-[1480px] px-4 py-6">
      <PageTitle
        description={copy.accountDescription}
        icon={<AccountCircleOutlinedIcon fontSize="inherit" />}
        title={copy.accountTitle}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
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
            <ProfileStat label={copy.stats.completed} value={`${studentDashboardProfile.completedAssignments}`} />
            <ProfileStat label={copy.assignmentsTitle} value={`${studentDashboardProfile.completedAssignments}/${studentDashboardProfile.totalAssignments}`} />
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
  notifications,
  studentName,
  studentClass,
  onNotificationClick,
  onPageChange,
  onSignIn,
  onSignOut,
}: {
  account: TeacherAccount | null;
  activePage: StudentPageKey;
  copy: DashboardCopy;
  notifications: StudentDiscussionNotification[];
  studentName: string;
  studentClass: string;
  onNotificationClick: (target: DiscussionScrollTarget) => void;
  onPageChange: (page: StudentPageKey) => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <BrandWordmark />
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <NotificationMenu
                copy={copy}
                menuOpen={notificationMenuOpen}
                notifications={notifications}
                onMenuOpenChange={setNotificationMenuOpen}
                onNotificationClick={(target) => {
                  setNotificationMenuOpen(false);
                  onNotificationClick(target);
                }}
              />
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
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-1 lg:pb-0">
          {copy.navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold transition",
                activePage === item.key
                  ? "bg-slate-100 text-[var(--erg-blue)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[var(--erg-blue)]",
              )}
              onClick={() => onPageChange(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <NotificationMenu
            copy={copy}
            menuOpen={notificationMenuOpen}
            notifications={notifications}
            onMenuOpenChange={setNotificationMenuOpen}
            onNotificationClick={(target) => {
              setNotificationMenuOpen(false);
              onNotificationClick(target);
            }}
          />
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
          "flex min-w-[148px] items-center gap-2 rounded-lg border bg-white px-2 py-1.5 text-left transition hover:border-[var(--erg-blue)]/25 hover:bg-slate-50",
          menuOpen ? "border-[var(--erg-blue)]/30 ring-4 ring-[var(--erg-blue)]/6" : "border-slate-200",
        )}
        onClick={() => onMenuOpenChange(!menuOpen)}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--erg-blue)] text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block max-w-[98px] truncate text-sm font-semibold leading-4 text-[var(--erg-blue)]">{studentName}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] leading-4 text-slate-500">
            <span>{studentClass}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
            <span className="max-w-[76px] truncate">{signedInLabel}</span>
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

function NotificationMenu({
  copy,
  menuOpen,
  notifications,
  onMenuOpenChange,
  onNotificationClick,
}: {
  copy: DashboardCopy;
  menuOpen: boolean;
  notifications: StudentDiscussionNotification[];
  onMenuOpenChange: (open: boolean) => void;
  onNotificationClick: (target: DiscussionScrollTarget) => void;
}) {
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-label={copy.notificationTitle}
        className={cn(
          "relative grid h-10 w-10 place-items-center rounded-lg border bg-white text-[var(--erg-blue)] transition hover:border-[var(--erg-blue)]/25 hover:bg-slate-50",
          menuOpen ? "border-[var(--erg-blue)]/30 ring-4 ring-[var(--erg-blue)]/6" : "border-slate-200",
        )}
        onClick={() => onMenuOpenChange(!menuOpen)}
      >
        <NotificationsNoneOutlinedIcon fontSize="small" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--erg-red)] px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {menuOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_64px_-32px_rgba(15,23,42,0.35)]">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-sm font-semibold text-[var(--erg-blue)]">{copy.notificationTitle}</div>
          </div>
          <div className="max-h-[360px] overflow-y-auto p-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50",
                    notification.unread ? "bg-[var(--erg-blue)]/5" : "bg-white",
                  )}
                  onClick={() =>
                    onNotificationClick({
                      replyId: notification.replyId,
                      threadId: notification.threadId,
                    })
                  }
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-1 h-2 w-2 shrink-0 rounded-full",
                        notification.unread ? "bg-[var(--erg-red)]" : "bg-slate-300",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold leading-5 text-slate-900">
                        {notification.primaryText}
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-5 text-slate-500">
                        {notification.secondaryText}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">{notification.timeLabel}</span>
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-slate-500">{copy.notificationEmpty}</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BrandWordmark() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex items-end text-3xl font-black leading-none">
        <span className="text-[var(--erg-blue)]">ER</span>
        <span className="text-[var(--erg-red)]">G</span>
      </div>
      <div className="hidden min-w-0 sm:block">
        <div className="truncate text-xl font-semibold leading-none text-[var(--erg-blue)]">EDURISE GLOBAL</div>
        <div className="mt-1 text-[11px] font-semibold uppercase text-slate-400">Learn today, lead tomorrow</div>
      </div>
    </div>
  );
}

function PageTitle({ description, icon, title }: { description: string; icon: ReactNode; title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-100 text-[var(--erg-blue)]">
          {icon}
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--erg-blue)]">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
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
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <h2 className="text-lg font-semibold text-[var(--erg-blue)]">{title}</h2>
      <button type="button" className="text-sm font-semibold text-[var(--erg-blue)]" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
}

function AssignmentScoreCard({ assignment, copy }: { assignment: StudentDashboardAssignment; copy: DashboardCopy }) {
  const bestAttempt = getBestAttempt(assignment.attempts);
  const recentAttempts = assignment.attempts.slice(0, 3);

  return (
    <article className="border-b border-slate-100 p-4 last:border-b-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={assignment.status} label={assignment.statusLabel} />
            <CompactBadge>{assignment.subjectLabel}</CompactBadge>
            <span className="text-sm text-slate-500">{assignment.dueLabel}</span>
          </div>

          <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--erg-blue)]">{assignment.title}</h2>
        </div>

        <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 md:w-[148px] md:text-right">
          <div className="text-xs font-semibold uppercase text-slate-500">{copy.bestScoreLabel}</div>
          <div className="mt-1 text-2xl font-semibold text-[var(--erg-blue)]">
            {bestAttempt ? copy.scoreBadge(bestAttempt.score, bestAttempt.maxScore) : copy.pendingScore}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
          <span>{copy.recentResultsTitle}</span>
          <span>{recentAttempts.length}/{Math.min(assignment.attempts.length, 3)}</span>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {recentAttempts.map((attempt) => (
            <AttemptResultRow key={attempt.id} attempt={attempt} copy={copy} />
          ))}
        </div>
      </div>
    </article>
  );
}

function AttemptResultRow({ attempt, copy }: { attempt: StudentAssignmentAttempt; copy: DashboardCopy }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-950">{attempt.completedAtLabel}</div>
        <div className="mt-1 text-xs text-slate-500">
          {copy.attemptDurationLabel}: {attempt.durationLabel}
        </div>
      </div>
      <div className="mt-2 text-lg font-semibold text-[var(--erg-blue)]">{copy.scoreBadge(attempt.score, attempt.maxScore)}</div>
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
    <Card className={cn("rounded-xl border bg-white shadow-none", statusMeta.cardClassName)}>
      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={assignment.status} label={assignment.statusLabel} />
              <CompactBadge>{assignment.subjectLabel}</CompactBadge>
            </div>

            <h3 className={cn("mt-2 font-semibold leading-snug text-[var(--erg-blue)]", compact ? "text-base" : "text-lg")}>{assignment.title}</h3>
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

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_112px_112px]">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase text-slate-400">{copy.progressLabel}</span>
              <span className="text-sm font-semibold text-slate-900">{assignment.progressRate}%</span>
            </div>
            <ProgressBar value={assignment.progressRate} className="mt-2 h-2.5 bg-slate-100" indicatorClassName={statusMeta.progressClassName} />
            {!compact ? <p className="mt-2 text-sm leading-6 text-slate-500">{assignment.focusNote}</p> : null}
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

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-md bg-[var(--erg-blue)] font-semibold text-white",
        size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm",
      )}
    >
      {initials}
    </span>
  );
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-3">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[var(--erg-blue)]">{value}</div>
    </div>
  );
}

function ProfileStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={cn("mt-1 text-xl font-semibold", tone === "danger" ? "text-[var(--erg-red)]" : "text-[var(--erg-blue)]")}>
        {value}
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
    <footer className="mt-8 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold text-[var(--erg-blue)]">{copy.footerTitle}</div>
          <div className="mt-1 text-sm text-slate-500">{copy.footerSubtitle}</div>
        </div>
        <div className="text-sm font-semibold text-slate-500">ERG Edurise Global</div>
      </div>
    </footer>
  );
}

function getBestAttempt(attempts: StudentAssignmentAttempt[]) {
  return attempts.reduce<StudentAssignmentAttempt | null>(
    (bestAttempt, attempt) => (!bestAttempt || attempt.score > bestAttempt.score ? attempt : bestAttempt),
    null,
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("");
}

function getThreadActivityMs(thread: StudentDiscussionThread) {
  return Math.max(thread.createdAtMs, ...thread.replies.map((reply) => reply.createdAtMs));
}

function getDiscussionThreadDomId(threadId: string) {
  return `discussion-thread-${threadId}`;
}

function getDiscussionReplyDomId(replyId: string) {
  return `discussion-reply-${replyId}`;
}

function createInitialDiscussionNotifications(
  threads: StudentDiscussionThread[],
  locale: string,
): StudentDiscussionNotification[] {
  return [...threads]
    .sort((left, right) => getThreadActivityMs(right) - getThreadActivityMs(left))
    .slice(0, 3)
    .map((thread) => {
      const latestReply = [...thread.replies].sort((left, right) => right.createdAtMs - left.createdAtMs)[0];
      const hasLatestReply = latestReply && latestReply.createdAtMs > thread.createdAtMs;

      return {
        id: `notification-${hasLatestReply ? latestReply.id : thread.id}`,
        primaryText:
          locale === "vi"
            ? hasLatestReply
              ? `${latestReply.authorName} đã trả lời bạn`
              : `${thread.authorName} đã tạo chủ đề mới`
            : hasLatestReply
              ? `${latestReply.authorName} replied to you`
              : `${thread.authorName} created a new topic`,
        secondaryText:
          locale === "vi"
            ? hasLatestReply
              ? `trong "${thread.title}"`
              : thread.title
            : hasLatestReply
              ? `in "${thread.title}"`
              : thread.title,
        replyId: hasLatestReply ? latestReply.id : undefined,
        threadId: thread.id,
        timeLabel: hasLatestReply ? latestReply.createdAtLabel : thread.createdAtLabel,
        unread: true,
      };
    });
}

function maskProfanity(value: string) {
  const maskedValue = profanityWords.reduce((currentValue, word) => {
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRegExp(word)})(?=$|[^\\p{L}\\p{N}])`, "giu");
    return currentValue.replace(pattern, "$1***");
  }, value);

  return {
    value: maskedValue,
    hasProfanity: maskedValue !== value,
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createImageAttachments(files: FileList | null) {
  const imageFiles = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));

  return Promise.all(
    imageFiles.map(
      (file, index) =>
        new Promise<StudentDiscussionImageAttachment>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `image-${Date.now()}-${index}-${file.name}`,
              type: "image",
              name: file.name,
              url: typeof reader.result === "string" ? reader.result : "",
            });
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
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
    { key: "scores", label: "Điểm bài tập", icon: <SchoolOutlinedIcon fontSize="small" /> },
    { key: "discussion", label: "Thảo luận", icon: <ForumOutlinedIcon fontSize="small" /> },
    { key: "announcements", label: "Thông báo", icon: <NotificationsNoneOutlinedIcon fontSize="small" /> },
  ],
  heroEyebrow: "Bảng học tập",
  heroTitle: (name: string) => `Chào ${name}, chọn bài cần làm hôm nay.`,
  heroDescription: (taskTitle: string) =>
    `Ưu tiên của bạn là "${taskTitle}". Màn hình này gom bài tập, tiến độ và điểm số vào từng trang rõ ràng để bạn không phải tìm lâu.`,
  primaryAction: "Làm bài ưu tiên",
  secondaryAction: "Xem bài tập",
  stats: {
    open: "Bài đang mở",
    overdue: "Bài quá hạn",
    average: "Điểm trung bình",
    completed: "Bài đã hoàn thành",
  },
  priority: {
    title: "Việc nên làm ngay",
    action: "Vào làm bài",
    detail: (dueLabel: string) => `Hạn: ${dueLabel}. Hoàn thành bài này trước để giữ nhịp học.`,
  },
  todayTitle: "Bài cần xử lý hôm nay",
  assignmentsTitle: "Bài tập",
  assignmentsDescription: "Tất cả bài được giao, trạng thái quá hạn, tiến độ hoàn thành và điểm số.",
  scoresTitle: "Điểm bài tập",
  scoresDescription: "Theo dõi điểm cao nhất và 3 kết quả gần đây của từng bài tập đã được giao.",
  bestScoreLabel: "Điểm cao nhất",
  recentResultsTitle: "Kết quả gần đây",
  noRecentResults: "Chưa có lần làm nào cho bài tập này.",
  attemptDurationLabel: "Thời gian làm bài",
  discussionTitle: "Thảo luận lớp",
  discussionDescription: "Hỏi bài và trao đổi với các bạn trong cùng lớp, giống diễn đàn lớp học.",
  discussionComposerTitle: "Đặt câu hỏi mới",
  discussionTitlePlaceholder: "Bạn đang vướng phần nào?",
  discussionBodyPlaceholder: "Viết rõ câu hỏi, cách bạn đã thử làm hoặc phần chưa hiểu...",
  discussionAttachmentAction: "Chèn ảnh",
  discussionAttachmentHint: "Có thể thêm nhiều ảnh minh họa.",
  discussionRemoveAttachment: "Bỏ ảnh",
  discussionModerationWarning: "Nội dung này có từ không phù hợp nên đã được hệ thống thay bằng ***.",
  discussionPostAction: "Đăng câu hỏi",
  discussionReplyPlaceholder: "Viết phản hồi cho chủ đề này...",
  discussionReplyAction: "Trả lời",
  discussionRepliesLabel: (count: number) => `${count} phản hồi`,
  discussionResolvedLabel: "Đã giải đáp",
  discussionRelatedLabel: "Bài liên quan",
  discussionEmptyTitle: "Chưa có thảo luận nào",
  discussionEmptyDescription: "Bạn có thể mở chủ đề đầu tiên để hỏi bài cùng lớp.",
  discussionPageLabel: (page: number, totalPages: number) => `Trang ${page}/${totalPages}`,
  discussionPreviousPage: "Trước",
  discussionNextPage: "Tiếp",
  announcementTitle: "Thông báo giáo viên",
  announcementDescription: "Tất cả thông báo từ giáo viên gửi riêng cho bạn hoặc gửi chung cho lớp.",
  announcementHeroTitle: "Chưa có thông báo mới",
  announcementHeroEmpty: "Khi giáo viên gửi thông báo, nội dung quan trọng sẽ hiển thị tại đây.",
  announcementPinnedLabel: "Quan trọng",
  notificationTitle: "Thông báo",
  notificationEmpty: "Chưa có thông báo mới.",
  notificationNewTopicLabel: "Chủ đề mới",
  notificationImageOnly: "Đã gửi ảnh",
  notificationNewThread: (authorName: string) => `${authorName} đã tạo chủ đề mới`,
  notificationNewReply: (authorName: string) => `${authorName} đã trả lời bạn`,
  notificationTopicContext: (title: string) => `trong "${title}"`,
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
    { key: "scores", label: "Assignment scores", icon: <SchoolOutlinedIcon fontSize="small" /> },
    { key: "discussion", label: "Discussion", icon: <ForumOutlinedIcon fontSize="small" /> },
    { key: "announcements", label: "Notices", icon: <NotificationsNoneOutlinedIcon fontSize="small" /> },
  ],
  heroEyebrow: "Learning board",
  heroTitle: (name: string) => `Hi ${name}, choose what to finish today.`,
  heroDescription: (taskTitle: string) =>
    `Your priority is "${taskTitle}". Assignments, progress, and scores are separated into clear pages so students can find the next action quickly.`,
  primaryAction: "Open priority task",
  secondaryAction: "View assignments",
  stats: {
    open: "Open tasks",
    overdue: "Overdue",
    average: "Average score",
    completed: "Completed tasks",
  },
  priority: {
    title: "Best next action",
    action: "Start task",
    detail: (dueLabel: string) => `Due: ${dueLabel}. Finish this first to keep your learning pace.`,
  },
  todayTitle: "Tasks to handle today",
  assignmentsTitle: "Assignments",
  assignmentsDescription: "All assigned tasks, overdue status, completion progress, and score.",
  scoresTitle: "Assignment scores",
  scoresDescription: "Review the best score and 3 most recent results for each assigned task.",
  bestScoreLabel: "Best score",
  recentResultsTitle: "Recent results",
  noRecentResults: "No attempts have been recorded for this assignment yet.",
  attemptDurationLabel: "Attempt time",
  discussionTitle: "Class discussion",
  discussionDescription: "Ask questions and exchange ideas with classmates, like a simple classroom forum.",
  discussionComposerTitle: "Start a new question",
  discussionTitlePlaceholder: "What part are you stuck on?",
  discussionBodyPlaceholder: "Write the question, what you tried, or the exact step you do not understand...",
  discussionAttachmentAction: "Add image",
  discussionAttachmentHint: "You can attach multiple reference images.",
  discussionRemoveAttachment: "Remove",
  discussionModerationWarning: "This message had inappropriate words and they were replaced with ***.",
  discussionPostAction: "Post question",
  discussionReplyPlaceholder: "Write a reply for this topic...",
  discussionReplyAction: "Reply",
  discussionRepliesLabel: (count: number) => `${count} replies`,
  discussionResolvedLabel: "Resolved",
  discussionRelatedLabel: "Related task",
  discussionEmptyTitle: "No discussions yet",
  discussionEmptyDescription: "Start the first topic to ask classmates for help.",
  discussionPageLabel: (page: number, totalPages: number) => `Page ${page}/${totalPages}`,
  discussionPreviousPage: "Previous",
  discussionNextPage: "Next",
  announcementTitle: "Teacher notices",
  announcementDescription: "All teacher notices sent directly to you or to your class.",
  announcementHeroTitle: "No new notices",
  announcementHeroEmpty: "Important teacher notices will appear here when they are posted.",
  announcementPinnedLabel: "Important",
  notificationTitle: "Notifications",
  notificationEmpty: "No new notifications.",
  notificationNewTopicLabel: "New topic",
  notificationImageOnly: "Sent an image",
  notificationNewThread: (authorName: string) => `${authorName} created a new topic`,
  notificationNewReply: (authorName: string) => `${authorName} replied to you`,
  notificationTopicContext: (title: string) => `in "${title}"`,
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
