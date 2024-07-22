import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";
import Header from "@/components/common/header";
import Spinner from "@/components/common/spinner";
import CopyTooltip from "@/components/customers/copy-tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileCard from "@/components/user/user-profile-card";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { PhoneIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

interface BookingCardProps {
}

const BookingCard = (props: BookingCardProps) => {
    const { } = props;

    return (
        <div className="border rounded-xl p-6">
            <h1 className="text-4xl font-semibold">Call with John Doe</h1>
            <div className="text-muted-foreground font-light">July 15, 2023 - 10:00 AM</div>

            <div className="flex flex-row items-center justify-between mt-10">
                <div>
                    <div className="text-muted-foreground font-light">Duration</div>
                    <div>30 minutes</div>
                </div>

                <div>
                    <div className="text-muted-foreground font-light">Scheduled By</div>
                    <div>Jane Smith</div>
                </div>
            </div>

            <Button variant="outline" className="mt-10">
                <PhoneIcon className="w-5 h-5 mr-2" />
                Call Now
            </Button>
        </div>
    );
};

const User = () => {
    const router = useRouter();
    const { interval } = useInterval();

    const { email = null } = router.query;

    const [routeLoading, setRouteLoading] = useState(false);

    const getUserDetails = api.user.getUserDetails.useQuery({
        // @ts-expect-error TODO: fix type
        email,
    }, {
        enabled: !!email,
        refetchInterval: interval,
    });

    const handleClick = async () => {
        setRouteLoading(true);
        await router.push("/stats");
        setRouteLoading(false);
    }

    if (!email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center cursor-pointer" onClick={handleClick}>
                <h1>Missing email in request query</h1>
                {routeLoading ? <Spinner /> : <h2 className="text-blue-400 hover:text-blue-500">Back to Dashboard</h2>}
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center space-x-2">
                    <h1 className="text-4xl font-bold">User Details</h1>
                </div>

                <UserProfileCard
                    email={getUserDetails.data?.user?.email}
                    firstName={getUserDetails.data?.user?.firstName}
                    lastName={getUserDetails.data?.user?.lastName}
                    createdAt={getUserDetails.data?.user?.createdAt?._seconds}
                    propertyType={getUserDetails.data?.user?.userBuyingPropertyType}
                />

                <hr className="my-4" />

                <div>
                    {/* @ts-expect-error TODO: fix type */}
                    phoneCallBookings: {JSON.stringify(getUserDetails.data?.phoneCallBookings, null, 2)}
                </div>

                <div>
                    {
                        // @ts-expect-error TODO: fix type
                        getUserDetails.data?.phoneCallBookings.map(
                            (booking: any, index: number) => (
                                <div key={index}>
                                    <div>
                                        booking: {JSON.stringify(booking, null, 2)}
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>

                <hr className="my-4" />

                {getUserDetails.data?.phoneCallBookings && getUserDetails.data?.phoneCallBookings.length > 0 &&
                    <div className="border rounded-lg shadow p-6">
                        <div className="flex flex-row items-center justify-between">
                            {/* @ts-expect-error TODO: fix type */}
                            <h1 className="text-4xl font-bold">Phone Call Bookings ({getUserDetails.data?.buyingProgress.length})</h1>
                            <Button variant="outline" className="">
                                <PlusIcon className="w-5 h-5 mr-2" />
                                <h1>Add New Booking</h1>
                                {/* TODO: disable email field and make it readonly with default of email */}
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-4">
                            <BookingCard />
                            <BookingCard />
                            <BookingCard />
                        </div>
                    </div>}

                <div className="border rounded-xl p-4">
                    {
                        // @ts-expect-error TODO: fix type
                        getUserDetails.data?.buyingProgress.map(
                            (progress: any, index: number) => (
                                <div key={index} className="">
                                    <div>
                                        <div>Property Type: {progress.propertyType || "-"}</div>
                                        <div>Escrow Deposit: {typeof progress.escrowDeposit === "boolean" ? JSON.stringify(progress.escrowDeposit) : "-"}</div>
                                        <div>Full Payment: {typeof progress.fullPayment === "boolean" ? JSON.stringify(progress.fullPayment) : "-"}</div>
                                        <div>Schedule Closing: {typeof progress.scheduleClosing === "boolean" ? JSON.stringify(progress.scheduleClosing) : "-"}</div>
                                        <div>Completed: {typeof progress.completed === "boolean" ? JSON.stringify(progress.completed) : "-"}</div>
                                        <div>Download Documents: {typeof progress.downloadDocuments === "boolean" ? JSON.stringify(progress.downloadDocuments) : "-"}</div>
                                        <div>Created At: {progress.createdAt?._seconds || "-"}</div>
                                        <div>Scheduled Calendar Date: {progress?.scheduledCalendarDate || "-"}</div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>Payment Intent:</div>
                                            <CopyTooltip value={progress?.paymentIntent || "-"} />
                                        </div>
                                    </div>
                                    {/* @ts-expect-error TODO: fix type */}
                                    {index !== getUserDetails.data?.buyingProgress.length - 1 && <hr className="my-4" />}
                                </div>
                            )
                        )
                    }
                </div>

                <hr className="my-4" />

                <div>
                    {/* @ts-expect-error TODO: fix type */}
                    messages: {JSON.stringify(getUserDetails.data?.messages, null, 2)}
                </div>

                <hr className="my-4" />

                <div>
                    {/* @ts-expect-error TODO: fix type */}
                    register: {JSON.stringify(getUserDetails.data?.register, null, 2)}
                </div>

                <hr className="my-4" />

                {/* TODO: add some linking i.e. register property of interest <=> user Property buying progress property type (there's a difference and stats about how many users have same vs different properties from register to userbuyingprogress)*/}

                <div>
                    {getUserDetails.isLoading && <Skeleton className="h-10" />}
                </div>
            </div>
        </div>
    );
};

export default User;
