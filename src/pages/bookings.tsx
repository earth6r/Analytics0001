import CreateBookingDialog from "@/components/bookings/create-booking-dialog";
import Header from "@/components/common/header";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import React from "react";
import { useState } from "react";

const Bookings = () => {
    const [open, setOpen] = useState(false);

    const { interval } = useInterval();
    const getBookings = api.bookings.getBookings.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-4xl font-bold">Bookings</h1>
                    <CreateBookingDialog
                        open={open}
                        onOpenChange={setOpen}
                        refetch={getBookings.refetch}
                    />
                </div>
                {/* table of bookings using grid. Email, Type of Booking, Timestamp, Property Type */}
                <div className="mt-4">
                    <div className="grid grid-cols-4 gap-4 font-semibold">
                        <div>Email</div>
                        <div>Type of Booking</div>
                        <div>Timestamp</div>
                        <div>Property Type</div>
                    </div>

                    <div className="space-y-2 mt-4  ">
                        {getBookings.data?.map((booking: any) => (
                            <div key={booking.id} className="grid grid-cols-4 gap-4">
                                <div>{booking.email || "No Email Provided"}</div>
                                <div>{booking.type || "No Type Provided"}</div>
                                <div>{booking.timestamp || "No Timestamp Provided"}</div>
                                <div>{booking.property || "No Property Type Provided"}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
