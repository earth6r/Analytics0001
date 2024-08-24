import { Hash } from "lucide-react";
import StatCard from "@/components/common/stat-card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

interface BookingsCountProps {
    startDate: Date;
    endDate: Date;
    description: string;
    type: string;
}

const BookingsCount = (props: BookingsCountProps) => {
    const { interval } = useInterval();
    const { startDate, endDate, description, type } = props;

    const bookingsCount = api.bookings.bookingsCountByType.useQuery({
        startDate: startDate,
        endDate: endDate,
        type: type,
    }, {
        refetchInterval: interval,
    })

    return (
        <StatCard
            title={bookingsCount.data?.toString()}
            description={description}
            deltaValue={-1}
            icon={<Hash className="h-6 w-6 text-muted-foreground" />}
        />
    );
};

export default BookingsCount
