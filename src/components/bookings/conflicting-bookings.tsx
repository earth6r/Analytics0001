import { formatTimestamp } from "@/lib/utils";
import { Badge } from "../ui/badge"; // TODO: use this somehow in the ui
import moment from "moment-timezone";
import { TriangleAlert } from "lucide-react";
import { useInterval } from "@/contexts/IntervalContext";

interface ConflictingBookingsProps {
    startDate: Date | undefined;
    startTime: string;
    bookingType: string | null | undefined;
    bookings: any[];
}

const ConflictingBookings = (props: ConflictingBookingsProps) => {
    const { startDate, startTime, bookingType, bookings } = props;

    const { timezone } = useInterval();

    if (!startDate || !startTime || !bookingType) {
        return null;
    }

    // use moment to convert the start date and start time to a date which is EST, convert to UTC, and then convert to epoch. startDate is a js Date object

    // Combine the startDate and startTime into a single moment object in EST
    const estStartDateTime = moment.tz(`${startDate.toISOString().split('T')[0]} ${startTime}`, 'America/New_York');

    // Convert the EST datetime to UTC
    const utcStartDateTime = estStartDateTime.utc();

    // Convert the UTC datetime to an epoch timestamp
    const epochStartTimestamp = utcStartDateTime.valueOf(); // .valueOf() gives the timestamp in milliseconds

    // if bookingType is "Property Tour", add 1 hour to the epochStartTimestamp, else add 15 minutes
    const estEndDateTime = bookingType === 'Property Tour' ? estStartDateTime.add(1, 'hour') : estStartDateTime.add(15, 'minutes');
    const epochEndTimestamp = estEndDateTime.utc().valueOf();

    const conflictingBookings = bookings
        .filter(booking => booking.type === bookingType)
        .filter(booking => {
            const bookingStartTimestamp = booking.startTimestamp;
            const bookingEndTimestamp = booking.endTimestamp;
            return (
                (epochStartTimestamp >= bookingStartTimestamp && epochStartTimestamp <= bookingEndTimestamp) ||
                (epochEndTimestamp >= bookingStartTimestamp && epochEndTimestamp <= bookingEndTimestamp) ||
                (epochStartTimestamp <= bookingStartTimestamp && epochEndTimestamp >= bookingEndTimestamp)
            );
        });

    if (conflictingBookings.length === 0) {
        // return (
        //     <div className="flex flex-row items-center justify-center space-x-2 text-sm">
        //         <div className="text-green-500">
        //             <Check className="h-4 w-4" />
        //         </div>
        //         <h1>No Conflicting Bookings Found</h1>
        //     </div>
        // );
        return null;
    }

    return (
        <div>
            <div className="flex flex-row items-center justify-center space-x-2">
                <div className="text-yellow-500">
                    <TriangleAlert className="h-4 w-4" />
                </div>
                <h1 className="text-sm font-semibold text-primary">
                    Conflicting Bookings Found
                </h1>
            </div>
            <div className="space-y-2">
                {conflictingBookings
                    .map((booking, index) => {
                        return (
                            <div key={index}>
                                <div className="flex flex-row items-center justify-center text-sm space-x-2 border-2 border-red-400 rounded-md py-1">
                                    <span>{booking.email}</span>
                                    <span>{formatTimestamp(booking.startTimestamp, true, timezone)}</span>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ConflictingBookings;
