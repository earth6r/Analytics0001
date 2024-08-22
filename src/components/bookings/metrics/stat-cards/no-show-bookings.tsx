import { BookmarkCheck, VideoOff } from "lucide-react";
import StatCard from "@/components/common/stat-card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

const NoShowBookings = () => {
    const { interval } = useInterval();
    const noShowBookingsCount =
        api.bookings.noShowBookingsCount.useQuery(
            undefined,
            {
                refetchInterval: interval,
            },
        );
    const noShowBookingsCountDelta = api.bookings.noShowBookingsCountDelta.useQuery(
        undefined,
        {
            refetchInterval: interval,
        },
    );

    return (
        <StatCard
            title={noShowBookingsCount.data?.toString()}
            description="No Show Bookings"
            deltaValue={noShowBookingsCountDelta.data}
            icon={<VideoOff className="h-6 w-6 text-muted-foreground" />}
        />
    );
};

export default NoShowBookings;
