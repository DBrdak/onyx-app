import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import ImportTableSelectStageHeadSelect from "@/components/dashboard/accounts/transactionsTable/importTable/ImportTableSelectStageHeadSelect";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  ImportTransactionsPresubmitState,
  ImportTransactionsSelectStageArraySchema,
} from "@/lib/validation/transaction";
import { VARIANTS } from "@/components/dashboard/accounts/transactionsTable/TransactionsTable";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { useBudgetId } from "@/store/dashboard/budgetStore";

interface ImportTableSelectStageProps {
  data: string[][];
  setDefaultTableVariant: () => void;
  setVariant: Dispatch<SetStateAction<VARIANTS>>;
  setSubmitVariantData: Dispatch<
    SetStateAction<ImportTransactionsPresubmitState[]>
  >;
}

interface SelectedColumns {
  [key: string]: string | null;
}

const REQUIRED_OPTIONS = ["date", "counterparty", "amount", "currency"];

const ImportTableSelectStage: FC<ImportTableSelectStageProps> = ({
  data,
  setDefaultTableVariant,
  setVariant,
  setSubmitVariantData,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>({});

  const budgetId = useBudgetId();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const headers = data[0];
  const body = data.slice(1);
  const croppedBody = data.slice(1, 5);
  const categories = queryClient.getQueryData(
    getCategoriesQueryOptions(budgetId).queryKey,
  );
  const defaultSubcategory = useMemo(() => {
    const uncategorized = categories?.find(
      (cat) => cat.name === "Uncategorized",
    );
    return (
      uncategorized?.subcategories.find((s) => s.name === "Unknown") || null
    );
  }, [categories]);

  const onTableHeadSelectChange = useCallback(
    (columnIndex: number, value: string | null) => {
      setSelectedColumns((prev) => {
        const newSelectedColumns = { ...prev };

        for (const key in newSelectedColumns) {
          if (newSelectedColumns[key] === value) {
            newSelectedColumns[key] = null;
          }
        }

        if (value === "skip") {
          value = null;
        }

        newSelectedColumns[`column_${columnIndex}`] = value;
        return newSelectedColumns;
      });
    },
    [],
  );

  const continueProgress = useMemo(
    () => Object.values(selectedColumns).filter(Boolean).length,
    [selectedColumns],
  );

  const onContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData: {
      headers: (string | null)[];
      body: (string | null)[][];
    } = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce<Record<string, string | null>>((acc, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    const validatedSelectStageData =
      ImportTransactionsSelectStageArraySchema.safeParse(arrayOfData);

    if (!validatedSelectStageData.data || validatedSelectStageData.error) {
      console.log(validatedSelectStageData.error.errors);
      return toast({
        title: "Column selection error",
        variant: "destructive",
        description: "Please select columns with correct values.",
      });
    }

    setSubmitVariantData(
      validatedSelectStageData.data.map((t) => {
        const numericAmount = Number(t.amount);

        return {
          amount: {
            amount: numericAmount,
            currency: t.currency,
          },
          transactedAt: new Date(t.date),
          counterpartyName: t.counterparty,
          subcategoryId: (numericAmount < 0 && defaultSubcategory?.id) || null,
          subcategoryName:
            (numericAmount < 0 && defaultSubcategory?.name) || null,
        };
      }),
    );
    setVariant(VARIANTS.SUBMIT);
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-4 md:flex md:justify-between md:space-y-0">
        <h3 className="text-lg font-semibold">Import Transactions</h3>
        <div className="space-y-4 md:space-x-2 md:space-y-0">
          <Button
            disabled={continueProgress < REQUIRED_OPTIONS.length}
            variant="outline"
            className="w-full md:w-auto"
            onClick={onContinue}
          >
            Continue ({continueProgress} / {REQUIRED_OPTIONS.length})
          </Button>
          <Button
            variant="outline"
            onClick={setDefaultTableVariant}
            className="w-full md:w-auto"
          >
            Cencel
          </Button>
        </div>
      </div>

      <Table className="border bg-card">
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((_header, index) => (
              <TableHead key={index}>
                <ImportTableSelectStageHeadSelect
                  columnIndex={index}
                  selectedColumns={selectedColumns}
                  onChange={onTableHeadSelectChange}
                  selectOptions={REQUIRED_OPTIONS}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {croppedBody.map((row: string[], index) => (
            <TableRow key={index}>
              {row.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="text-center font-semibold">
        This is a showcase of your imported transactions data. Select only the
        required columns and proceed to the final step.
      </h3>
    </div>
  );
};

export default ImportTableSelectStage;
