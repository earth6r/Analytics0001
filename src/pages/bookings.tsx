import AddAdditionalNotesDialog from "@/components/bookings/add-additional-notes-dialog";
// import CreateBookingDialog from "@/components/bookings/create-booking-dialog";
import DeleteBookingAlertDialog from "@/components/bookings/delete-booking-alert-dialog";
import ViewAdditionalNotesDialog from "@/components/bookings/view-additional-notes-dialog";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { cn, formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { ArrowUpDownIcon, User, X } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import MarkCompletedPostNotesDialog from "@/components/bookings/mark-completed-post-notes-dialog";
import { ZOOM_URL } from "./booking-details";
import { Badge } from "@/components/ui/badge";

const Bookings = () => {
    const [sortedData, setSortedData] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortKey, setSortKey] = useState<"email" | "type" | "startTimestamp" | "property" | "phoneNumber" | "endTimestamp">("startTimestamp");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterCompleted, setFilterCompleted] = useState<boolean>(false);

    const [notesOpens, setNotesOpens] = useState({});

    const router = useRouter();

    const { interval } = useInterval();
    const getBookings = api.bookings.getBookings.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    useEffect(() => {
        if (getBookings.data) {
            let sortedBookingsData = getBookings.data.sort((a: any, b: any) => {
                if (sortOrder === "asc") {
                    return a[sortKey] > b[sortKey] ? 1 : -1;
                } else {
                    return a[sortKey] < b[sortKey] ? 1 : -1;
                }
            });

            if (filterCompleted) {
                sortedBookingsData = sortedBookingsData.filter((booking: any) => !booking?.completed);
            }

            setSortedData(sortedBookingsData);
        }
    }, [getBookings.data, sortOrder, sortKey, filterCompleted]);

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

                <div className="flex flex-col items-start justify-start w-full">
                    <div className="flex flex-row items-center space-x-2 mt-4 w-full">
                        <Input
                            placeholder="Search bookings..."
                            className="w-full md:w-1/2 lg:w-1/4"
                            value={searchQuery}
                            disabled // TODO: remove this after fixing search
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
                        {!filterCompleted && <Button className="" onClick={
                            () => setFilterCompleted(true)
                        }>
                            Hide Completed
                        </Button>}
                    </div>
                    <div className="flex flex-row items-center space-x-2 mt-2">
                        {filterCompleted && (
                            <Badge
                                className="cursor-pointer"
                                onClick={
                                    () => setFilterCompleted(false)
                                }>
                                <div className="flex flex-row items-center space-x-2">
                                    <h1>Hide Completed</h1>
                                    <X className="w-4 h-4" />
                                </div>
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mt-4 hidden xl:block overflow-y-scroll">
                    <div className="grid grid-cols-8 gap-4 font-semibold">
                        <div className="flex flex-row items-center justify-start space-x-2 select-none col-span-2">
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
                        {/* <div className="flex flex-row items-center justify-start space-x-2 select-none">
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
                        </div> */}
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
                        <div className="col-span-3">Meeting Notes</div>
                    </div>

                    {getBookings.isLoading ? (
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                        </div>
                    ) : <div className="space-y-2 mt-4">
                        {sortedData?.map((booking: any) => (
                            <div key={booking.id} className="grid grid-cols-8 gap-4">
                                <div className="col-span-2">{booking.email || "No Email Provided"}</div>
                                {/* <div>{booking.type || "No Type Provided"}</div> */}
                                <div className="col-span-2">{formatTimestamp(booking.startTimestamp) || "No Start Timestamp Provided"}</div>
                                {/* <div>{booking.property || "No Property Type Provided"}</div> */}
                                <div>{booking.phoneNumber || "No Phone Number Provided"}</div>
                                {/* <pre className="col-span-3">
                                    {booking?.additionalNotes || "No Additional Notes Provided"}
                                </pre> */}
                                <div className="col-span-1">
                                    <ViewAdditionalNotesDialog booking={booking} getBookings={getBookings} />
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    {/* <AddAdditionalNotesDialog booking={booking} refetch={getBookings.refetch} open={
                                        // @ts-expect-error TODO: fix this
                                        notesOpens[booking.uid] || false
                                    } onOpenChange={
                                        (open: boolean) => {
                                            setNotesOpens({
                                                ...notesOpens,
                                                [booking.uid]: open,
                                            });
                                        }
                                    } /> */}
                                    {/* <ViewBookingDetailsDialog booking={booking} /> */}
                                    <Button variant="default" onClick={
                                        async () => await router.push(`/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`)
                                    } className="space-x-2">
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </Button>
                                    <div className={cn(booking?.completed ? "cursor-not-allowed" : "")}>
                                        <MarkCompletedPostNotesDialog booking={booking} getBooking={getBookings} />
                                    </div>
                                    <DeleteBookingAlertDialog booking={booking} refetch={getBookings.refetch} />
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>

                <div className="mt-4 block xl:hidden">
                    {getBookings.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-24" />
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {sortedData?.map((booking: any, index) => (
                                <BookingCard
                                    key={index}
                                    booking={booking}
                                    getBookings={getBookings}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface BookingCardProps {
    booking: any;
    getBookings: any;
}

const BookingCard = (props: BookingCardProps) => {
    const { booking, getBookings } = props;

    const router = useRouter();

    return (
        <Card key={booking.id} className={cn(booking?.completed ? "opacity-50 cursor-not-allowed select-none" : "")}>
            <CardHeader>
                <CardTitle className="truncate max-w-64">
                    {booking?.firstName || "No First Name Provided"} {booking?.lastName || "No Last Name Provided"}
                </CardTitle>
                <CardDescription>
                    {formatTimestamp(booking.startTimestamp)}
                </CardDescription>
            </CardHeader>
            <div className="flex flex-row items-center justify-between px-6">
                <div className="">
                    <h1 className="text-muted-foreground font-light">Join Meeting</h1>
                    <div className={cn("text-blue-400 truncate max-w-48", !booking?.completed && "cursor-pointer hover:text-blue-500")}>{ZOOM_URL}</div>
                </div>
                <div className="">
                    <h1 className="text-muted-foreground font-light">Status</h1>
                    <div className="">{(booking?.completed ? "completed" : "scheduled")}</div>
                </div>
            </div>
            <div className="px-6 flex flex-row items-center justify-between mt-10 space-x-2">
                <ViewAdditionalNotesDialog booking={booking} getBookings={getBookings} />
                <Button
                    variant="default"
                    className="w-full space-x-2"
                    onClick={
                        async () => await router.push(`/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`)
                    }>
                    <User className="w-4 h-4" />
                    <div>
                        Profile
                    </div>
                </Button>
                {/* <div className="flex flex-row items-center justify-between">
                    <AddAdditionalNotesDialog booking={booking} refetch={getBookings.refetch} open={
                        notesOpens[booking.uid] || false
                    } onOpenChange={
                        (open: boolean) => {
                            setNotesOpens({
                                ...notesOpens,
                                [booking.uid]: open,
                            });
                        }
                    } />
                </div> */}
            </div>
            <div className={cn("px-6 mt-2", booking?.completed ? "pb-4" : "pb-6")}>
                {!booking?.completed && (
                    <MarkCompletedPostNotesDialog booking={booking} getBooking={getBookings} />
                )}
            </div>
        </Card>
    );
};

export default Bookings;
