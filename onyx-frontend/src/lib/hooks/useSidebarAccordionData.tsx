import { useMemo } from "react";

import { AreaChart, CreditCard } from "lucide-react";
import CreateAccountButton from "@/components/dashboard/accounts/CreateAccountButton";

import { type Account } from "../validation/account";
import { AccordionData } from "@/components/dashboard/dashboard-layout/types";

interface Props {
  accounts: Account[];
  budgetSlug: string;
}

export const useSidebarAccordionData = ({ accounts, budgetSlug }: Props) => {
  return useMemo(() => {
    const data: AccordionData[] = [
      {
        title: {
          label: "Accounts",
          Icon: CreditCard,
        },
        links: accounts.map((acc) => ({
          label: acc.name,
          to: "/budget/$budgetSlug/accounts/$accountSlug",
          params: { budgetSlug, accountSlug: acc.slug },
          preload: false,
        })),
        additionalContent: (
          <>
            {accounts.length > 0 && <div className="h-1 border-t" />}
            <CreateAccountButton />
          </>
        ),
      },
      {
        title: {
          label: "Statistics",
          Icon: AreaChart,
        },
        links: [
          {
            label: "Categories",
            to: "/budget/$budgetSlug/statistics/categories",
            params: { budgetSlug },
            preload: "intent",
          },
          {
            label: "Accounts",
            to: "/budget/$budgetSlug/statistics/accounts",
            params: { budgetSlug },
            preload: "intent",
          },
          {
            label: "Counterparties",
            to: "/budget/$budgetSlug/statistics/counterparties",
            params: { budgetSlug },
            preload: "intent",
          },
        ],
      },
    ];

    return data;
  }, [accounts, budgetSlug]);
};
