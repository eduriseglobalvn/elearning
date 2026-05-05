import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { RootLayout } from "@/layouts/root-layout";

const DashboardPage = lazy(() =>
  import("@/pages/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  })),
);
const HomePage = lazy(() =>
  import("@/pages/home-page").then((module) => ({
    default: module.HomePage,
  })),
);
const StudentPage = lazy(() =>
  import("@/pages/student-page").then((module) => ({
    default: module.StudentPage,
  })),
);
const QuestionTypeDemoPage = lazy(() =>
  import("@/pages/question-type-demo-page").then((module) => ({
    default: module.QuestionTypeDemoPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found-page").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const HocLieuLayout = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuLayout,
  })),
);
const HocLieuHomePage = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuHomePage,
  })),
);
const HocLieuProgramsPage = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuProgramsPage,
  })),
);
const HocLieuProgramDetailPage = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuProgramDetailPage,
  })),
);
const HocLieuLibraryPage = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuLibraryPage,
  })),
);
const HocLieuCommunityPage = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuCommunityPage,
  })),
);
const HocLieuPortfolioPage = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuPortfolioPage,
  })),
);
const HocLieuQuizzesPage = lazy(() =>
  import("@/features/hoclieu").then((module) => ({
    default: module.HocLieuQuizzesPage,
  })),
);

function isHocLieuPortalHost() {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname.toLowerCase();
  return hostname.startsWith("hoclieu.");
}

function HocLieuRouteGroup({ includeIndex = false }: { includeIndex?: boolean } = {}) {
  return (
    <Route element={<HocLieuLayout />}>
      {includeIndex ? <Route index element={<HocLieuHomePage />} /> : null}
      <Route path="hoclieu" element={<HocLieuHomePage />} />
      <Route path="chuong-trinh" element={<HocLieuProgramsPage />} />
      <Route path="chuong-trinh/:slug" element={<HocLieuProgramDetailPage />} />
      <Route path="kho-hoc-lieu" element={<HocLieuLibraryPage />} />
      <Route path="cong-dong" element={<HocLieuCommunityPage />} />
      <Route path="portfolio" element={<HocLieuPortfolioPage />} />
      <Route path="quizzes" element={<HocLieuQuizzesPage />} />
    </Route>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[var(--erg-bg)] px-6">
      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--erg-blue)]" />
      </div>
    </div>
  );
}

export function AppRoutes() {
  const isHocLieuPortal = isHocLieuPortalHost();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          {isHocLieuPortal ? (
            <>{HocLieuRouteGroup({ includeIndex: true })}</>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/student" element={<StudentPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/question-types" element={<QuestionTypeDemoPage />} />
              {HocLieuRouteGroup()}
            </>
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
