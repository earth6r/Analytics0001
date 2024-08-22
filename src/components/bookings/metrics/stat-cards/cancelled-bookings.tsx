import { TicketX } from "lucide-react";
import StatCard from "@/components/common/stat-card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

const CancelledBookings = () => {
    const { interval } = useInterval();
    const cancelledBookingsCount =
        api.bookings.cancelledBookingsCount.useQuery(
            undefined,
            {
                refetchInterval: interval,
            },
        );
    const cancelledBookingsCountDelta = api.bookings.cancelledBookingsCountDelta.useQuery(
        undefined,
        {
            refetchInterval: interval,
        },
    );

    return (
        <StatCard
            title={cancelledBookingsCount.data?.toString()}
            description="Cancelled Bookings"
            deltaValue={cancelledBookingsCountDelta.data}
            icon={<TicketX className="h-6 w-6 text-muted-foreground" />}
        />
    );
};

export default CancelledBookings;
