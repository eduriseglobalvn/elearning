import {
  AssessmentControlWorkspace,
  ClassReportsWorkspace,
  ClassroomTrackingWorkspace,
  ClassStudentsWorkspace,
  OverviewWorkspace,
  StudentJourneyWorkspace,
} from "@/features/classroom";
import { DashboardPlaceholderWorkspace } from "@/features/dashboard/components/dashboard-placeholder-workspace";
import { QuizEditorWorkspace } from "@/features/dashboard/components/quiz-editor-workspace";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";
import { QuestionBankWorkspace } from "@/features/question-bank";
import type { QuestionBankQuestion } from "@/features/question-bank/types/question-bank-types";

export function DashboardContent({
  activeLeaf,
  onOpenLeaf,
  pendingQuestionImports,
  onQuestionImportsHandled,
  onCreateQuizFromBank,
}: {
  activeLeaf: DashboardLeaf;
  onOpenLeaf: (leafId: string) => void;
  pendingQuestionImports: QuestionBankQuestion[];
  onQuestionImportsHandled: () => void;
  onCreateQuizFromBank: (questions: QuestionBankQuestion[]) => void;
}) {
  if (activeLeaf.variant === "quiz-editor") {
    return (
      <div className="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden bg-background pl-1">
        <QuizEditorWorkspace
          activeLeaf={activeLeaf}
          pendingImportedQuestions={pendingQuestionImports}
          onImportedQuestionsHandled={onQuestionImportsHandled}
        />
      </div>
    );
  }

  if (activeLeaf.variant === "overview") {
    return <OverviewWorkspace activeLeaf={activeLeaf} mode="center" onOpenLeaf={onOpenLeaf} />;
  }

  if (activeLeaf.variant === "school-pulse") {
    return <OverviewWorkspace activeLeaf={activeLeaf} mode="school" onOpenLeaf={onOpenLeaf} />;
  }

  if (activeLeaf.variant === "question-bank") {
    return <QuestionBankWorkspace activeLeaf={activeLeaf} onCreateQuiz={onCreateQuizFromBank} />;
  }

  if (activeLeaf.variant === "classroom-tracking") {
    return <ClassroomTrackingWorkspace activeLeaf={activeLeaf} onOpenLeaf={onOpenLeaf} />;
  }

  if (activeLeaf.variant === "assessment-control") {
    return <AssessmentControlWorkspace activeLeaf={activeLeaf} onOpenLeaf={onOpenLeaf} />;
  }

  if (activeLeaf.variant === "class-students") {
    return <ClassStudentsWorkspace activeLeaf={activeLeaf} onOpenLeaf={onOpenLeaf} />;
  }

  if (activeLeaf.variant === "class-reports") {
    return <ClassReportsWorkspace activeLeaf={activeLeaf} onOpenLeaf={onOpenLeaf} />;
  }

  if (activeLeaf.variant === "student-journey") {
    return <StudentJourneyWorkspace activeLeaf={activeLeaf} onOpenLeaf={onOpenLeaf} />;
  }

  return <DashboardPlaceholderWorkspace activeLeaf={activeLeaf} onOpenLeaf={onOpenLeaf} />;
}
