import { resetAllDashboardStores } from "@/store/dashboard/resetPersistedDashboardStores";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard-layout/help")({
  beforeLoad: () => {
    resetAllDashboardStores();
  },
  component: () => <div>Hello /_dashboard-layout/help!</div>,
});
