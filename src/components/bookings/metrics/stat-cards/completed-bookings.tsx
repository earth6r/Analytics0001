import { BookmarkCheck } from "lucide-react";
import StatCard from "@/components/common/stat-card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

const CompletedBookings = () => {
    const { interval } = useInterval();
    const completedBookingsCount =
        api.bookings.completedBookingsCount.useQuery(
            undefined,
            {
                refetchInterval: interval,
            },
        );
    const completedBookingsCountDelta = api.bookings.completedBookingsCountDelta.useQuery(
        undefined,
        {
            refetchInterval: interval,
        },
    );

    return (
        <StatCard
            title={completedBookingsCount.data?.toString()}
            description="Completed Bookings"
            deltaValue={completedBookingsCountDelta.data}
            icon={<BookmarkCheck className="h-6 w-6 text-muted-foreground" />}
        />
    );
};

export default CompletedBookings;
