import CreateBookingDialog from "@/components/bookings/create-booking-dialog";
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
import { ArrowUpDownIcon, CalendarClock, Trash2, User, X } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import MarkCompletedPostNotesDialog from "@/components/bookings/mark-completed-post-notes-dialog";
import { ZOOM_URL } from "./booking-details";
import { Badge } from "@/components/ui/badge";
import StatusSelect from "@/components/bookings/status-select";
import FilterStatusMultiSelect from "@/components/bookings/filter-status-multi-select";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RescheduleDialog from "@/components/bookings/reschedule-dialog";

const Bookings = () => {
    const [sortedData, setSortedData] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortKey, setSortKey] = useState<"email" | "type" | "startTimestamp" | "property" | "phoneNumber" | "endTimestamp">("startTimestamp");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingsForStatuses, setLoadingsForStatuses] = useState<any>({});

    const [open, setOpen] = useState(false);
    const { email } = useUser();

    useEffect(() => {
        // TODO: change this logic to be completely from useUser
        const authenticatedData = JSON.parse(
            localStorage.getItem("authenticated") ?? "{}",
        );
        if (
            !authenticatedData.authenticated ||
            authenticatedData.expires < new Date().getTime() ||
            !localStorage.getItem("email")
        ) {
            window.location.href = "/";
        }
    }, [email]);

    const router = useRouter();

    const { interval } = useInterval();
    const getBookings = api.bookings.getBookings.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );
    const updateBookingStatus = api.bookings.updateBookingStatus.useMutation();
    const updateUserBookingStatusFilters = api.userSettings.updateUserBookingStatusFilters.useMutation();
    const getUserSettings = api.userSettings.getUserSettings.useQuery({
        email: email as string,
    }, {
        enabled: !!email,
    });

    const [filterStatus, setFilterStatus] = useState<string[]>([
        "completed",
        "scheduled",
        "cancelled",
        "no-show",
        "confirmed",
        "rescheduled",
    ]);

    useEffect(() => {
        if (!getUserSettings.isLoading && getUserSettings.data !== undefined && getUserSettings.data !== null) {
            setFilterStatus(getUserSettings.data.statusFilters);
        }
    }, [getUserSettings.data, getUserSettings.isLoading]);

    // TODO: make the endpoint sorted by the default below so it does not change once loaded
    useEffect(() => {
        if (getBookings.data) {
            let sortedBookingsData = getBookings.data.sort((a: any, b: any) => {
                if (sortOrder === "asc") {
                    return a[sortKey] > b[sortKey] ? 1 : -1;
                } else {
                    return a[sortKey] < b[sortKey] ? 1 : -1;
                }
            });

            sortedBookingsData = sortedBookingsData.filter((booking: any) => {
                if (filterStatus.includes(booking?.status || "scheduled")) {
                    return true;
                }
                return false;
            });

            setSortedData(sortedBookingsData);
        }
    }, [getBookings.data, sortOrder, sortKey, filterStatus]);

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-4xl font-bold">Bookings</h1>
                    {/* TODO: uncomment after fixing this */}
                    <CreateBookingDialog
                        open={open}
                        onOpenChange={setOpen}
                        refetch={getBookings.refetch}
                    />
                </div>

                <div className="flex flex-col items-start justify-start w-full">
                    <div className="flex flex-row items-center space-x-2 mt-4 w-full">
                        <Input
                            placeholder="Search bookings..."
                            className="w-full lg:w-1/4"
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
                        <FilterStatusMultiSelect
                            values={filterStatus}
                            addValue={async (value: string) => {
                                setFilterStatus([...filterStatus, value]);
                                await updateUserBookingStatusFilters.mutateAsync({
                                    email: email as string,
                                    statusFilters: [...filterStatus, value],
                                });
                                await getUserSettings.refetch();
                            }}
                            removeValue={async (value: string) => {
                                setFilterStatus(filterStatus.filter((status) => status !== value));
                                await updateUserBookingStatusFilters.mutateAsync({
                                    email: email as string,
                                    statusFilters: filterStatus.filter((status) => status !== value),
                                });
                                await getUserSettings.refetch();
                            }}
                        />
                    </div>
                    <div className="flex flex-row items-center min-h-8">
                        {filterStatus.length > 0 && !getUserSettings.isLoading && (
                            <div className="flex flex-row items-center flex-wrap">
                                {filterStatus.map((status) => (
                                    <div key={status} className="p-1">
                                        <Badge
                                            className="cursor-pointer select-none"
                                            onClick={
                                                async () => {
                                                    setFilterStatus(filterStatus.filter((s) => s !== status));
                                                    await updateUserBookingStatusFilters.mutateAsync({
                                                        email: email as string,
                                                        statusFilters: filterStatus.filter((s) => s !== status),
                                                    });
                                                    await getUserSettings.refetch();
                                                }
                                            }>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    {status}
                                                </h1>
                                                <X className="w-4 h-4" />
                                            </div>
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 hidden xl:block overflow-y-scroll">
                    <div className="grid grid-cols-9 gap-4 font-semibold">
                        <div className="flex flex-row items-center justify-start space-x-2 select-none col-span-2">
                            <h1>
                                Profile
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
                            {/* <div className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg" onClick={
                                () => {
                                    if (sortKey === "phoneNumber") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("phoneNumber");
                                    }
                                }
                            }>
                                <ArrowUpDownIcon className="w-4 h-4" />
                            </div> */}
                        </div>
                        <div className="select-none">
                            Status
                        </div>
                        <div className="col-span-3 select-none">Meeting Notes</div>
                    </div>

                    {getBookings.isLoading ? (
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                        </div>
                    ) : <div className="space-y-4 mt-4">
                        {sortedData?.map((booking: any) => (
                            <div key={booking.id} className="grid grid-cols-9 gap-4 items-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="col-span-2 flex flex-row items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2"
                                                onClick={
                                                    async () => await router.push(`/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`)
                                                }
                                            >
                                                <div>
                                                    <Avatar className="h-10 w-10 rounded-lg">
                                                        <AvatarImage
                                                            src={booking?.imageUrl}
                                                            alt="@user"
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div>
                                                    <div>
                                                        {booking.firstName || "No First Name Provided"} {booking.lastName || "No Last Name Provided"}
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {booking.email || "No Email Provided"}
                                                    </div>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="flex flex-row items-center space-x-4 p-1">
                                                <div>
                                                    <Avatar className="h-24 w-24 rounded-lg">
                                                        <AvatarImage
                                                            src={booking?.imageUrl}
                                                            alt="@user"
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div>
                                                    <div className="text-lg">
                                                        {booking.firstName || "No First Name Provided"} {booking.lastName || "No Last Name Provided"}
                                                    </div>
                                                    <div className="text-muted-foreground text-md">
                                                        {booking.email || "No Email Provided"}
                                                    </div>
                                                    <div
                                                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground border border-muted-foreground rounded-lg p-1 mt-2"
                                                        onClick={
                                                            async () => await router.push(`/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`)
                                                        }
                                                    >
                                                        <div className="flex flex-row items-center justify-center space-x-2">
                                                            <User className="w-4 h-4" />
                                                            <h1>View Profile</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {/* <div>{booking.type || "No Type Provided"}</div> */}
                                <div className="col-span-2">{formatTimestamp(booking.startTimestamp) || "No Start Timestamp Provided"}</div>
                                {/* <div>{booking.property || "No Property Type Provided"}</div> */}
                                <div className={cn(booking.phoneNumber ? "" : "text-center mr-5")}>{booking.phoneNumber || "-"}</div>
                                {/* <pre className="col-span-3">
                                    {booking?.additionalNotes || "No Additional Notes Provided"}
                                </pre> */}
                                <StatusSelect value={booking?.status ? booking.status : "scheduled"} onChange={
                                    async (value: string) => {
                                        if (!value) return;
                                        setLoadingsForStatuses({
                                            ...loadingsForStatuses,
                                            [booking.uid]: true,
                                        });
                                        await updateBookingStatus.mutateAsync({
                                            uid: booking.uid,
                                            status: value,
                                            bookingType: booking.type,
                                        });
                                        await getBookings.refetch();
                                        setLoadingsForStatuses({
                                            ...loadingsForStatuses,
                                            [booking.uid]: false,
                                        });
                                    }
                                }
                                    loading={loadingsForStatuses[booking.uid] || false}
                                    booking={booking}
                                />
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
                                    } className="flex flex-row items-center space-x-2">
                                        <User className="w-4 h-4" />
                                        <div className="select-none">Profile</div>
                                    </Button>
                                    <div className={booking?.status === "completed" ? "cursor-not-allowed" : ""}>
                                        <RescheduleDialog booking={booking} refetchBookings={getBookings.refetch} />
                                    </div>
                                    <div className={cn(booking?.status === "completed" ? "cursor-not-allowed" : "")}>
                                        <MarkCompletedPostNotesDialog booking={booking} getBooking={getBookings} />
                                    </div>
                                    {/* <DeleteBookingAlertDialog booking={booking} refetch={getBookings.refetch} /> */}
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
    const [statusLoading, setStatusLoading] = useState<boolean>(false);
    const updateBookingStatus = api.bookings.updateBookingStatus.useMutation();

    return (
        <Card key={booking.id} className={cn(booking?.status === "completed" ? "opacity-50 cursor-not-allowed select-none" : "")}>
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <div className="truncate max-w-64">
                        {booking?.firstName || "No First Name Provided"} {booking?.lastName || "No Last Name Provided"}
                    </div>
                    {/* <div>
                        <DeleteBookingAlertDialog booking={booking} refetch={getBookings.refetch} triggerOverride={
                            <Trash2 className="w-4 h-4" />
                        } />
                    </div> */}
                    {booking?.status === "rescheduled" && <Badge variant="default" className="select-none hover:bg-black dark:hover:bg-white">
                        rescheduled
                    </Badge>}
                </CardTitle>
                <CardDescription>
                    {formatTimestamp(booking.startTimestamp)}
                </CardDescription>
            </CardHeader>
            <div className="flex flex-row items-center justify-between px-6">
                <div className="">
                    <h1 className="text-muted-foreground font-light">Join Meeting</h1>
                    <div className={cn("text-blue-500 truncate max-w-32 md:max-w-48", booking?.status === "completed" ? "cursor-not-allowed" : "hover:text-blue-400 cursor-pointer")} onClick={
                        () => {
                            if (booking?.status !== "completed")
                                window.open(ZOOM_URL, "_blank")
                        }
                    }
                    >{ZOOM_URL}</div>
                </div>
                <div className="">
                    <h1 className="text-muted-foreground font-light">Status</h1>
                    {/* <div className="">{(booking?.completed ? "completed" : "scheduled")}</div> */}
                    <StatusSelect value={booking?.status ? booking.status : "scheduled"} onChange={
                        async (value: string) => {
                            if (!value) return;
                            setStatusLoading(true);
                            await updateBookingStatus.mutateAsync({
                                uid: booking.uid,
                                status: value,
                                bookingType: booking.type,
                            });
                            await getBookings.refetch();
                            setStatusLoading(false);
                        }
                    }
                        loading={statusLoading}
                        booking={booking}
                    />
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
            <div className={cn("px-6 mt-2", booking?.status === "completed" ? "pb-0" : "pb-2")}>
                {booking?.status !== "completed" && (
                    <MarkCompletedPostNotesDialog booking={booking} getBooking={getBookings} />
                )}
            </div>
            <div className="px-6 pb-6">
                <RescheduleDialog booking={booking} refetchBookings={getBookings.refetch} />
            </div>
        </Card>
    );
};

export default Bookings;
