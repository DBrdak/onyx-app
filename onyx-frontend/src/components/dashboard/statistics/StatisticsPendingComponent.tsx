import { Card } from "@/components/ui/card";
import { MONTHS } from "@/lib/constants/date";

const StatisticsPendingComponent = () => {
  const yAxisLabels = ["1000", "800", "600", "400", "200", "0"];

  return (
    <div className="flex flex-col space-y-14">
      <Card className="relative h-[300px] w-full px-2 py-4">
        <div className="flex items-center justify-center pb-4">
          <div className="h-9 w-[120px] animate-pulse rounded-lg bg-primary/40" />
        </div>
        <div className="absolute left-0 flex h-[200px] flex-col justify-between">
          {yAxisLabels.map((label) => (
            <span key={label} className="text-sm text-muted-foreground">
              {label}
            </span>
          ))}
        </div>
        <div className="ml-12 h-[200px]">
          <div className="flex h-full items-end justify-evenly space-x-4">
            {MONTHS.map((_, index) => (
              <>
                <div
                  key={index}
                  className="h-full w-full origin-bottom animate-grow-bar bg-primary"
                />
                <div
                  key={MONTHS.length + index + 1}
                  className="h-[40%] w-full origin-bottom animate-grow-bar bg-primaryDark/40"
                />
              </>
            ))}
          </div>
          <div className="mt-2 flex justify-evenly">
            {MONTHS.map((label) => (
              <span key={label} className="text-sm text-gray-500">
                {label}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="md:flex md:space-x-4">
        <Card className="flex w-full flex-col items-center justify-center space-y-4 p-4">
          <div className="h-14 w-full animate-pulse rounded-lg bg-primary/40 p-4" />

          <div className="relative h-[200px] w-[200px]">
            <div className="before:absolute before:block before:h-[200px] before:w-[200px] before:animate-eat before:rounded-full before:content-['']" />
          </div>
        </Card>

        <Card className="flex w-full flex-col items-center justify-center space-y-4 p-4">
          <div className="h-14 w-full animate-pulse rounded-lg bg-primary/50 p-4" />

          <div className="relative h-[200px] w-[200px]">
            <div className="before:absolute before:block before:h-[200px] before:w-[200px] before:-rotate-180 before:animate-eat before:rounded-full before:content-['']" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPendingComponent;
