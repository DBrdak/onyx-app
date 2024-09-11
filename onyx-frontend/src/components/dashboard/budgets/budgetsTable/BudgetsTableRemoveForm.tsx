import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";

import { RequiredString } from "@/lib/validation/base";
import { BudgetMember } from "@/lib/validation/user";
import { getBudgetsQueryOptions, removeBudgetMember } from "@/lib/api/budget";

interface BudgetsTableRemoveFormProps {
  member: BudgetMember | null;
  budgetId: string;
  setSelectedMember: Dispatch<SetStateAction<BudgetMember | null>>;
}

const BudgetsTableRemoveForm: FC<BudgetsTableRemoveFormProps> = ({
  member,
  budgetId,
  setSelectedMember,
}) => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(
      z.object({
        name: RequiredString.refine(
          (val) => val === member?.username,
          "Incorrect member name.",
        ),
      }),
    ),
  });

  const nameInputValue = form.watch("name");

  const {
    mutate: performRemove,
    isError: isDeleteError,
    isPending,
  } = useMutation({
    mutationKey: ["removeMember", member?.id],
    mutationFn: removeBudgetMember,
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: getBudgetsQueryOptions.queryKey,
      });
    },
    onError: (err) => {
      console.error("Deleting budget error", err);
    },
    onSuccess: () => {
      setSelectedMember(null);
    },
  });

  const onSubmit = () => {
    if (member) {
      performRemove({
        budgetId: budgetId,
        memberId: member.id,
      });
    }
  };

  useEffect(() => {
    if (isDeleteError) {
      form.setError("name", {
        message: "Something went wrong, please try again.",
      });
    }
  }, [isDeleteError, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pb-2 pt-4 md:flex md:space-x-4 md:space-y-0"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  disabled={!member}
                  {...field}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Member name..."
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={isPending}
          disabled={nameInputValue !== member?.username || !member || isPending}
          variant="destructive"
          type="submit"
          className="w-full md:w-auto"
        >
          Remove
        </LoadingButton>
      </form>
    </Form>
  );
};

export default BudgetsTableRemoveForm;
