import { quizThemePresets } from "@/lib/quiz-themes";

export function QuizThemePicker({
  selectedThemeId,
  onSelect,
}: {
  selectedThemeId: string;
  onSelect: (themeId: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {quizThemePresets.map((preset) => {
        const selected = preset.id === selectedThemeId;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className={`rounded-[24px] border p-4 text-left transition ${
              selected
                ? "border-[rgb(0_0_139_/_0.18)] bg-[linear-gradient(180deg,#eef4ff,#ffffff)] shadow-[0_16px_34px_rgba(0,0,139,0.08)]"
                : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <div
              className="mb-4 h-24 rounded-[18px] border border-white/60 shadow-inner"
              style={{
                background: `radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 30%), ${preset.theme.headerBackground}`,
              }}
            />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900">{preset.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{preset.description}</p>
              </div>
              {selected ? (
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[var(--erg-blue)] px-2 text-xs font-black text-white">
                  Đang dùng
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.theme.accentStart }} />
              <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.theme.accentEnd }} />
              <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.theme.optionSelectedBackground }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
