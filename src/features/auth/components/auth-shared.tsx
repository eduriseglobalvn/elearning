import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { getPreferredLocale, tr } from "@/features/i18n";

export const inputClassName =
  "h-[58px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100";

export const submitButtonClassName =
  "inline-flex h-[56px] w-full items-center justify-center rounded-2xl bg-[var(--erg-blue)] px-5 text-lg font-semibold text-white shadow-[0_18px_40px_-24px_rgba(0,0,139,0.45)] transition hover:bg-blue-800";

export function Field({
  label,
  children,
  action,
}: {
  label: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center justify-between gap-3 text-[15px] font-medium text-slate-800">
        <span>{label}</span>
        {action}
      </span>
      {children}
    </label>
  );
}

export function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-lg font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      {icon}
      {label}
    </button>
  );
}

export function DividerText({ text }: { text: string }) {
  return (
    <div className="mt-8 flex items-center gap-4 text-base text-slate-400">
      <div className="h-px flex-1 bg-slate-200" />
      <span>{text}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
      {children}
    </span>
  );
}

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}

export function QuickLinkCard({ to, title, caption }: { to: string; title: string; caption: string }) {
  return (
    <Link
      className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
      to={to}
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-500">{caption}</div>
    </Link>
  );
}

export function formatDate(value: string | null) {
  if (!value) return tr("auth.noDateYet");

  const locale = getPreferredLocale();

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
