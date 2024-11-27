import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout/counterparties",
)({
  component: () => (
    <div>
      Hello
      /_dashboard-layout/budget/$budgetSlug/statistics/_statistics-layout/counterparties!
    </div>
  ),
});
