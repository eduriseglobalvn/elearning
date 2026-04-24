import { useI18n } from "@/features/i18n";
import type {
  QuizEditorSlide,
  QuizEditorSlideOptions,
} from "@/features/quiz-editor/types/quiz-editor-types";

export function InstructionOptionsSection({
  slide,
  onUpdateOptions,
}: {
  slide: QuizEditorSlide;
  onUpdateOptions: (patch: Partial<QuizEditorSlideOptions>) => void;
}) {
  const { t } = useI18n();

  return (
    <>
      <div className="classic-editor__options-title">{t("quiz.questionSettings")}</div>
      <div className="classic-editor__options-divider" />
      <div className="classic-editor__checkbox-list">
        <label>
          <input
            type="checkbox"
            checked={slide.options?.displayQuizInstructions ?? true}
            onChange={(event) =>
              onUpdateOptions({ displayQuizInstructions: event.target.checked })
            }
          />{" "}
          {t("quiz.displayQuizInstructions")}
        </label>
      </div>
    </>
  );
}
