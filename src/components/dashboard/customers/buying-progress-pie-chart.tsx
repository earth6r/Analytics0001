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

ChartJS.register(ArcElement, Tooltip, Legend);

const BuyingProgressPieChart = () => {
  const { interval } = useInterval();
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
        backgroundColor: [
          "rgba(25, 25, 112, 1)", // midnight blue
          "rgba(0, 0, 255, 1)", // blue
          "rgba(70, 130, 180, 1)", // steel blue
          "rgba(135, 206, 235, 1)", // sky blue
          "rgba(240, 248, 255, 1)", // alice blue
          "rgba(70, 130, 180, 1)", // steel blue
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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
