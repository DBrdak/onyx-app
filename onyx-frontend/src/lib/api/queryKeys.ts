import { QueryClient } from "@tanstack/react-query";

type Keys =
  | "budget"
  | "categories"
  | "accounts"
  | "transactions"
  | "statistics"
  | "toAssign";

type IdentifierType = "budgetId" | "accountId";

interface KeyIdentifier {
  key: Keys;
  identifierType: IdentifierType;
}

const dependencyMap: Record<Keys, KeyIdentifier[]> = {
  budget: [],
  categories: [
    { key: "statistics", identifierType: "budgetId" },
    { key: "toAssign", identifierType: "budgetId" },
  ],
  accounts: [{ key: "statistics", identifierType: "budgetId" }],
  transactions: [
    { key: "accounts", identifierType: "budgetId" },
    { key: "categories", identifierType: "budgetId" },
    { key: "statistics", identifierType: "budgetId" },
    { key: "toAssign", identifierType: "budgetId" },
  ],
  statistics: [],
  toAssign: [],
};

export const queryBudgetKeys = {
  budget: ["budget"],
  categories: (budgetId: string) => ["categories", budgetId],
  accounts: (budgetId: string) => ["accounts", budgetId],
  transactions: (accountId: string) => ["transactions", accountId],
  statistics: (budgetId: string) => ["statistics", budgetId],
  toAssign: (budgetId: string) => ["toAssign", budgetId],
};

type Identifiers = Partial<Record<IdentifierType, string>>;

export const invalidateDependencies = (
  queryClient: QueryClient,
  key: Keys,
  identifiers: Identifiers,
  skipCurrentQuery: boolean = false,
): void => {
  const relatedKeys = dependencyMap[key] || [];

  for (const dependency of relatedKeys) {
    const { key: relatedKey, identifierType } = dependency;

    const identifierValue = identifiers[identifierType];
    if (!identifierValue) {
      console.warn(
        `Missing identifier "${identifierType}" for dependency "${relatedKey}".`,
      );
      continue;
    }

    const queryKey = [relatedKey, identifierValue];
    queryClient.invalidateQueries({ queryKey });
  }

  if (!skipCurrentQuery) {
    const originalIdentifier =
      identifiers[key === "transactions" ? "accountId" : "budgetId"];

    if (originalIdentifier) {
      const originalQueryKey = [key, originalIdentifier];
      queryClient.invalidateQueries({ queryKey: originalQueryKey });
    } else {
      console.warn(`Missing identifier for key "${key}".`);
    }
  }
};
