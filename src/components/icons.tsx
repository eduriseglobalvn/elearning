import type { ReactNode, SVGProps } from "react";

export type AppIconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

function IconBase({
  title,
  children,
  ...props
}: AppIconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="none"
      height="1em"
      role={title ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function AddIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

export function ArrowDownwardIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </IconBase>
  );
}

export function ArrowForwardIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function ArrowUpwardIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </IconBase>
  );
}

export function CheckIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconBase>
  );
}

export function ChevronLeftIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconBase>
  );
}

export function ChevronRightIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 18 6-6-6-6" />
    </IconBase>
  );
}

export function CloseIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconBase>
  );
}

export function DeleteOutlinedIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </IconBase>
  );
}

export function FolderIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
    </IconBase>
  );
}

export function GraphicEqIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 16v-4" />
      <path d="M8 18V8" />
      <path d="M12 20V5" />
      <path d="M16 18V9" />
      <path d="M20 16v-4" />
    </IconBase>
  );
}

export function LogoutIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </IconBase>
  );
}

export function MapIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </IconBase>
  );
}

export function MenuBookIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z" />
    </IconBase>
  );
}

export function MenuOpenIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h16" />
      <path d="m16 9 3 3-3 3" />
    </IconBase>
  );
}

export function MoreHorizIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="5" cy="12" fill="currentColor" r="1.4" stroke="none" />
      <circle cx="12" cy="12" fill="currentColor" r="1.4" stroke="none" />
      <circle cx="19" cy="12" fill="currentColor" r="1.4" stroke="none" />
    </IconBase>
  );
}

export function NotificationsIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </IconBase>
  );
}

export function PieChartIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12A9 9 0 1 1 12 3v9z" />
      <path d="M12 3a9 9 0 0 1 9 9h-9z" />
    </IconBase>
  );
}

export function QuizIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 5h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 2.5-2.5 2.3-2.5 4" />
      <path d="M12 16h.01" />
    </IconBase>
  );
}

export function SchoolIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="m2 9 10-5 10 5-10 5z" />
      <path d="M6 11.5V16c2 2 10 2 12 0v-4.5" />
      <path d="M22 9v6" />
    </IconBase>
  );
}

export function SettingsIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="m4.93 4.93 2.12 2.12" />
      <path d="m16.95 16.95 2.12 2.12" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="m4.93 19.07 2.12-2.12" />
      <path d="m16.95 7.05 2.12-2.12" />
    </IconBase>
  );
}

export function SmartToyIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v3" />
      <path d="M8 6h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4z" />
      <path d="M9 13h.01" />
      <path d="M15 13h.01" />
      <path d="M9 16h6" />
    </IconBase>
  );
}

export function TerminalIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="m4 17 6-5-6-5" />
      <path d="M12 19h8" />
    </IconBase>
  );
}

export function TranslateIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6h10" />
      <path d="M9 4v2" />
      <path d="M6 10c1 2 2.5 3.5 5 5" />
      <path d="M12 10c-1 2-2.5 3.5-5 5" />
      <path d="m14 21 4-9 4 9" />
      <path d="M15.5 18h5" />
    </IconBase>
  );
}

export function VerifiedIcon(props: AppIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 9.5 5.2 6.2 5l-.2 3.3L3.8 11l2.2 2.7.2 3.3 3.3-.2L12 19l2.5-2.2 3.3.2.2-3.3 2.2-2.7-2.2-2.7-.2-3.3-3.3.2z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </IconBase>
  );
}
