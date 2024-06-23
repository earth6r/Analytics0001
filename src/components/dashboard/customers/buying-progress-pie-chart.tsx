import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProgressChart from "@/components//common/progress-chart";
import { buyingProgressTypeToLabel } from "./buying-progress-chart";
import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";
import useColor from "@/hooks/use-color";

ChartJS.register(ArcElement, Tooltip, Legend);

const BuyingProgressPieChart = () => {
  const { interval } = useInterval();
  const { pieColors } = useColor();

  const [labels, setLabels] = useState([]);
  const [pieData, setPieData] = useState([]);

  const getBuyingProgressPieChart = api.customer.getBuyingProgressPieChart.useQuery(
    undefined,
    {
      refetchInterval: interval,
    },
  );

  useEffect(() => {
    if (getBuyingProgressPieChart.data) {
      // @ts-expect-error - fix this
      setLabels(getBuyingProgressPieChart.data.map((item) => Object.keys(item)[0]));
      // @ts-expect-error - fix this
      setPieData(getBuyingProgressPieChart.data.map((item) => Object.values(item)[0]));
    }
  }, [getBuyingProgressPieChart.data]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Buying Progress",
        data: pieData,
        backgroundColor: pieColors,
        borderColor: pieColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="h-[634px] w-full overflow-hidden pb-3 shadow md:w-2/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Buying Progress</CardTitle>
          <CircularQuestionMarkTooltip label="Each value is the user's current step they completed." />
        </div>
        <CardDescription>Buying progress by step</CardDescription>
      </CardHeader>
      <div className="h-[300px]">
        <Pie
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
      {getBuyingProgressPieChart.isLoading || getBuyingProgressPieChart.isError ? (
        <ScrollArea className="max-h-48">
          <div className="flex flex-col space-y-3 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </ScrollArea>
      ) : (
        <ScrollArea className="flex max-h-48 flex-col space-y-3">
          <ProgressChart data={getBuyingProgressPieChart} nameToLabelMapping={buyingProgressTypeToLabel} />
        </ScrollArea>
      )}
    </Card>
  );
};

export default BuyingProgressPieChart;
