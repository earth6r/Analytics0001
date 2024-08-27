import ProgressChart from "@/components/common/progress-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/utils/api";

interface BookingsCountsProps {
    bookingType: string;
}

const BookingsCounts = (props: BookingsCountsProps) => {
    const { bookingType } = props;

    const getBookingsCount = api.bookings.getBookingsCount.useQuery(
        { type: bookingType },
        // { refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false } TODO: investigate this for scaling
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {bookingType} Bookings Count
                </CardTitle>
                <CardDescription>
                    {bookingType} Counts per timeline
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ProgressChart data={getBookingsCount} />
            </CardContent>
        </Card>
    );
};

export default BookingsCounts;
