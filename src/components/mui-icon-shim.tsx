import type { ReactNode, SVGProps } from "react";

type MuiIconShimProps = SVGProps<SVGSVGElement> & {
  fontSize?: "inherit" | "small" | "medium" | "large" | string;
  title?: string;
};

export function createMuiIconShim(displayName: string) {
  function MuiIconShim(props: MuiIconShimProps) {
    return <IconGlyph displayName={displayName} {...props} />;
  }

  MuiIconShim.displayName = `${displayName}Shim`;
  return MuiIconShim;
}

function IconSvg({
  title,
  children,
  ...props
}: MuiIconShimProps & { children: ReactNode }) {
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

function IconGlyph({
  displayName,
  ...props
}: MuiIconShimProps & { displayName: string }) {
  const name = displayName.toLowerCase();

  if (name.includes("add") || name.includes("plus")) {
    return (
      <IconSvg {...props}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </IconSvg>
    );
  }

  if (name.includes("remove") || name.includes("horizontalrule")) {
    return (
      <IconSvg {...props}>
        <path d="M5 12h14" />
      </IconSvg>
    );
  }

  if (name.includes("close") || name.includes("highlightoff")) {
    return (
      <IconSvg {...props}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </IconSvg>
    );
  }

  if (name.includes("check") || name.includes("verified")) {
    return (
      <IconSvg {...props}>
        <path d="m5 12 4 4L19 6" />
      </IconSvg>
    );
  }

  if (name.includes("chevronleft") || name.includes("arrowback")) {
    return (
      <IconSvg {...props}>
        <path d="m15 18-6-6 6-6" />
      </IconSvg>
    );
  }

  if (name.includes("chevronright") || name.includes("arrowforward")) {
    return (
      <IconSvg {...props}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </IconSvg>
    );
  }

  if (name.includes("arrowup")) {
    return (
      <IconSvg {...props}>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </IconSvg>
    );
  }

  if (name.includes("arrowdown") || name.includes("expand") || name.includes("drop")) {
    return (
      <IconSvg {...props}>
        <path d="m6 9 6 6 6-6" />
      </IconSvg>
    );
  }

  if (name.includes("search")) {
    return (
      <IconSvg {...props}>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </IconSvg>
    );
  }

  if (name.includes("delete")) {
    return (
      <IconSvg {...props}>
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </IconSvg>
    );
  }

  if (name.includes("copy") || name.includes("contentpaste")) {
    return (
      <IconSvg {...props}>
        <rect height="12" rx="2" width="10" x="8" y="8" />
        <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </IconSvg>
    );
  }

  if (name.includes("contentcut")) {
    return (
      <IconSvg {...props}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <path d="M8 8 20 20" />
        <path d="M20 4 8 16" />
      </IconSvg>
    );
  }

  if (name.includes("upload") || name.includes("publish")) {
    return (
      <IconSvg {...props}>
        <path d="M12 16V4" />
        <path d="m6 10 6-6 6 6" />
        <path d="M4 20h16" />
      </IconSvg>
    );
  }

  if (name.includes("download")) {
    return (
      <IconSvg {...props}>
        <path d="M12 4v12" />
        <path d="m6 10 6 6 6-6" />
        <path d="M4 20h16" />
      </IconSvg>
    );
  }

  if (name.includes("home")) {
    return (
      <IconSvg {...props}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </IconSvg>
    );
  }

  if (name.includes("account") || name.includes("group")) {
    return (
      <IconSvg {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </IconSvg>
    );
  }

  if (name.includes("login")) {
    return (
      <IconSvg {...props}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18" />
      </IconSvg>
    );
  }

  if (name.includes("logout")) {
    return (
      <IconSvg {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </IconSvg>
    );
  }

  if (name.includes("setting") || name.includes("tune") || name.includes("palette")) {
    return (
      <IconSvg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="m4.9 4.9 2.1 2.1" />
        <path d="m17 17 2.1 2.1" />
      </IconSvg>
    );
  }

  if (name.includes("school") || name.includes("workspacepremium")) {
    return (
      <IconSvg {...props}>
        <path d="m2 9 10-5 10 5-10 5z" />
        <path d="M6 11.5V16c2 2 10 2 12 0v-4.5" />
        <path d="M22 9v6" />
      </IconSvg>
    );
  }

  if (name.includes("book") || name.includes("spellcheck")) {
    return (
      <IconSvg {...props}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z" />
      </IconSvg>
    );
  }

  if (name.includes("assignment") || name.includes("fact") || name.includes("rule") || name.includes("checklist")) {
    return (
      <IconSvg {...props}>
        <rect height="16" rx="2" width="14" x="5" y="4" />
        <path d="m9 12 2 2 4-5" />
        <path d="M9 17h6" />
      </IconSvg>
    );
  }

  if (
    name.includes("chart") ||
    name.includes("analytics") ||
    name.includes("autograph") ||
    name.includes("insight") ||
    name.includes("timeline") ||
    name.includes("trending")
  ) {
    return (
      <IconSvg {...props}>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19H2" />
      </IconSvg>
    );
  }

  if (name.includes("route") || name.includes("map")) {
    return (
      <IconSvg {...props}>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 0-6h2a3 3 0 0 0 3-3V8" />
      </IconSvg>
    );
  }

  if (name.includes("image") || name.includes("photo")) {
    return (
      <IconSvg {...props}>
        <rect height="14" rx="2" width="18" x="3" y="5" />
        <circle cx="8" cy="10" r="1.5" />
        <path d="m21 16-5-5L5 22" />
      </IconSvg>
    );
  }

  if (name.includes("video") || name.includes("play") || name.includes("preview") || name.includes("visibility") || name.includes("slideshow")) {
    return (
      <IconSvg {...props}>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
        <path d="m10 9 5 3-5 3z" />
      </IconSvg>
    );
  }

  if (name.includes("star") || name.includes("event") || name.includes("military") || name.includes("emoji")) {
    return (
      <IconSvg {...props}>
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" />
      </IconSvg>
    );
  }

  if (name.includes("warning")) {
    return (
      <IconSvg {...props}>
        <path d="M12 3 2 21h20z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </IconSvg>
    );
  }

  if (name.includes("notification") || name.includes("bell")) {
    return (
      <IconSvg {...props}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </IconSvg>
    );
  }

  if (name.includes("lock")) {
    return (
      <IconSvg {...props}>
        <rect height="11" rx="2" width="16" x="4" y="10" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </IconSvg>
    );
  }

  if (name.includes("table")) {
    return (
      <IconSvg {...props}>
        <rect height="16" rx="2" width="18" x="3" y="4" />
        <path d="M3 10h18" />
        <path d="M3 15h18" />
      </IconSvg>
    );
  }

  if (name.includes("format") || name.includes("text") || name.includes("subscript") || name.includes("superscript")) {
    return (
      <IconSvg {...props}>
        <path d="M4 6h16" />
        <path d="M12 6v12" />
        <path d="M8 18h8" />
      </IconSvg>
    );
  }

  if (name.includes("audio")) {
    return (
      <IconSvg {...props}>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </IconSvg>
    );
  }

  return (
    <IconSvg {...props}>
      <rect height="16" rx="3" width="16" x="4" y="4" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </IconSvg>
  );
}
