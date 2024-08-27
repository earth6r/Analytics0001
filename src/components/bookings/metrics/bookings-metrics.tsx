import { useState } from "react";
import BookingsOverTime from "./charts/bookings-over-time";
import CompletedBookingsOverTime from "./charts/completed-over-time";
import NoShowBookingsOverTime from "./charts/no-show-over-time";
import BookingsCount from "./stat-cards/bookings-count";
import CancelledBookings from "./stat-cards/cancelled-bookings";
import CompletedBookings from "./stat-cards/completed-bookings";
import NoShowBookings from "./stat-cards/no-show-bookings";
import PendingBookings from "./stat-cards/pending-bookings";
import moment from "moment";
import BookingsCounts from "./bookings-counts";

const BookingsMetrics = () => {
    // 0 to 1 month ago
    const [startDate,] = useState(moment.utc().subtract(1, 'month').toDate());
    const [endDate,] = useState(moment.utc().toDate());

    // 1-3 months ago
    const [startDateOneToThreeMonths,] = useState(moment.utc().subtract(3, 'months').toDate());
    const [endDateOneToThreeMonths,] = useState(moment.utc().subtract(1, 'months').toDate());

    // 3-6 months ago
    const [startDateThreeToSixMonths,] = useState(moment.utc().subtract(6, 'months').toDate());
    const [endDateThreeToSixMonths,] = useState(moment.utc().subtract(3, 'months').toDate());

    // 6+ months ago
    const [startDateSixToTwelveMonths,] = useState(moment.utc().subtract(60, 'months').toDate()); // 5 years ago because we don't have data that old
    const [endDateSixToTwelveMonths,] = useState(moment.utc().subtract(6, 'months').toDate());

    return (
        <div>
            {/* TODO: remove mt-... and figure out how to make it so each tab has same mt as register tab */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-[-16px]">
                <CompletedBookings />
                <CancelledBookings />
                <NoShowBookings />
                <PendingBookings />

                {/* <BookingsCount
                    startDate={startDate}
                    endDate={endDate}
                    description={"Phone Call Bookings in the last month"}
                    type="Phone Call"
                />
                <BookingsCount
                    startDate={startDateOneToThreeMonths}
                    endDate={endDateOneToThreeMonths}
                    description={"Phone Call Bookings 1-3 months ago"}
                    type="Phone Call"
                />
                <BookingsCount
                    startDate={startDateThreeToSixMonths}
                    endDate={endDateThreeToSixMonths}
                    description={"Phone Call Bookings 3-6 months ago"}
                    type="Phone Call"
                />
                <BookingsCount
                    startDate={startDateSixToTwelveMonths}
                    endDate={endDateSixToTwelveMonths}
                    description={"Phone Call Bookings 6+ months ago"}
                    type="Phone Call"
                /> */}

                {/* <BookingsCount
                    startDate={startDate}
                    endDate={endDate}
                    description={"Property Tour Bookings in the last month"}
                    type="Property Tour"
                />
                <BookingsCount
                    startDate={startDateOneToThreeMonths}
                    endDate={endDateOneToThreeMonths}
                    description={"Property Tour Bookings 1-3 months ago"}
                    type="Property Tour"
                />
                <BookingsCount
                    startDate={startDateThreeToSixMonths}
                    endDate={endDateThreeToSixMonths}
                    description={"Property Tour Bookings 3-6 months ago"}
                    type="Property Tour"
                />
                <BookingsCount
                    startDate={startDateSixToTwelveMonths}
                    endDate={endDateSixToTwelveMonths}
                    description={"Property Tour Bookings 6+ months ago"}
                    type="Property Tour"
                /> */}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <BookingsCounts bookingType="Phone Call" />
                <BookingsCounts bookingType="Property Tour" />
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-center md:items-center md:justify-normal space-y-6 md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/3">
                    <BookingsOverTime />
                </div>
                <div className="w-full md:w-1/3">
                    <CompletedBookingsOverTime />
                </div>
                <div className="w-full md:w-1/3">
                    <NoShowBookingsOverTime />
                </div>
            </div>
        </div>
    );
};

export default BookingsMetrics;
