import CreateBookingDialog from "@/components/bookings/create-booking-dialog";
import Header from "@/components/common/header";
import { Input } from "@/components/ui/input";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useState } from "react";

const Bookings = () => {
    const [open, setOpen] = useState(false);
    const [sortedData, setSortedData] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortKey, setSortKey] = useState<"email" | "type" | "timestamp" | "property" | "phoneNumber">("timestamp");
    const [searchQuery, setSearchQuery] = useState<string>("");


    const { interval } = useInterval();
    const getBookings = api.bookings.getBookings.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    useEffect(() => {
        if (getBookings.data) {
            const sortedBookingsData = getBookings.data.sort((a: any, b: any) => {
                if (sortOrder === "asc") {
                    return a[sortKey] > b[sortKey] ? 1 : -1;
                } else {
                    return a[sortKey] < b[sortKey] ? 1 : -1;
                }
            });
            setSortedData(sortedBookingsData);
        }
    }, [getBookings.data, sortOrder, sortKey]);

    // useEffect(() => {
    //     alert("called")
    //     if (sortedData) {
    //         const filteredData = sortedData.filter((booking: any) => {
    //             return booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                 booking.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                 booking.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //                 (!booking?.property || booking?.property?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //                 booking.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
    //         });
    //         setSortedData(filteredData);
    //     }
    // }, [searchQuery, sortedData]);

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

                <Input
                    placeholder="Search bookings..."
                    className="mt-4 w-1/4"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        const searchQuery = e.target.value;

                        if (!searchQuery) {
                            // @ts-expect-error TODO: fix type
                            setSortedData(getBookings.data);
                            return;
                        }

                        const filteredData = sortedData.filter((booking: any) => {
                            return booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                booking.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                booking.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (booking?.property?.toLowerCase()?.includes(searchQuery.toLowerCase())) ||
                                booking.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
                        });
                        setSortedData(filteredData);
                    }}
                />

                <div className="mt-4">
                    <div className="grid grid-cols-5 gap-4 font-semibold">
                        <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Email
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 p-2 rounded-lg" onClick={
                                () => {
                                    if (sortKey === "email") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("email");
                                    }
                                }
                            }>
                                <ArrowUpDownIcon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Type of Booking
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 p-2 rounded-lg" onClick={
                                () => {
                                    if (sortKey === "type") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("type");
                                    }
                                }
                            }>
                                <ArrowUpDownIcon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Timestamp
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 p-2 rounded-lg" onClick={
                                () => {
                                    if (sortKey === "timestamp") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("timestamp");
                                    }
                                }
                            }>
                                <ArrowUpDownIcon className="w-4 h-4" />
                            </div>
                        </div>
                        {/* <div>Property Type</div> */}
                        <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Property Type
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 p-2 rounded-lg" onClick={
                                () => {
                                    if (sortKey === "property") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("property");
                                    }
                                }
                            }>
                                <ArrowUpDownIcon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Phone Number
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 p-2 rounded-lg" onClick={
                                () => {
                                    if (sortKey === "phoneNumber") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("phoneNumber");
                                    }
                                }
                            }>
                                <ArrowUpDownIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4  ">
                        {sortedData?.map((booking: any) => (
                            <div key={booking.id} className="grid grid-cols-5 gap-4">
                                <div>{booking.email || "No Email Provided"}</div>
                                <div>{booking.type || "No Type Provided"}</div>
                                <div>{booking.timestamp || "No Timestamp Provided"}</div>
                                <div>{booking.property || "No Property Type Provided"}</div>
                                <div>{booking.phoneNumber || "No Phone Number Provided"}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
