import { Badge, Card, CardContent } from "@/components/ui/dashboard-kit";
import { quizThemePresets } from "@/lib/quiz-themes";
import { cn } from "@/lib/utils";

export function QuizThemePicker({
  selectedThemeId,
  onSelect,
}: {
  selectedThemeId: string;
  onSelect: (themeId: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {quizThemePresets.map((preset) => {
        const selected = preset.id === selectedThemeId;

        return (
          <button key={preset.id} type="button" onClick={() => onSelect(preset.id)} className="text-left">
            <Card
              className={cn(
                "h-full overflow-hidden transition duration-200",
                selected
                  ? "border-slate-900 shadow-[0_24px_54px_-34px_rgba(15,23,42,0.5)]"
                  : "hover:-translate-y-0.5 hover:border-slate-300",
              )}
            >
              <div
                className="h-28 border-b border-white/40"
                style={{
                  background: `radial-gradient(circle at top left, rgba(255,255,255,0.32), transparent 34%), ${preset.theme.headerBackground}`,
                }}
              />
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-900">{preset.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{preset.description}</p>
                  </div>
                  {selected ? <Badge tone="primary">Đang dùng</Badge> : <Badge tone="outline">Preset</Badge>}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.theme.accentStart }}
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.theme.accentEnd }}
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.theme.optionSelectedBackground }}
                  />
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
