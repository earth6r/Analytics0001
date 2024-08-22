import BookingsOverTime from "./charts/bookings-over-time";
import CompletedBookingsOverTime from "./charts/completed-over-time";
import NoShowBookingsOverTime from "./charts/no-show-over-time";
import CancelledBookings from "./stat-cards/cancelled-bookings";
import CompletedBookings from "./stat-cards/completed-bookings";
import NoShowBookings from "./stat-cards/no-show-bookings";
import PendingBookings from "./stat-cards/pending-bookings";

const BookingsMetrics = () => {
    return (
        <div>
            {/* TODO: remove mt-... and figure out how to make it so each tab has same mt as register tab */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-[-16px]">
                <CompletedBookings />
                <CancelledBookings />
                <NoShowBookings />
                <PendingBookings />
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-center md:items-center md:justify-normal space-y-6 md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/3">
                    <BookingsOverTime />
                </div>
                <div className="w-full md:w-1/3">
                    <CompletedBookingsOverTime />
                </div>
                <div className="w-full md:w-1/3">
                    <CancelledBookings />
                    <NoShowBookingsOverTime />
                </div>
            </div>
        </div>
    );
};

export default BookingsMetrics;
