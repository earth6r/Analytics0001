import { BookOpenCheckIcon } from "lucide-react";
import StatCard from "@/components/common/stat-card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

const TotalUniqueRegisteredUsersCount = () => {
  const { interval } = useInterval();
  const totalUniqueRegisteredUsersCount =
    api.post.getTotalUniqueRegisteredUsersCount.useQuery(
      // @ts-expect-error - fix this
      {},
      {
        refetchInterval: interval,
      },
    );
  const totalUniqueUsersCountDelta = api.post.getTotalUniqueUsersDelta.useQuery(
    // @ts-expect-error - fix this
    {},
    {
      refetchInterval: interval,
    },
  );

  return (
    <StatCard
      title={totalUniqueRegisteredUsersCount.data?.toString()}
      description="Total Unique Registered Users"
      deltaValue={totalUniqueUsersCountDelta.data}
      icon={<BookOpenCheckIcon className="h-6 w-6 text-muted-foreground" />}
    />
  );
};

export default TotalUniqueRegisteredUsersCount;
