import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInterval } from "@/contexts/IntervalContext";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/utils/api";
import useColor from "@/hooks/use-color";

const MessagesByWeek = () => {
  const { interval } = useInterval();
  const { chartColor } = useColor();

  const messagesByWeek = api.post.getMessagesByWeek.useQuery(
    undefined,
    {
      refetchInterval: interval,
    },
  );
  return (
    <Card className="h-[450px] w-full mt-6 md:mt-0 shadow lg:mt-0 lg:w-3/5">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Messages By Week</CardTitle>
          <div>
            <CardDescription>Messages sent by week</CardDescription>
          </div>
        </div>
      </CardHeader>
      <ResponsiveContainer height={350} className="p-1">
        <LineChart
          width={500}
          height={300}
          data={messagesByWeek.data}
          margin={{
            top: 5,
            right: 40,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke={chartColor}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MessagesByWeek;
