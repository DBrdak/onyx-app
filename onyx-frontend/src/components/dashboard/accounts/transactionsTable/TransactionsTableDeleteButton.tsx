import { Dispatch, FC, SetStateAction } from "react";
import { Row, RowSelectionState } from "@tanstack/react-table";

import { Transaction } from "@/lib/validation/transaction";
import { useDeleteTransactionsMutation } from "@/lib/hooks/mutations/useDeleteTransactionsMutation";
import DeleteTransactionDialog from "../DeleteTransactionDialog";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import { useAccountStore } from "@/store/dashboard/accountStore";

interface TransactionsTableDeleteButtonProps {
  rows: Row<Transaction>[];
  setRowsSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

const TransactionsTableDeleteButton: FC<TransactionsTableDeleteButtonProps> = ({
  rows,
  setRowsSelection,
}) => {
  const budgetId = useBudgetStore.use.budgetId();
  const accountId = useAccountStore.use.accountId();

  const { mutate, isError, error, reset } = useDeleteTransactionsMutation({
    budgetId,
    accountId,
  });

  const onDelete = () => {
    mutate({ budgetId, rows });
    setRowsSelection({});
  };

  return (
    <DeleteTransactionDialog
      isError={isError}
      onDelete={onDelete}
      rowsToDeleteLength={rows.length}
      error={error}
      reset={reset}
    />
  );
};

export default TransactionsTableDeleteButton;
