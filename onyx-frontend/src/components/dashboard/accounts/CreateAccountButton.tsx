import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import AmountInput from "@/components/dashboard/AmountInput";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CreateAccountSchema,
  TCreateAccountForm,
} from "@/lib/validation/account";
import { useCreateAccountMutation } from "@/lib/hooks/mutations/useCreateAccountMutation";
import { CreateAccountPayload } from "@/lib/api/account";
import { ACCOUNT_TYPES } from "@/lib/constants/account";
import { formatToDotDecimal, getErrorMessage } from "@/lib/utils";
import CurrencyCombobox from "../CurrencyCombobox";
import { useAuthStore } from "@/store/auth/authStore";
import { useBudgetStore } from "@/store/dashboard/budgetStore";

const CreateAccountButton: FC = () => {
  const user = useAuthStore.use.user();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const budgetId = useBudgetStore.use.budgetId();

  const { toast } = useToast();
  const form = useForm<TCreateAccountForm>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: "",
      currency: user!.currency,
      amount: "0.00",
      accountType: "Checking",
    },
  });

  const { handleSubmit, control, reset, watch } = form;
  const selectedCurrency = watch("currency");

  const onMutationSuccess = () => {
    reset();
    setIsCreateDialogOpen(false);
  };

  const onMutationError = (err: Error) => {
    const description = getErrorMessage(err);
    toast({
      title: "Error",
      variant: "destructive",
      description,
    });
  };

  const { mutate, isPending } = useCreateAccountMutation({
    onMutationSuccess,
    onMutationError,
  });

  const onSubmit: SubmitHandler<TCreateAccountForm> = (data) => {
    const { accountType, amount, currency, name } = data;
    const formattedAmount = formatToDotDecimal(amount);
    const payload: CreateAccountPayload = {
      name,
      accountType,
      balance: { amount: Number(formattedAmount), currency },
    };

    mutate({ budgetId, payload });
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger className="flex items-center justify-between rounded-l-full py-4 pl-9 pr-4 transition-all duration-300 hover:bg-accent hover:text-foreground">
        <span className="text-sm font-semibold tracking-wide">
          Create account
        </span>
        <Plus className="size-6 shrink-0 opacity-60" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new account.</DialogTitle>
          <DialogDescription>
            Please fill in the fields below. Enter a unique and descriptive name
            for the new account; this name will help you identify your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-8 py-6"
          >
            <div className="w-full space-y-2 rounded-xl bg-gradient-to-b from-primary via-primary to-primaryDark p-4 text-primary-foreground shadow-lg shadow-primaryDark/50 md:col-span-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your account name"
                        autoComplete="off"
                        className="bg-transparent text-lg placeholder:text-primary-foreground/90 focus-visible:ring-0 focus-visible:ring-primary-foreground focus-visible:ring-offset-1 md:text-2xl"
                      />
                    </FormControl>
                    <FormMessage className="w-fit rounded-md bg-primary-foreground px-1" />
                  </FormItem>
                )}
              />
              <div className="flex justify-between space-x-4">
                <FormField
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-xs tracking-wide">
                        Balance:
                      </FormLabel>
                      <FormControl>
                        <AmountInput
                          field={field}
                          currency={selectedCurrency}
                          className="border bg-transparent text-left text-lg focus-visible:ring-0 focus-visible:ring-primary-foreground focus-visible:ring-offset-1"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="w-1/3 space-y-0">
                      <FormLabel className="text-xs tracking-wide">
                        Currency:
                      </FormLabel>
                      <FormControl>
                        <CurrencyCombobox
                          selectedValue={field.value}
                          onChange={field.onChange}
                          className="bg-transparent hover:bg-transparent"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="accountType"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center space-x-2 space-y-0">
                    <FormLabel className="flex-grow text-end">
                      Account type:
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-1/2 bg-transparent text-primary-foreground focus:ring-0 focus:ring-primary-foreground  focus:ring-offset-1 lg:w-1/3">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <LoadingButton
              isLoading={isPending}
              type="submit"
              size="lg"
              className="w-full tracking-widest shadow-xl shadow-primaryDark/40"
            >
              Create
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountButton;
