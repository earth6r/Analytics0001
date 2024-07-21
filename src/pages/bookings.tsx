import AddAdditionalNotesDialog from "@/components/bookings/add-additional-notes-dialog";
// import CreateBookingDialog from "@/components/bookings/create-booking-dialog";
import DeleteBookingAlertDialog from "@/components/bookings/delete-booking-alert-dialog";
import ViewAdditionalNotesDialog from "@/components/bookings/view-additional-notes-dialog";
import ViewBookingDetailsDialog from "@/components/bookings/view-booking-details-dialog";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { ArrowUpDownIcon, PhoneIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";

const formatTimestampBookingCard = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${month} ${day}, ${year} - ${formattedHours}:${formattedMinutes} ${ampm}`;
};


const Bookings = () => {
    const [open, setOpen] = useState(false);
    const [sortedData, setSortedData] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortKey, setSortKey] = useState<"email" | "type" | "startTimestamp" | "property" | "phoneNumber" | "endTimestamp">("startTimestamp");
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

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-4xl font-bold">Bookings</h1>
                    {/* TODO: uncomment after fixing this */}
                    {/* <CreateBookingDialog
                        open={open}
                        onOpenChange={setOpen}
                        refetch={getBookings.refetch}
                    /> */}
                </div>

                <Input
                    placeholder="Search bookings..."
                    className="mt-4 w-full md:w-1/4"
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
                                booking.startTimestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                booking.endTimestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (booking?.property?.toLowerCase()?.includes(searchQuery.toLowerCase())) ||
                                booking.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
                        });
                        setSortedData(filteredData);
                    }}
                />

                <div className="mt-4 hidden xl:block overflow-y-scroll">
                    <div className="grid grid-cols-8 gap-4 font-semibold">
                        <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Email
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg" onClick={
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
                            <div className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg" onClick={
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
                        <div className="flex flex-row items-center justify-start space-x-2 select-none col-span-2">
                            <h1>
                                Meeting Time
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg" onClick={
                                () => {
                                    if (sortKey === "startTimestamp") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("startTimestamp");
                                    }
                                }
                            }>
                                <ArrowUpDownIcon className="w-4 h-4" />
                            </div>
                        </div>
                        {/* <div>Property Type</div> */}
                        {/* <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Property Type
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg" onClick={
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
                        </div> */}
                        <div className="flex flex-row items-center justify-start space-x-2 select-none">
                            <h1>
                                Phone Number
                            </h1>
                            <div className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg" onClick={
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
                        <div className="col-span-3">Call Notes</div>
                    </div>

                    {getBookings.isLoading ? (
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                            <Skeleton className="h-8" />
                        </div>
                    ) : <div className="space-y-2 mt-4">
                        {sortedData?.map((booking: any) => (
                            <div key={booking.id} className="grid grid-cols-8 gap-4">
                                <div>{booking.email || "No Email Provided"}</div>
                                <div>{booking.type || "No Type Provided"}</div>
                                <div className="col-span-2">{formatTimestamp(booking.startTimestamp) || "No Start Timestamp Provided"}</div>
                                {/* <div>{booking.property || "No Property Type Provided"}</div> */}
                                <div>{booking.phoneNumber || "No Phone Number Provided"}</div>
                                {/* <pre className="col-span-3">
                                    {booking?.additionalNotes || "No Additional Notes Provided"}
                                </pre> */}
                                <div className="col-span-1">
                                    <ViewAdditionalNotesDialog notes={booking?.additionalNotes} />
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <AddAdditionalNotesDialog booking={booking} refetch={getBookings.refetch} />
                                    <ViewBookingDetailsDialog booking={booking} />
                                    <DeleteBookingAlertDialog booking={booking} refetch={getBookings.refetch} />
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>

                <div className="mt-4 block xl:hidden">
                    {getBookings.isLoading ? (
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-8" />
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedData?.map((booking: any) => (
                                <Card key={booking.id} className="">
                                    <CardHeader>
                                        <CardTitle className="truncate max-w-64">
                                            {booking.type === "Property Tour" ? "Property Tour" : "Call"} with {booking.firstName || "No First Name Provided"} {booking.lastName || "No Last Name Provided"}
                                        </CardTitle>
                                        <CardDescription>
                                            {formatTimestampBookingCard(booking.startTimestamp)}
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="flex flex-row items-center justify-between px-6">
                                        <div className="">
                                            <h1 className="text-muted-foreground font-light">Duration</h1>
                                            <div className="">{(booking?.endTimestamp - booking?.startTimestamp) / (60 * 1000) + " minutes" || "No duration set"}</div>
                                        </div>
                                        <div className="">
                                            <h1 className="text-muted-foreground font-light">Scheduled By</h1>
                                            <div className="max-w-48 truncate">{(booking?.firstName + " " + booking?.lastName)}</div>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6 flex flex-row items-center justify-between mt-10 space-x-2">
                                        <div className="flex flex-row items-center justify-center space-x-4">
                                            <Button variant="outline" className="w-full" onClick={
                                                () => {
                                                    window.location.href = `tel:${booking.phoneNumber}`;
                                                }
                                            }>
                                                <PhoneIcon className="w-5 h-5 mr-2" />
                                                Call now
                                            </Button>
                                            <ViewBookingDetailsDialog booking={booking} />
                                        </div>
                                        <div className="flex flex-row items-center justify-between">
                                            <AddAdditionalNotesDialog booking={booking} refetch={getBookings.refetch} />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
