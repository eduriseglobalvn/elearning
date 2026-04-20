import { PlayerShell } from "@/components/quiz/player-shell";

export function StudentPage() {
  return (
    <main className="min-h-screen bg-[#dcdee0] p-3 sm:p-4 lg:p-6 xl:p-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <PlayerShell />
      </div>
    </main>
  );
}
