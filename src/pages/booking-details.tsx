import Header from "@/components/common/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { ArrowLeftCircleIcon, Calendar, Mail, Phone, RocketIcon, SquareArrowOutUpRight, Timer, TriangleAlert } from "lucide-react";
import { useRouter } from "next/router";
import AddImageToUserDialog from "@/components/bookings/add-image-to-user-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CopyTooltip from "@/components/customers/copy-tooltip";

export const ZOOM_URL = "https://zoom.us/j/9199989063?pwd=RzhRMklXNWdJNGVKZjRkRTdkUmZOZz09";

const BookingDetails = () => {
    const router = useRouter();

    const { email, type, uid, referral } = router.query;
    const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(undefined);
    const [imageLoaded, setImageLoaded] = useState(false);

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

    useEffect(() => {
        if (getPotentialCustomerDetails.data?.imageUrl) {
            setDisplayImageUrl(getPotentialCustomerDetails.data.imageUrl);
        } else if (bookingDetails.data?.firstName && bookingDetails.data?.lastName) {
            setDisplayImageUrl(`https://ui-avatars.com/api/?name=${bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}`);
        }
    }, [getPotentialCustomerDetails.data?.imageUrl, bookingDetails.data?.firstName, bookingDetails.data?.lastName]);

    if (
        !registerDetails.isLoading &&
        !registerDetails.data
    ) {
        // TODO: make this ui better https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=73914135
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-3xl font-bold">No register details found</div>
                <div className="text-lg">Please try again later</div>
                <div className="mt-4">
                    <Button variant="default" onClick={() => referral ? router.push(referral as string) : router.push("/bookings")}>Go back</Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center space-x-2">
                        <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => referral ? router.push(referral as string) : router.push("/bookings")} />
                        <h1 className="text-3xl font-bold truncate max-w-52 md:max-w-80 lg:max-w-96">{
                            bookingDetails.data ? (bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName) : (registerDetails.data?.data?.firstName + " " + registerDetails.data?.data?.lastName)
                        }</h1>
                    </div>
                    <div className="flex flex-row items-center space-x-2 select-none">
                        <AddImageToUserDialog email={bookingDetails?.data?.email} refetch={getPotentialCustomerDetails.refetch} potentialCustomerData={getPotentialCustomerDetails.data} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    {<div className="relative w-10 h-10 hidden md:block">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={displayImageUrl}
                                                alt="@user"
                                                className="object-cover"
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>}
                                </Button>
                            </DropdownMenuTrigger>
                            {getPotentialCustomerDetails.data?.imageUrl && <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <div
                                        className="flex flex-row items-center space-x-2"
                                        onClick={
                                            () => window.open(
                                                displayImageUrl,
                                                "_blank"
                                            )
                                        }
                                    >
                                        <h1>View Image</h1>
                                        <SquareArrowOutUpRight className="w-4 h-4" />
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>}
                        </DropdownMenu>
                    </div>
                </div>

                {registerDetails.data && registerDetails.data.count > 1 && <Alert className="mt-4">
                    <div className="flex flex-row space-x-1">
                        <div className="text-yellow-500">
                            <TriangleAlert className="h-4 w-4" />
                        </div>
                        <AlertTitle>Heads up!</AlertTitle>
                    </div>
                    <AlertDescription>
                        There are multiple register details for this email. We will show as many details as possible.
                    </AlertDescription>
                </Alert>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="mt-6 w-full">
                        <CardContent className="p-4">
                            {/* TODO: fix the skeleton loading */}
                            <div>
                                <img
                                    src={displayImageUrl as string}
                                    alt="@user"
                                    className="object-contain w-full h-96"
                                    width={400}
                                    height={400}
                                    onLoad={() => { setImageLoaded(true) }}
                                />
                                {/* {!imageLoaded && <Skeleton className="h-96 rounded-lg" />} */}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="md:mt-6 w-full">
                        <CardHeader className="select-none">
                            <CardTitle>Register Details</CardTitle>
                            <CardDescription>
                                {`Details about the potential customer's register details.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RegisterDetails registerDetails={registerDetails} />
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Profile Notes</CardTitle>
                        <CardDescription>
                            Information about the call set by Home0001.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="max-w-max whitespace-pre-wrap break-words">
                        <div>
                            {getPotentialCustomerDetails.data?.profileNotes || "-"}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>
                                Contact details for {
                                    bookingDetails.data ? (bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName) : (registerDetails.data?.data?.firstName + " " + registerDetails.data?.data?.lastName)
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex flex-row items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <div>
                                        <CopyTooltip value={email as string} />
                                    </div>
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <div>
                                        {bookingDetails.data?.phoneNumber ? <CopyTooltip value={bookingDetails.data?.phoneNumber} /> : "-"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex flex-row items-center justify-between">
                                <div>
                                    Appointment Details
                                </div>
                                {(bookingDetails.data?.rescheduleCount || 0) > 1 && <Badge variant="default" className="select-none hover:bg-black dark:hover:bg-white">
                                    rescheduled
                                </Badge>}
                            </CardTitle>
                            <CardDescription>
                                Appointment details for {
                                    bookingDetails.data ? (bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName) : (registerDetails.data?.data?.firstName + " " + registerDetails.data?.data?.lastName)
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex flex-row items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <div>{formatTimestamp(bookingDetails.data?.startTimestamp) || "-"}</div>
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <Timer className="w-4 h-4" />
                                    <div className="font-semibold">Duration</div>
                                    <div>{
                                        bookingDetails.data ? (bookingDetails.data?.endTimestamp - bookingDetails.data?.startTimestamp) / (60 * 1000) + " minutes" : "-"
                                    }</div>
                                </div>
                                <div className="flex flex-row items-center space-x-2">

                                    <RocketIcon className="w-4 h-4" />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                {bookingDetails.data ? <div className="max-w-max truncate text-blue-500 hover:text-blue-400 cursor-pointer" onClick={
                                                    () => {
                                                        window.open(ZOOM_URL, "_blank")
                                                    }
                                                }>{ZOOM_URL}</div> : <div>-</div>}
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Click to join the Zoom call
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
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
                        <CardTitle>Meeting Notes</CardTitle>
                        <CardDescription>
                            Meeting notes about the booking.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="max-w-max whitespace-pre-wrap break-words">
                        <div>
                            {bookingDetails.data?.additionalNotes || "-"}
                        </div>
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

const formatBuyingTime = (buyingTime: string) => {
    if (!buyingTime) {
        return null;
    }

    switch (buyingTime) {
        case "1to3mos":
            return "1 to 3 months";
        case "notsure":
            return "Not Sure";
        case "3to6mos":
            return "3 to 6 months";
        case "6to12mos":
            return "6 to 12 months";
        default:
            return buyingTime;
    }
}

const RegisterDetails = (props: RegisterDetailsProps) => {
    const { registerDetails } = props;

    if (registerDetails.isLoading) {
        return (
            <Skeleton className="w-full h-40" />
        );
    }

    if (!registerDetails.data || registerDetails.data?.length === 0) {
        return (
            <div className="">
                -
            </div>
        );
    }

    const registerData = registerDetails.data.data;

    return (
        <div className="max-h-96 overflow-y-scroll">
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
                    Sign Up Date: {
                        registerData?.createdAt ? new Date(
                            registerData?.createdAt * 1000
                        ).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "-"
                    }
                </div>
                {/*
                <div>
                    HUTK: {registerData.hutk || "-"}
                </div> */}

                <div>
                    Buying Timeline: {formatBuyingTime(registerData?.buyingTimelinedec2023) || "-"}
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
                            registerData?.locationsOfInterest?.map((location: string, index: number) => (
                                <Badge key={index}>{location}</Badge>
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
