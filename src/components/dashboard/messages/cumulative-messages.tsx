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

const CumulativeMessages = () => {
  const { interval } = useInterval();

  const cumulativeMessages = api.post.getCumulativeMessages.useQuery(
    {},
    {
      refetchInterval: interval,
    },
  );

  return (
    <Card className="h-[450px] w-full shadow lg:mt-0 lg:w-2/5">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Cumulative Messages</CardTitle>
          <div>
            <CardDescription>Cumulative messages over time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <ResponsiveContainer height={350} className="p-1">
        <LineChart
          width={500}
          height={300}
          data={cumulativeMessages.data}
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
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CumulativeMessages;
