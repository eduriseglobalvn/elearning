import { useI18n } from "@/features/i18n";
import type { QuizEditorSlide } from "@/features/quiz-editor/types/quiz-editor-types";
import {
  AudioTextField,
  FieldLabel,
  FormViewSection,
} from "@/features/quiz-editor/components/form-view/authoring-frame";
import { InstructionDescriptionPanel } from "@/features/quiz-editor/components/form-view/instruction-description-panel";
import { MediaAttachmentPanel } from "@/features/quiz-editor/components/form-view/media-attachment-panel";

export function InstructionSlideForm({
  slide,
  onUpdateTitle,
  onUpdateInstructions,
  onPickMedia,
  onRemoveMedia,
  onUpdateMediaAlt,
}: {
  slide: QuizEditorSlide;
  onUpdateTitle: (value: string) => void;
  onUpdateInstructions: (items: string[]) => void;
  onPickMedia: () => void;
  onRemoveMedia: () => void;
  onUpdateMediaAlt: (value: string) => void;
}) {
  const { t } = useI18n();

  return (
    <FormViewSection title={t("quiz.quizInstructions")}>
      <FieldLabel label={t("common.title")} />
      <AudioTextField value={slide.title} onChange={onUpdateTitle} slide={slide} />

      <MediaAttachmentPanel
        media={slide.media}
        onPickMedia={onPickMedia}
        onRemoveMedia={onRemoveMedia}
        onChangeAlt={onUpdateMediaAlt}
      />

      <FieldLabel label={t("common.description")} />
      <InstructionDescriptionPanel slide={slide} onChange={onUpdateInstructions} />
    </FormViewSection>
  );
}
