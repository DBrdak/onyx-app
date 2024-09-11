import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import LoadingButton from "@/components/LoadingButton";

import { JoinBudgetParamsSchema } from "@/lib/validation/searchParams";
import { getBudgetsQueryOptions, joinBudget } from "@/lib/api/budget";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export const Route = createFileRoute("/_dashboard-layout/budgets/join")({
  component: Invitation,
  validateSearch: JoinBudgetParamsSchema,
});

function Invitation() {
  const { token } = Route.useSearch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: () => joinBudget(token),
    onSettled: async () => {
      await queryClient.invalidateQueries(getBudgetsQueryOptions);
    },
    onSuccess: async () => {
      await navigate({ to: "/budget" });
    },
    onError: (err) => {
      const message = getErrorMessage(err);
      console.log(message);
      return toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    retry: 0,
  });

  return (
    <div className="pt-8">
      <h1 className="text-center text-3xl font-bold md:text-4xl lg:text-5xl">
        Join the budget!
      </h1>
      <div className="mx-auto max-w-lg pt-16">
        <p>
          Click the button below to accept the invitation or return to the
          homepage.
        </p>
        <div className="flex  flex-col space-y-4 pt-20 md:flex-row md:space-x-4 md:space-y-0">
          <LoadingButton
            isLoading={isPending}
            onClick={() => mutate()}
            className="w-full"
          >
            Join budget
          </LoadingButton>
          <Button asChild>
            <Link className="w-full" to="/">
              Home page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
