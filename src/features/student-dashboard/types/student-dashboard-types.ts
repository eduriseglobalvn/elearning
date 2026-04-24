export type StudentAssignmentStatus = "not_started" | "in_progress" | "submitted" | "overdue";

export type StudentDashboardProfile = {
  id: string;
  name: string;
  className: string;
  gradeLabel: string;
  schoolName: string;
  homeroomTeacher: string;
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  classRank: number;
  gradeRank: number;
  motivationPoints: number;
  weeklyGoalProgress: number;
};

export type StudentDashboardAssignment = {
  id: string;
  quizId: string;
  title: string;
  subtitle: string;
  subjectLabel: string;
  teacherName: string;
  status: StudentAssignmentStatus;
  progressRate: number;
  answeredCount: number;
  totalQuestions: number;
  score: number | null;
  maxScore: number;
  dueLabel: string;
  statusLabel: string;
  lastActivityLabel: string;
  focusNote: string;
};

export type StudentLeaderboardEntry = {
  id: string;
  name: string;
  schoolName: string;
  className: string;
  averageScore: number;
  completedAssignments: number;
  motivationPoints: number;
  badge: string;
  isCurrentStudent?: boolean;
};
