import { createLazyFileRoute, Outlet } from "@tanstack/react-router";

import StatisticsDateNavbar from "@/components/dashboard/statistics/statisticsDateNavbar/StatisticsDateNavbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout",
)({
  component: Statistics,
});

function Statistics() {
  return (
    <div className="flex h-full flex-col space-y-8 overflow-y-hidden">
      <StatisticsDateNavbar />
      <ScrollArea className="mb-2 h-full pb-8 lg:px-4">
        <Outlet />
      </ScrollArea>
    </div>
  );
}
