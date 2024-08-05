import CreateBookingDialog from "@/components/bookings/create-booking-dialog";
import FilterStatusMultiSelect from "@/components/bookings/filter-status-multi-select";
import MarkCompletedPostNotesDialog from "@/components/bookings/mark-completed-post-notes-dialog";
import RescheduleBookingDialog from "@/components/bookings/reschedule-booking-dialog";
import StatusSelect from "@/components/bookings/status-select";
import ViewAdditionalNotesDialog from "@/components/bookings/view-additional-notes-dialog";
import Header from "@/components/common/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInterval } from "@/contexts/IntervalContext";
import { useUser } from "@/contexts/UserContext";
import { cn, formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { ArrowUpDownIcon, User, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ZOOM_URL } from "./booking-details";

const Bookings = () => {
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<
    | "email"
    | "type"
    | "startTimestamp"
    | "property"
    | "phoneNumber"
    | "endTimestamp"
  >("startTimestamp");
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
  const getBookings = api.bookings.getBookings.useQuery(undefined, {
    refetchInterval: interval,
  });
  const updateBookingStatus = api.bookings.updateBookingStatus.useMutation();
  const updateUserBookingStatusFilters =
    api.userSettings.updateUserBookingStatusFilters.useMutation();
  const getUserSettings = api.userSettings.getUserSettings.useQuery(
    {
      email: email as string,
    },
    {
      enabled: !!email,
    },
  );
  console.log("this rocks");
  const [filterStatus, setFilterStatus] = useState<string[]>([
    "completed",
    "scheduled",
    "cancelled",
    "no-show",
    "confirmed",
    "rescheduled",
  ]);

  useEffect(() => {
    if (
      !getUserSettings.isLoading &&
      getUserSettings.data !== undefined &&
      getUserSettings.data !== null
    ) {
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

        <div className="flex w-full flex-col items-start justify-start">
          <div className="mt-4 flex w-full flex-row items-center space-x-2">
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
                  return (
                    booking.email
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    booking.type
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    booking.startTimestamp
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    booking.endTimestamp
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    booking?.property
                      ?.toLowerCase()
                      ?.includes(searchQuery.toLowerCase()) ||
                    booking.phoneNumber
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  );
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
                setFilterStatus(
                  filterStatus.filter((status) => status !== value),
                );
                await updateUserBookingStatusFilters.mutateAsync({
                  email: email as string,
                  statusFilters: filterStatus.filter(
                    (status) => status !== value,
                  ),
                });
                await getUserSettings.refetch();
              }}
            />
          </div>
          <div className="flex min-h-8 flex-row items-center">
            {filterStatus.length > 0 && !getUserSettings.isLoading && (
              <div className="flex flex-row flex-wrap items-center">
                {filterStatus.map((status) => (
                  <div key={status} className="p-1">
                    <Badge
                      className="cursor-pointer select-none"
                      onClick={async () => {
                        setFilterStatus(
                          filterStatus.filter((s) => s !== status),
                        );
                        await updateUserBookingStatusFilters.mutateAsync({
                          email: email as string,
                          statusFilters: filterStatus.filter(
                            (s) => s !== status,
                          ),
                        });
                        await getUserSettings.refetch();
                      }}
                    >
                      <div className="flex flex-row items-center space-x-2">
                        <h1>{status}</h1>
                        <X className="h-4 w-4" />
                      </div>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 hidden overflow-y-scroll xl:block">
          <div className="grid grid-cols-9 gap-4 font-semibold">
            <div className="col-span-2 flex select-none flex-row items-center justify-start space-x-2">
              <h1>Profile</h1>
              <div
                className="rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  if (sortKey === "email") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortKey("email");
                  }
                }}
              >
                <ArrowUpDownIcon className="h-4 w-4" />
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
            <div className="col-span-2 flex select-none flex-row items-center justify-start space-x-2">
              <h1>Meeting Time</h1>
              <div
                className="rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  if (sortKey === "startTimestamp") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortKey("startTimestamp");
                  }
                }}
              >
                <ArrowUpDownIcon className="h-4 w-4" />
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
            <div className="flex select-none flex-row items-center justify-start space-x-2">
              <h1>Phone Number</h1>
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
            <div className="select-none">Status</div>
            <div className="col-span-3 select-none">Meeting Notes</div>
          </div>

          {getBookings.isLoading ? (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {sortedData?.map((booking: any) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-9 items-center gap-4"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="col-span-2 flex cursor-pointer flex-row items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={async () =>
                            await router.push(
                              `/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`,
                            )
                          }
                        >
                          <div>
                            <Avatar className="h-10 w-10 rounded-lg border">
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
                              {booking.firstName || "No First Name Provided"}{" "}
                              {booking.lastName || "No Last Name Provided"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.email || "No Email Provided"}
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-row items-center space-x-4 p-1">
                          <div>
                            {/* TODO: make this a component and reuse above's component and make className a prop b/c above is different class */}
                            <Avatar className="h-24 w-24 rounded-lg border">
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
                              {booking.firstName || "No First Name Provided"}{" "}
                              {booking.lastName || "No Last Name Provided"}
                            </div>
                            <div className="text-md text-muted-foreground">
                              {booking.email || "No Email Provided"}
                            </div>
                            <div
                              className="mt-2 cursor-pointer rounded-lg border border-muted-foreground p-1 text-muted-foreground hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
                              onClick={async () =>
                                await router.push(
                                  `/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`,
                                )
                              }
                            >
                              <div className="flex flex-row items-center justify-center space-x-2">
                                <User className="h-4 w-4" />
                                <h1>View Profile</h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* <div>{booking.type || "No Type Provided"}</div> */}
                  <div className="col-span-2">
                    {formatTimestamp(booking.startTimestamp) ||
                      "No Start Timestamp Provided"}
                  </div>
                  {/* <div>{booking.property || "No Property Type Provided"}</div> */}
                  <div
                    className={cn(
                      booking.phoneNumber ? "" : "mr-5 text-center",
                    )}
                  >
                    {booking.phoneNumber || "-"}
                  </div>
                  {/* <pre className="col-span-3">
                                    {booking?.additionalNotes || "No Additional Notes Provided"}
                                </pre> */}
                  <StatusSelect
                    value={booking?.status ? booking.status : "scheduled"}
                    onChange={async (value: string) => {
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
                    }}
                    loading={loadingsForStatuses[booking.uid] || false}
                    booking={booking}
                  />
                  <div className="col-span-1">
                    <ViewAdditionalNotesDialog
                      booking={booking}
                      getBookings={getBookings}
                    />
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
                    <Button
                      variant="default"
                      onClick={async () =>
                        await router.push(
                          `/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`,
                        )
                      }
                      className="flex flex-row items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <div className="select-none">Profile</div>
                    </Button>
                    <div
                      className={
                        booking?.status === "completed"
                          ? "cursor-not-allowed"
                          : ""
                      }
                    >
                      <RescheduleBookingDialog
                        booking={booking}
                        refetchBookings={getBookings.refetch}
                      />
                    </div>
                    <div
                      className={cn(
                        booking?.status === "completed"
                          ? "cursor-not-allowed"
                          : "",
                      )}
                    >
                      <MarkCompletedPostNotesDialog
                        booking={booking}
                        getBooking={getBookings}
                      />
                    </div>
                    {/* <DeleteBookingAlertDialog booking={booking} refetch={getBookings.refetch} /> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 block xl:hidden">
          {getBookings.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-24" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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
    <Card
      key={booking.id}
      className={cn(
        booking?.status === "completed"
          ? "cursor-not-allowed select-none opacity-50"
          : "",
      )}
    >
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          <div className="max-w-64 truncate">
            {booking?.firstName || "No First Name Provided"}{" "}
            {booking?.lastName || "No Last Name Provided"}
          </div>
          {/* <div>
                        <DeleteBookingAlertDialog booking={booking} refetch={getBookings.refetch} triggerOverride={
                            <Trash2 className="w-4 h-4" />
                        } />
                    </div> */}
          {booking?.status === "rescheduled" && (
            <Badge
              variant="default"
              className="select-none hover:bg-black dark:hover:bg-white"
            >
              rescheduled
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {formatTimestamp(booking.startTimestamp)}
        </CardDescription>
      </CardHeader>
      <div className="flex flex-row items-center justify-between px-6">
        <div className="">
          <h1 className="font-light text-muted-foreground">Join Meeting</h1>
          <div
            className={cn(
              "max-w-32 truncate text-blue-500 md:max-w-48",
              booking?.status === "completed"
                ? "cursor-not-allowed"
                : "cursor-pointer hover:text-blue-400",
            )}
            onClick={() => {
              if (booking?.status !== "completed")
                window.open(ZOOM_URL, "_blank");
            }}
          >
            {ZOOM_URL}
          </div>
        </div>
        <div className="">
          <h1 className="font-light text-muted-foreground">Status</h1>
          {/* <div className="">{(booking?.completed ? "completed" : "scheduled")}</div> */}
          <StatusSelect
            value={booking?.status ? booking.status : "scheduled"}
            onChange={async (value: string) => {
              if (!value) return;
              setStatusLoading(true);
              await updateBookingStatus.mutateAsync({
                uid: booking.uid,
                status: value,
                bookingType: booking.type,
              });
              await getBookings.refetch();
              setStatusLoading(false);
            }}
            loading={statusLoading}
            booking={booking}
          />
        </div>
      </div>
      <div className="mt-10 flex flex-row items-center justify-between space-x-2 px-6">
        <ViewAdditionalNotesDialog
          booking={booking}
          getBookings={getBookings}
        />
        <Button
          variant="default"
          className="w-full space-x-2"
          onClick={async () =>
            await router.push(
              `/booking-details?email=${booking.email}&type=${booking.type}&uid=${booking.uid}`,
            )
          }
        >
          <User className="h-4 w-4" />
          <div>Profile</div>
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
      <div
        className={cn(
          "mt-2 px-6",
          booking?.status === "completed" ? "pb-0" : "pb-2",
        )}
      >
        {booking?.status !== "completed" && (
          <MarkCompletedPostNotesDialog
            booking={booking}
            getBooking={getBookings}
          />
        )}
      </div>
      <div className="px-6 pb-6">
        <RescheduleBookingDialog
          booking={booking}
          refetchBookings={getBookings.refetch}
        />
      </div>
    </Card>
  );
};

export default Bookings;
