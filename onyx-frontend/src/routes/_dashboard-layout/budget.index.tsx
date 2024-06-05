import { createFileRoute } from "@tanstack/react-router";

import RouteLoadingError from "@/components/RouteLoadingError";
import { getBudgetsQueryOptions } from "@/lib/api/budget";

export const Route = createFileRoute("/_dashboard-layout/budget/")({
  component: Budget,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getBudgetsQueryOptions),
  errorComponent: ({ reset }) => <RouteLoadingError reset={reset} />,
});

function Budget() {
  const loaderData = Route.useLoaderData();

  console.log(loaderData);

  return <div>budgets</div>;
}
