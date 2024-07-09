import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";
import Header from "@/components/common/header";
import Spinner from "@/components/common/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

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
                    <CircularQuestionMarkTooltip label="secret page for now" />
                </div>

                {/* <div>
                    {JSON.stringify(getUserDetails.data, null, 2)}
                </div> */}

                <div>
                    Email: {getUserDetails.data?.user?.email}
                </div>
                <div>
                    Created At: {getUserDetails.data?.user?.createdAt?._seconds}
                </div>
                <div>
                    userBuyingPropertyType: {getUserDetails.data?.user?.userBuyingPropertyType}
                </div>
                <div>
                    firstName: {getUserDetails.data?.user?.firstName}
                </div>
                <div>
                    lastName: {getUserDetails.data?.user?.lastName}
                </div>
                <div>
                    UID: {getUserDetails.data?.UID}
                </div>
                <div>
                    {/* @ts-expect-error TODO: fix type */}
                    phoneCallBookings: {JSON.stringify(getUserDetails.data?.phoneCallBookings, null, 2)}
                </div>
                <div>
                    {/* @ts-expect-error TODO: fix type */}
                    buyingProgress: {JSON.stringify(getUserDetails.data?.buyingProgress, null, 2)}
                </div>
                <div>
                    {/* @ts-expect-error TODO: fix type */}
                    messages: {JSON.stringify(getUserDetails.data?.messages, null, 2)}
                </div>
                <div>
                    {/* @ts-expect-error TODO: fix type */}
                    register: {JSON.stringify(getUserDetails.data?.register, null, 2)}
                </div>

                {/* TODO: add some linking i.e. register property of interest <=> user Property buying progress property type (there's a difference and stats about how many users have same vs different properties from register to userbuyingprogress)*/}

                <div>
                    {getUserDetails.isLoading && <Skeleton className="h-10" />}
                </div>
            </div>
        </div>
    );
};

export default User;
