import { HocLieuLink as Link } from "@/features/hoclieu/components/hoclieu-link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type HeroAction = {
  label: string;
  href: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
};

type HeroStat = {
  label: string;
  value: string;
};

export function HocLieuPageHero({
  eyebrow,
  title,
  description,
  stats,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stats: HeroStat[];
  actions?: HeroAction[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-white">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(37,59,153,0.14),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(204,0,34,0.12),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-24">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-[#00008b]/10 bg-[#00008b]/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#253b99]">
            {eyebrow}
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tighter text-slate-900 lg:text-7xl">
              {title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl">
              {description}
            </p>
          </div>
          {actions && actions.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row">
              {actions.map((action) => {
                const ActionIcon = action.icon;
                const isPrimary = action.variant !== "secondary";
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={
                      isPrimary
                        ? "inline-flex items-center justify-center gap-3 rounded-2xl bg-[#00008b] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900"
                        : "inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                    }
                  >
                    {ActionIcon ? <ActionIcon className="h-4 w-4" /> : null}
                    {action.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-slate-100 bg-white/80 p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur">
          <div className="rounded-[28px] bg-[linear-gradient(155deg,#00008b_0%,#1d4ed8_44%,#cc0022_100%)] p-7 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/70">
              Teacher Hub Snapshot
            </p>
            <div className="mt-6 grid gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HocLieuSection({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  tone?: "default" | "muted" | "dark";
}) {
  const toneClass =
    tone === "muted"
      ? "bg-[#f8fafc]"
      : tone === "dark"
        ? "bg-slate-900 text-white"
        : "bg-white";

  return (
    <section className={`${toneClass} py-20 lg:py-24`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <p className={`text-[10px] font-black uppercase tracking-[0.32em] ${tone === "dark" ? "text-white/60" : "text-[#cc0022]"}`}>
            {eyebrow}
          </p>
          <h2 className={`text-4xl font-black tracking-tighter lg:text-5xl ${tone === "dark" ? "text-white" : "text-slate-900"}`}>
            {title}
          </h2>
          <p className={`text-lg leading-8 ${tone === "dark" ? "text-white/70" : "text-slate-500"}`}>
            {description}
          </p>
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function HocLieuCardGrid({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
    meta?: string;
    href?: string;
    tags?: string[];
  }>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/40">
          {item.meta ? (
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{item.meta}</p>
          ) : null}
          <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">{item.description}</p>
          {item.tags && item.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {item.href ? (
            <Link
              href={item.href}
              className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#00008b] transition-all hover:gap-3"
            >
              Má»Ÿ chi tiáº¿t
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function HocLieuTimeline({
  items,
}: {
  items: Array<{ title: string; detail: string; meta?: string }>;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={item.title} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/30">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-black text-[#00008b]/15">{String(index + 1).padStart(2, "0")}</span>
            {item.meta ? (
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {item.meta}
              </span>
            ) : null}
          </div>
          <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
