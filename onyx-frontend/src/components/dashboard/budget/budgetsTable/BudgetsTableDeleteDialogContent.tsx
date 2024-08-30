import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { RequiredString } from "@/lib/validation/base";
import { type Budget } from "@/lib/validation/budget";
import { deleteBudget, getBudgetsQueryOptions } from "@/lib/api/budget";

interface BudgetsTableDeleteDialogContentProps {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  budget: Budget;
}

const BudgetsTableDeleteDialogContent: FC<
  BudgetsTableDeleteDialogContentProps
> = ({ setDialogOpen, budget }) => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(
      z.object({
        name: RequiredString.refine(
          (val) => val === budget.name,
          "Incorrect budget name.",
        ),
      }),
    ),
  });

  const nameInputValue = form.watch("name");

  const { mutate: performDelete, isError: isDeleteError } = useMutation({
    mutationKey: ["deleteBudget", budget.id],
    mutationFn: deleteBudget,
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: getBudgetsQueryOptions.queryKey,
      });
    },
    onError: () => {
      setDialogOpen(true);
    },
  });

  const onSubmit = () => {
    performDelete(budget.id);
    setDialogOpen(false);
  };

  useEffect(() => {
    if (isDeleteError) {
      form.setError("name", {
        message: "Something went wrong, please try again.",
      });
    }
  }, [isDeleteError, form]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Deleting this budget will permanently
          remove all associated data.
        </DialogDescription>
      </DialogHeader>

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
                    {...field}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Budget name..."
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>Enter budget name to delete.</FormDescription>
              </FormItem>
            )}
          />
          <Button
            disabled={nameInputValue !== budget.name}
            variant="destructive"
            type="submit"
            className="w-full md:w-auto"
          >
            Delete
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default BudgetsTableDeleteDialogContent;
