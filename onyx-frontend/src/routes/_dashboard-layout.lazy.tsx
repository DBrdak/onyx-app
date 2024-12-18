import {
  Link,
  Outlet,
  createLazyFileRoute,
  useLocation,
} from "@tanstack/react-router";

import { Undo2, Wallet } from "lucide-react";
import Logo from "@/components/Logo";
import UserDropdown from "@/components/userDropdown/UserDropdown";
import MobileNavigation from "@/components/dashboard/MobileNavigation";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useSingleBudgetLoadingState } from "@/lib/hooks/useSingleBudgetLoadingState";
import { useQuery } from "@tanstack/react-query";
import { getAccountsQueryOptions } from "@/lib/api/account";
import { Account } from "@/lib/validation/account";
import { useAuthStore } from "@/store/auth/authStore";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import SidebarAccordion from "@/components/dashboard/dashboard-layout/SidebarAccordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebarAccordionData } from "@/lib/hooks/useSidebarAccordionData";

export const Route = createLazyFileRoute("/_dashboard-layout")({
  component: Layout,
});

function Layout() {
  const user = useAuthStore.use.user();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const { pathname } = useLocation();
  const isBudgetListOpen = pathname.endsWith("/budget");
  const budgetId = useBudgetStore.use.budgetId();
  const budgetSlug = useBudgetStore.use.budgetSlug();
  const isBudgetSelected = !isBudgetListOpen && budgetId && budgetSlug;

  const { isError: isSingleBudgetLoadingError } =
    useSingleBudgetLoadingState(budgetId);

  const linksAvailable = !!isBudgetSelected && !isSingleBudgetLoadingError;

  const { data: accounts = [] } = useQuery({
    ...getAccountsQueryOptions(budgetId!),
    enabled: false,
  });

  const accordionData = useSidebarAccordionData({ accounts, budgetSlug });

  if (!isDesktop)
    return <MobileLayout linksAvailable={linksAvailable} accounts={accounts} />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="sticky left-0 h-full w-[250px] bg-primaryDark py-10 text-primaryDark-foreground lg:w-[300px]">
        <div className="flex h-full flex-col space-y-6 pb-8 pl-6">
          <div className="flex h-full flex-col">
            <div className="mb-14 mt-6 flex justify-center">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            <ScrollArea className="h-full flex-grow">
              <div className="space-y-4">
                <Link
                  to="/budget"
                  className={cn(
                    "grid grid-rows-[0fr] rounded-l-full pl-9 text-sm font-semibold transition-all duration-500 ease-in-out hover:bg-accent hover:text-foreground",
                    isBudgetSelected && "grid-rows-[1fr] py-4",
                  )}
                  preload="intent"
                >
                  <span className="space-x-4 overflow-hidden">
                    <Undo2 className="inline-flex size-6 shrink-0" />
                    <span className="inline-flex text-sm font-semibold tracking-wide">
                      Budgets
                    </span>
                  </span>
                </Link>

                <Link
                  to={isBudgetSelected ? "/budget/$budgetSlug" : "/budget"}
                  className="block rounded-l-full py-4 pl-9 transition-all duration-500 hover:bg-accent hover:text-foreground"
                  activeProps={{
                    className: "bg-background text-foreground",
                  }}
                  preload="intent"
                  activeOptions={{
                    exact: true,
                    includeSearch: false,
                  }}
                >
                  <span className="space-x-4 overflow-hidden">
                    <Wallet className="inline-flex size-6 shrink-0" />
                    <span className="inline-flex text-sm font-semibold tracking-wide">
                      {isBudgetSelected ? "Budget" : "Budgets"}
                    </span>
                  </span>
                </Link>

                <div
                  className={cn(
                    "grid h-full grid-rows-[0fr] transition-all duration-500 ease-in-out",
                    linksAvailable && "grid-rows-[1fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <SidebarAccordion data={accordionData} />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="pt-4">
              <UserDropdown user={user!} isSidebar />
            </div>
          </div>
        </div>
      </aside>

      <main className="mx-auto flex h-screen w-full max-w-screen-xl flex-col px-12 pb-4 pt-12">
        <Outlet />
      </main>
    </div>
  );
}

const MobileLayout = ({
  linksAvailable,
  accounts,
}: {
  linksAvailable: boolean;
  accounts: Account[];
}) => {
  const user = useAuthStore.use.user();

  return (
    <>
      <nav className="fixed z-50 flex w-full items-center justify-between bg-primaryDark px-4 py-2 text-primaryDark-foreground md:px-8">
        <MobileNavigation linksAvailable={linksAvailable} accounts={accounts} />
        <Link to="/">
          <Logo />
        </Link>
        <UserDropdown user={user!} />
      </nav>
      <main className="px-4 pb-12 pt-28 md:px-8">
        <Outlet />
      </main>
    </>
  );
};
