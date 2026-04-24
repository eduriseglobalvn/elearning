import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}
