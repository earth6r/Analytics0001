"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import { Skeleton } from "@/components/ui/skeleton";

const NumberOfMessagesChart = () => {
  const { interval } = useInterval();
  const getMessagesForTheYearGroupedCount =
    api.post.getMessagesForTheYearGroupedCount.useQuery(
      // @ts-expect-error - fix this
      {},
      {
        refetchInterval: interval,
      },
    );

  return (
    <Card className="w-full shadow lg:w-3/5">
      <CardHeader>
        <CardTitle>Total Messages Per Month</CardTitle>
        <CardDescription>Total messages sent per month</CardDescription>
      </CardHeader>
      <ResponsiveContainer height={350}>
        {getMessagesForTheYearGroupedCount.data ? (
          <BarChart data={getMessagesForTheYearGroupedCount.data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        ) : (
          <div className="h-full w-full pb-6 pl-6 pr-6">
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </ResponsiveContainer>
    </Card>
  );
};

export default NumberOfMessagesChart;
