import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center p-4 sm:p-6 lg:p-8">
      <section className="relative w-full max-w-5xl overflow-hidden rounded-[36px] border border-slate-200/80 bg-white p-6 shadow-[var(--erg-shadow-lg)] sm:p-8 lg:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--erg-blue)] via-blue-500 to-[var(--erg-red)]" />
        <p className="inline-flex items-center gap-2 rounded-full bg-[rgb(0_0_139_/_0.05)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--erg-blue)]">
          Giao diện trung tâm giáo viên
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] text-slate-900 sm:text-5xl lg:text-6xl">
          ERG E-Learning FE
          <span className="block text-[var(--erg-blue)]">phong cách giao diện đồng bộ với hệ ERG</span>
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
          Bản này đã được tách sang React thuần để sau này mở rộng sang desktop app bằng Tauri dễ dàng hơn, không phụ
          thuộc Next.js.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            className="inline-flex min-h-13 items-center justify-center rounded-full bg-[var(--erg-blue)] px-6 text-sm font-black text-white shadow-[0_18px_40px_rgba(0,0,139,0.2)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            to="/student"
          >
            Mở màn hình học sinh
          </Link>
          <Link
            className="inline-flex min-h-13 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:border-[var(--erg-red)] hover:text-[var(--erg-red)]"
            to="/dashboard"
          >
            Mở dashboard giáo viên
          </Link>
        </div>
      </section>
    </main>
  );
}
