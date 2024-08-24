import { Hash } from "lucide-react";
import StatCard from "@/components/common/stat-card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

interface RegisterCountProps {
  startDate: Date;
  endDate: Date;
  description: string;
}

const RegisterCount = (props: RegisterCountProps) => {
  const { interval } = useInterval();
  const { startDate, endDate, description } = props;

  const registerCount = api.register.getRegisterCount.useQuery({
    startDate: startDate,
    endDate: endDate,
  }, {
    refetchInterval: interval,
  })

  return (
    <StatCard
      title={registerCount.data?.toString()}
      description={description}
      deltaValue={-1}
      icon={<Hash className="h-6 w-6 text-muted-foreground" />}
    />
  );
};

export default RegisterCount
