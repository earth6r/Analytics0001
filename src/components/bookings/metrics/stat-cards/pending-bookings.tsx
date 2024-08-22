import { BookmarkCheck, Loader } from "lucide-react";
import StatCard from "@/components/common/stat-card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

const PendingBookings = () => {
    const { interval } = useInterval();
    const pendingBookingsCount =
        api.bookings.pendingBookingsCount.useQuery(
            undefined,
            {
                refetchInterval: interval,
            },
        );
    const pendingBookingsCountDelta = api.bookings.pendingBookingsCountDelta.useQuery(
        undefined,
        {
            refetchInterval: interval,
        },
    );

    return (
        <StatCard
            title={pendingBookingsCount.data?.toString()}
            description="Pending Bookings"
            deltaValue={pendingBookingsCountDelta.data}
            icon={<Loader className="h-6 w-6 text-muted-foreground" />}
        />
    );
};

export default PendingBookings;
