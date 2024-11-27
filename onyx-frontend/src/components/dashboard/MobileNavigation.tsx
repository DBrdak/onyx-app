import { FC, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { AlignJustify, Undo2, Wallet } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Account } from "@/lib/validation/account";
import { cn } from "@/lib/utils";
import { useBudgetStore } from "@/store/dashboard/budgetStore";
import { useSidebarAccordionData } from "@/lib/hooks/useSidebarAccordionData";
import SidebarAccordion from "./dashboard-layout/SidebarAccordion";
import { ScrollArea } from "../ui/scroll-area";

interface MobileNavigationProps {
  linksAvailable: boolean;
  accounts: Account[];
}

const MobileNavigation: FC<MobileNavigationProps> = ({
  linksAvailable,
  accounts,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const budgetSlug = useBudgetStore.use.budgetSlug();

  const onBackToBudgetsClick = () => {
    navigate({ to: "/budget" });
    setIsNavOpen(false);
  };

  const onButgetsLinkClick = () => {
    navigate({
      to: budgetSlug ? "/budget/$budgetSlug" : "/budget",
    });
    setIsNavOpen(false);
  };

  const isBudgetLinkSelected = (pathname: string) =>
    pathname === `/budget/${budgetSlug}` || pathname === "/budget";

  const accordionData = useSidebarAccordionData({ accounts, budgetSlug });

  return (
    <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <AlignJustify />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full flex-col bg-primaryDark pr-0 text-primaryDark-foreground"
      >
        <SheetHeader>
          <SheetTitle className="flex justify-center text-center">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-grow flex-col justify-between overflow-y-auto py-12">
          <div className="flex flex-col space-y-4">
            {budgetSlug && linksAvailable && (
              <Button
                onClick={onBackToBudgetsClick}
                size="lg"
                variant="primaryDark"
                className="h-14 justify-start space-x-4 rounded-l-full rounded-r-none text-sm font-semibold tracking-widest transition-colors duration-300 hover:bg-background hover:text-foreground"
              >
                <Undo2 />
                <span>Budgets</span>
              </Button>
            )}
            <Button
              onClick={onButgetsLinkClick}
              size="lg"
              variant="primaryDark"
              className={cn(
                "h-14 justify-start space-x-4 rounded-l-full rounded-r-none text-sm font-semibold tracking-widest transition-colors duration-300 hover:bg-background hover:text-foreground",
                isBudgetLinkSelected(pathname) &&
                  "bg-background text-foreground",
              )}
            >
              <Wallet />
              <span>{budgetSlug && linksAvailable ? "Budget" : "Budgets"}</span>
            </Button>

            {linksAvailable && <SidebarAccordion data={accordionData} />}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
