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
import useColor from "@/hooks/use-color";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { interval } = useInterval();
  const { pieColors } = useColor();

  const [labels, setLabels] = useState([]);
  const [pieData, setPieData] = useState([]);

  const locationInterests = api.post.getLocationsOfInterest.useQuery(
    undefined,
    {
      refetchInterval: interval,
    },
  );

  useEffect(() => {
    if (locationInterests.data) {
      // @ts-expect-error - fix this
      setLabels(locationInterests.data.map((item) => Object.keys(item)[0]));
      // @ts-expect-error - fix this
      setPieData(locationInterests.data.map((item) => Object.values(item)[0]));
    }
  }, [locationInterests.data]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Property Interests",
        data: pieData,
        backgroundColor: pieColors,
        borderColor: pieColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="h-[600px] w-full overflow-hidden pb-3 shadow md:w-2/5">
      <CardHeader>
        <CardTitle>Property Interests</CardTitle>
        <CardDescription>Property interests by type</CardDescription>
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
      {locationInterests.isLoading || locationInterests.isError ? (
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
          <ProgressChart data={locationInterests} />
        </ScrollArea>
      )}
    </Card>
  );
};

export default PieChart;
