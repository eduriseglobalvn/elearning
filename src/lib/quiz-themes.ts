import type { CSSProperties } from "react";

import type { Theme } from "@/lib/types";

export type QuizThemePreset = {
  id: string;
  name: string;
  description: string;
  theme: Theme;
};

export const quizThemePresets: QuizThemePreset[] = [
  {
    id: "erg-classic",
    name: "ERG Cổ điển",
    description: "Tông xanh navy, đỏ và bề mặt sáng lấy cảm hứng từ hệ thống ERG.",
    theme: {
      pageBackground: "#f8fafc",
      playerBackground: "#ffffff",
      canvasBorder: "#dbe5f1",
      headerBackground: "linear-gradient(135deg, #00008b 0%, #1d4ed8 100%)",
      headerText: "#ffffff",
      accentStart: "#00008b",
      accentEnd: "#cc0022",
      optionText: "#214f88",
      optionSelectedBackground: "#eaf1ff",
      inputBackground: "#ffffff",
      sidebarActiveBackground: "linear-gradient(135deg, #00008b 0%, #1d4ed8 100%)",
      sidebarActiveText: "#ffffff",
    },
  },
  {
    id: "sky-lab",
    name: "Phòng học xanh",
    description: "Tông xanh học thuật với control sáng hơn và độ thoáng cao.",
    theme: {
      pageBackground: "#eff6ff",
      playerBackground: "#ffffff",
      canvasBorder: "#c7d8ea",
      headerBackground: "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)",
      headerText: "#ffffff",
      accentStart: "#2563eb",
      accentEnd: "#0f766e",
      optionText: "#1d4d8d",
      optionSelectedBackground: "#e0edff",
      inputBackground: "#ffffff",
      sidebarActiveBackground: "linear-gradient(135deg, #2563eb 0%, #0f766e 100%)",
      sidebarActiveText: "#ffffff",
    },
  },
  {
    id: "sunset-focus",
    name: "Hoàng hôn tập trung",
    description: "Điểm nhấn cam san hô ấm để trải nghiệm làm bài năng động hơn.",
    theme: {
      pageBackground: "#fff7ed",
      playerBackground: "#ffffff",
      canvasBorder: "#fed7aa",
      headerBackground: "linear-gradient(135deg, #9a3412 0%, #ea580c 100%)",
      headerText: "#fff7ed",
      accentStart: "#ea580c",
      accentEnd: "#c2410c",
      optionText: "#9a3412",
      optionSelectedBackground: "#ffedd5",
      inputBackground: "#ffffff",
      sidebarActiveBackground: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
      sidebarActiveText: "#fff7ed",
    },
  },
  {
    id: "forest-class",
    name: "Lớp học rừng xanh",
    description: "Tông xanh lá nhẹ, hợp với các bài học cần cảm giác điềm tĩnh và tập trung.",
    theme: {
      pageBackground: "#f0fdf4",
      playerBackground: "#ffffff",
      canvasBorder: "#bbf7d0",
      headerBackground: "linear-gradient(135deg, #166534 0%, #16a34a 100%)",
      headerText: "#f0fdf4",
      accentStart: "#166534",
      accentEnd: "#16a34a",
      optionText: "#166534",
      optionSelectedBackground: "#dcfce7",
      inputBackground: "#ffffff",
      sidebarActiveBackground: "linear-gradient(135deg, #166534 0%, #16a34a 100%)",
      sidebarActiveText: "#f0fdf4",
    },
  },
  {
    id: "midnight-classic",
    name: "Đêm học tập",
    description: "Tông xanh đậm và vàng nhạt cho cảm giác học tập trang trọng hơn.",
    theme: {
      pageBackground: "#f8fafc",
      playerBackground: "#ffffff",
      canvasBorder: "#cbd5e1",
      headerBackground: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
      headerText: "#f8fafc",
      accentStart: "#0f172a",
      accentEnd: "#ca8a04",
      optionText: "#1e293b",
      optionSelectedBackground: "#fef3c7",
      inputBackground: "#ffffff",
      sidebarActiveBackground: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
      sidebarActiveText: "#f8fafc",
    },
  },
];

export const defaultQuizTheme = quizThemePresets[0];

export function getQuizThemePreset(themeId?: string) {
  return quizThemePresets.find((preset) => preset.id === themeId) ?? defaultQuizTheme;
}

export function resolveQuizTheme(themeId?: string, themeOverride?: Partial<Theme> | null): Theme {
  return {
    ...getQuizThemePreset(themeId).theme,
    ...(themeOverride ?? {}),
  };
}

export function getQuizThemeStyle(theme: Theme): CSSProperties {
  return {
    ["--quiz-page-bg" as string]: theme.pageBackground,
    ["--quiz-player-bg" as string]: theme.playerBackground,
    ["--quiz-canvas-border" as string]: theme.canvasBorder,
    ["--quiz-header-bg" as string]: theme.headerBackground,
    ["--quiz-header-text" as string]: theme.headerText,
    ["--quiz-accent-start" as string]: theme.accentStart,
    ["--quiz-accent-end" as string]: theme.accentEnd,
    ["--quiz-option-text" as string]: theme.optionText,
    ["--quiz-option-selected-bg" as string]: theme.optionSelectedBackground,
    ["--quiz-input-bg" as string]: theme.inputBackground,
    ["--quiz-sidebar-active-bg" as string]: theme.sidebarActiveBackground,
    ["--quiz-sidebar-active-text" as string]: theme.sidebarActiveText,
  } as CSSProperties;
}
