import { HashRouter, BrowserRouter } from "react-router-dom";

import { I18nProvider } from "@/features/i18n";
import { shouldUseHashRouter } from "@/lib/platform";
import { AppRoutes } from "@/routes/app-routes";

export default function App() {
  const Router = shouldUseHashRouter() ? HashRouter : BrowserRouter;

  return (
    <I18nProvider>
      <Router>
        <AppRoutes />
      </Router>
    </I18nProvider>
  );
}
