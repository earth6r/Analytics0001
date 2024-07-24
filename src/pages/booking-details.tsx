import Header from "@/components/common/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { ArrowLeftCircleIcon, Calendar, Mail, Phone, RocketIcon, Timer } from "lucide-react";
import { useRouter } from "next/router";
import AddImageToUserDialog from "@/components/bookings/add-image-to-user-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ZOOM_URL = "https://zoom.us/j/9199989063?pwd=RzhRMklXNWdJNGVKZjRkRTdkUmZOZz09";

const BookingDetails = () => {
    const router = useRouter();

    const { email, type, uid } = router.query;

    const bookingDetails = api.bookings.getBookingDetails.useQuery(
        {
            email: email as string,
            type: type as string,
            uid: uid as string,
        },
        {
            enabled: !!email && !!type && !!uid,
        }
    );

    const registerDetails = api.register.getRegisterDetails.useQuery(
        {
            email: email as string,
        },
        {
            enabled: !!email,
        }
    );

    const getPotentialCustomerDetails = api.user.getPotentialCustomerDetails.useQuery(
        {
            email: email as string,
        },
        {
            enabled: !!email,
        }
    );

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center space-x-2">
                        <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => router.back()} />
                        <h1 className="text-3xl font-bold">{bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}</h1>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <AddImageToUserDialog email={bookingDetails?.data?.email} refetch={getPotentialCustomerDetails.refetch} potentialCustomerData={getPotentialCustomerDetails.data} />
                        {<div className="relative w-10 h-10">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={
                                        getPotentialCustomerDetails.data?.imageUrl ?? (bookingDetails.data?.firstName && bookingDetails.data?.lastName
                                            ? `https://ui-avatars.com/api/?name=${bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}`
                                            : undefined)
                                    }
                                    alt="@user"
                                    className="object-cover"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>}
                    </div>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Register Details</CardTitle>
                        <CardDescription>
                            {`Details about the potential customer's register details.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegisterDetails registerDetails={registerDetails} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>
                                Contact details for {bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex flex-row items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <div>{bookingDetails.data?.email}</div>
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <div>{bookingDetails.data?.phoneNumber || "-"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Appointment Details</CardTitle>
                            <CardDescription>
                                Contact details for {bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex flex-row items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <div>{formatTimestamp(bookingDetails.data?.startTimestamp)}</div>
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <Timer className="w-4 h-4" />
                                    <div className="font-semibold">Duration</div>
                                    <div>{(bookingDetails.data?.endTimestamp - bookingDetails.data?.startTimestamp) / (60 * 1000) + " minutes"}</div>
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <RocketIcon className="w-4 h-4" />
                                    <div className="max-w-max truncate text-blue-400" onClick={
                                        () => {
                                            window.open(ZOOM_URL, "_blank")
                                        }
                                    }>{ZOOM_URL}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Customer Questions</CardTitle>
                        <CardDescription>
                            Notes and Questions created by the customer.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="max-w-max overflow-x-scroll">
                        <pre>
                            {bookingDetails.data?.notes || "-"}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Call Notes</CardTitle>
                        <CardDescription>
                            Information about the call set by Home0001.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="max-w-max overflow-x-scroll">
                        <pre>
                            {bookingDetails.data?.additionalNotes || "-"}
                        </pre>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Profile Notes</CardTitle>
                        <CardDescription>
                            Information about the call set by Home0001.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="max-w-max overflow-x-scroll">
                        <pre>
                            {getPotentialCustomerDetails.data?.profileNotes || "-"}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

interface RegisterDetailsProps {
    registerDetails: any;
}

const formatDisplayText = (...args: string[]) => {
    let displayText = "";

    args.forEach((arg, index) => {
        if (arg) {
            displayText += arg;
            if (index !== args.length - 1) {
                displayText += ", ";
            }
        }
    });

    if (displayText.endsWith(", ")) {
        displayText = displayText.slice(0, -2);
    }

    return displayText;
};

const RegisterDetails = (props: RegisterDetailsProps) => {
    const { registerDetails } = props;

    if (registerDetails.isLoading) {
        return (
            <Skeleton className="w-full h-96" />
        );
    }

    if (!registerDetails.data || registerDetails.data?.length === 0) {
        return (
            <div className="">
                -
            </div>
        );
    }

    const registerData = registerDetails.data[0];

    return (
        <div className="max-h-96 overflow-y-scroll">
            {registerDetails.data.length > 1 && <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    There are multiple register details for this email. Showing the latest one.
                </AlertDescription>
            </Alert>}
            <div className="space-y-2">
                {/* <div>
                    First Name: {registerData.firstName || "-"}
                </div>

                <div>
                    Last Name: {registerData.lastName || "-"}
                </div> */}

                {/* <div>
                    City: {registerData.city || "-"}
                </div> */}

                {/* <div>
                    Bedroom Preference: {registerData.bedroomPreference || "-"}
                </div> */}

                {/* <div>
                    IP Address: {registerData.ipAddress.ip || "-"}
                </div>

                <div>
                    ZIP: {registerData.ipAddress.ipInfo.zip || "-"}
                </div> */}

                {/* <div>
                    Country: {registerData.ipAddress.ipInfo.country || "-"}
                </div> */}

                <div>
                    IP Location: {registerData?.ipAddress?.ipInfo?.city && registerData?.ipAddress?.ipInfo?.regionName && registerData?.ipAddress?.ipInfo?.country &&
                        (registerData?.ipAddress?.ipInfo?.city + ", " + registerData.ipAddress?.ipInfo?.regionName + ", " + registerData?.ipAddress?.ipInfo?.country) || "-"}
                </div>

                {/* <div>
                    Organization of IP Address: {registerData.ipAddress.ipInfo.org || "-"}
                </div> */}

                {/* <div>
                    Timezone: {registerData.ipAddress.ipInfo.timezone || "-"}
                </div> */}

                {/* <div>
                    Region Name: {registerData.ipAddress.ipInfo.regionName || "-"}
                </div> */}

                {/* <div>
                    ISP: {registerData.ipAddress.ipInfo.isp || "-"}
                </div>

                <div>
                    Longitude: {registerData.ipAddress.ipInfo.lon || "-"}
                </div>

                <div>
                    Latitude: {registerData.ipAddress.ipInfo.lat || "-"}
                </div> */}

                {/* <div>
                    AS: {registerData.ipAddress.ipInfo.as || "-"}
                </div> */}

                {/* <div>
                    Country Code: {registerData.ipAddress.ipInfo.countryCode || "-"}
                </div> */}

                {/* <div>
                    Region: {registerData.ipAddress.ipInfo.region || "-"}
                </div> */}

                {/* <div>
                    User Agent: {registerData.userAgent || "-"}
                </div> */}
                {/*
                <div>
                    Source: {registerData.source || "-"}
                </div> */}

                {/* <div>
                    Medium: {registerData.medium || "-"}
                </div>

                <div>
                    Content: {registerData.content || "-"}
                </div> */}

                <div>
                    Ad Source: {formatDisplayText(registerData?.medium, registerData?.content) || "-"}
                </div>

                {/* <div>
                    Routes: {registerData.routes || "-"}
                </div> */}

                <div>
                    Created At: {
                        registerData?.createdAt ? new Date(
                            registerData?.createdAt * 1000
                        ).toLocaleString() : "-"
                    }
                </div>
                {/*
                <div>
                    HUTK: {registerData.hutk || "-"}
                </div> */}

                <div>
                    Buying Timeline: {registerData?.buyingTimelinedec2023 || "-"}
                </div>

                {/* <div>
                    Else: {registerData.Else || "-"}
                </div> */}

                {/* <div>
                    Campaign: {registerData.campaign || "-"}
                </div> */}

                <div className="flex flex-row items-center space-x-2">
                    <div>
                        Locations of Interest:
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        {typeof registerData?.locationsOfInterest === "object" &&
                            registerData?.locationsOfInterest?.map((location: string) => (
                                <Badge key={location}>{location}</Badge>
                            ))}
                        {typeof registerData?.locationsOfInterest === "string" &&
                            <Badge>{registerData?.locationsOfInterest}</Badge>}
                        {registerData?.city && <Badge>{registerData.city}</Badge>}
                    </div>
                </div>

                {/* <div>
                    Ad Set: {registerData.adSet || "-"}
                </div> */}

                <div>
                    {/* Page: {registerData.page || "-"} */}
                </div>

                {/* <div>
                    Email: {registerData.email || "-"}
                </div> */}

                {/* <div>
                    Full Query: {registerData.fullQuery || "-"}
                </div> */}
            </div>
        </div>
    );
};

export default BookingDetails;
