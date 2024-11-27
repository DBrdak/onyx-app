import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout/accounts",
)({
  component: () => (
    <div>
      Hello
      /_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout/accounts!
    </div>
  ),
});
