import { FC, useCallback, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";

import ImportTableSelectStageHeadSelect from "@/components/dashboard/accounts/transactionsTable/importTable/ImportTableSelectStageHeadSelect";
import ImportTableSubmitStage from "@/components/dashboard/accounts/transactionsTable/importTable/ImportTableSubmitStage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

interface ImportTableSelectStageProps {
  data: string[][];
  onCencel: () => void;
}

interface SelectedColumns {
  [key: string]: string | null;
}

enum STAGE {
  SELECT = "SELECT",
  SUBMIT = "SUBMIT",
}

const REQUIRED_OPTIONS = ["date", "counterparty", "amount", "currency"];

const ImportTableSelectStage: FC<ImportTableSelectStageProps> = ({
  data,
  onCencel,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>({});
  const [importStage, setImportStage] = useState<STAGE>(STAGE.SELECT);
  const [submitStageData, setSubmitStageData] = useState<
    ImportTransactionsPresubmitState[]
  >([]);
  const { accountId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const { toast } = useToast();

  const headers = data[0];
  const body = data.slice(1);
  const croppedBody = data.slice(1, 7);

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

    setSubmitStageData(
      validatedSelectStageData.data.map((t) => ({
        accountId,
        amount: {
          amount: Number(t.amount),
          currency: t.currency,
        },
        transactedAt: t.date,
        counterpartyName: t.counterparty,
        subcategoryId: null,
        subcategoryName: null,
      })),
    );
    setImportStage(STAGE.SUBMIT);
  };

  const onBack = useCallback(() => {
    setImportStage(STAGE.SELECT);
    setSubmitStageData([]);
  }, []);

  if (importStage === STAGE.SUBMIT) {
    return (
      <ImportTableSubmitStage
        data={submitStageData}
        onBack={onBack}
        setSubmitStageData={setSubmitStageData}
      />
    );
  }

  return (
    <div className="space-y-8 pt-7">
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
            onClick={onCencel}
            className="w-full md:w-auto"
          >
            Cencel
          </Button>
        </div>
      </div>
      <Card>
        <Table>
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
      </Card>
      <h3 className="text-center font-semibold">
        This is a showcase of your imported transactions data. Select only the
        required columns and proceed to the final step.
      </h3>
    </div>
  );
};

export default ImportTableSelectStage;
