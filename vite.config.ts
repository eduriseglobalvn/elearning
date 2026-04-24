import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function localMuiIconShim(): Plugin {
  const iconPrefix = "\0local-mui-icon:";

  return {
    name: "local-mui-icon-shim",
    enforce: "pre",
    resolveId(id) {
      if (id.startsWith("@mui/icons-material/")) {
        return `${iconPrefix}${id.slice("@mui/icons-material/".length)}`;
      }

      return null;
    },
    load(id) {
      if (!id.startsWith(iconPrefix)) {
        return null;
      }

      const displayName = id.slice(iconPrefix.length);

      // Keep legacy MUI icon import paths working without installing the heavy MUI packages.
      return [
        'import { createMuiIconShim } from "/src/components/mui-icon-shim.tsx";',
        `export default createMuiIconShim(${JSON.stringify(displayName)});`,
      ].join("\n");
    },
  };
}

export default defineConfig({
  plugins: [localMuiIconShim(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
  },
  preview: {
    port: 4173,
  },
});
