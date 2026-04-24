import { useI18n } from "@/features/i18n";
import type { QuizEditorSlide } from "@/features/quiz-editor/types/quiz-editor-types";
import {
  FieldLabel,
  FormViewSection,
  SlideTitleToolbar,
} from "@/features/quiz-editor/components/form-view/authoring-frame";
import { DragDropMatchTable } from "@/features/quiz-editor/components/form-view/drag-drop-match-table";
import { FeedbackBranchingTable } from "@/features/quiz-editor/components/form-view/feedback-branching-table";
import { MediaAttachmentPanel } from "@/features/quiz-editor/components/form-view/media-attachment-panel";
import type {
  QuizEditorDragDropItem,
  QuizEditorFeedbackRow,
} from "@/features/quiz-editor/types/quiz-editor-types";

export function DragDropQuestionForm({
  slide,
  onUpdateTitle,
  onUpdateItems,
  onUpdateFeedbackRows,
  onPickMedia,
  onRemoveMedia,
  onUpdateMediaAlt,
}: {
  slide: QuizEditorSlide;
  onUpdateTitle: (value: string) => void;
  onUpdateItems: (items: QuizEditorDragDropItem[]) => void;
  onUpdateFeedbackRows: (rows: QuizEditorFeedbackRow[]) => void;
  onPickMedia: () => void;
  onRemoveMedia: () => void;
  onUpdateMediaAlt: (value: string) => void;
}) {
  const { t } = useI18n();

  return (
    <FormViewSection title={t("quiz.dragDropQuestion")}>
      <SlideTitleToolbar slide={slide} value={slide.title} onChange={onUpdateTitle} />

      <MediaAttachmentPanel
        media={slide.media}
        onPickMedia={onPickMedia}
        onRemoveMedia={onRemoveMedia}
        onChangeAlt={onUpdateMediaAlt}
      />

      <FieldLabel label={t("common.correctMatches")} />
      <DragDropMatchTable items={slide.dragDropItems ?? []} onChange={onUpdateItems} />

      <FieldLabel label={t("common.feedbackAndBranching")} />
      <FeedbackBranchingTable rows={slide.feedbackRows ?? []} onChange={onUpdateFeedbackRows} />
    </FormViewSection>
  );
}
