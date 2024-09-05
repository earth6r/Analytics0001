import Header from "@/components/common/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { AlertCircle, ArrowLeftCircleIcon, Bell, Calendar, CircleAlert, CircleOff, Contact, FileQuestion, Hourglass, Mail, MapPin, NotepadText, Phone, School, SquareArrowOutUpRight, Timer, Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/router";
import AddImageToUserDialog from "@/components/bookings/add-image-to-user-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CopyTooltip from "@/components/customers/copy-tooltip";
import { useInterval } from "@/contexts/IntervalContext";
import { nextStepsMapping } from "@/components/bookings/next-steps-dropdown";
import moment from "moment";
import DeleteNextStepChainLink from "@/components/bookings/delete-next-step-chain-link";
import UpdateProfile from "@/components/update-profile";

export const ZOOM_URL = "https://zoom.us/j/9199989063?pwd=RzhRMklXNWdJNGVKZjRkRTdkUmZOZz09";

// TODO: rename component and page to user-details
const BookingDetails = () => {
    const router = useRouter();

    const { email, type, uid, referral } = router.query;
    const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(undefined);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [nextStepsAction, setNextStepsAction] = useState<string | null>(null);
    const [latestNextStep, setLatestNextStep] = useState<any | null>(null);

    const { timezone } = useInterval();

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

    // TODO: make a specific query for bookings by email for efficiency
    const bookings = api.bookings.getBookings.useQuery(
        {
            email: email as string,
        },
        {
            enabled: !!email,
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

    useEffect(() => {
        if (getPotentialCustomerDetails.data?.nextStepsDropdownValue && getPotentialCustomerDetails.data?.nextStepsDropdownValue.length > 0) {
            setNextStepsAction(getPotentialCustomerDetails.data?.nextStepsDropdownValue[getPotentialCustomerDetails.data?.nextStepsDropdownValue.length - 1].value);
            setLatestNextStep(getPotentialCustomerDetails.data?.nextStepsDropdownValue[getPotentialCustomerDetails.data?.nextStepsDropdownValue.length - 1]);
        } else {
            setNextStepsAction(null);
        }
    }, [getPotentialCustomerDetails.data?.nextStepsDropdownValue]);

    if (
        !registerDetails.isLoading &&
        !registerDetails.data &&
        !bookingDetails.isLoading &&
        !bookingDetails.data
    ) {
        // TODO: make this ui better https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=73914135
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-3xl font-bold">No waitlist details found</div>
                <div className="text-lg">Please try again later</div>
                <div className="mt-4">
                    <Button variant="default" onClick={() => referral ? router.push(referral as string) : router.push("/bookings")}>Go back</Button>
                </div>
            </div>
        );
    }

    const createHyperlinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part: string, index: number) => {
            if (urlRegex.test(part)) {
                // return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
                return (
                    <TooltipTrigger key={index}>
                        <div key={index} className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={
                            () => window.open(
                                part,
                                "_blank"
                            )
                        }>{part}
                        </div>
                    </TooltipTrigger>
                );
            }
            return part;
        });
    };

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
                        <AddImageToUserDialog initialLoading={getPotentialCustomerDetails.isLoading || getPotentialCustomerDetails.isError || getPotentialCustomerDetails.isFetching || getPotentialCustomerDetails.isPending} email={email as string} refetch={getPotentialCustomerDetails.refetch} potentialCustomerData={getPotentialCustomerDetails.data} />
                        {/* TODO: fix issue of image not showing in mobile view */}
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
                                        <SquareArrowOutUpRight className="w-4 h-4" />
                                        <h1>View Image</h1>
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
                        There are multiple waitlist details for this email. We will show as many details as possible.
                    </AlertDescription>
                </Alert>}

                <div className="mt-4">
                    <UpdateProfile email={email as string} setIsOpen={undefined} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="mt-6 w-full">
                        <CardContent className="p-4">
                            {/* TODO: fix the skeleton loading */}
                            <div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                            <CardTitle>Waitlist Details</CardTitle>
                            <CardDescription>
                                {`Details about the potential customer's waitlist details.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RegisterDetails registerDetails={registerDetails} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Notes</CardTitle>
                            <CardDescription>
                                Information about the call set by Home0001.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="max-w-max whitespace-pre-wrap break-words">
                            <TooltipProvider>
                                <Tooltip>
                                    <div>
                                        {typeof getPotentialCustomerDetails.data?.profileNotes === "string" ? createHyperlinks(getPotentialCustomerDetails.data?.profileNotes || "-") : "-"}
                                    </div>
                                    <TooltipContent>
                                        Click to View the Link
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardContent>
                    </Card>

                    {/* TODO: need better styling than a grid because i.e. robbie.j.s111@icloud.com has big notes but very small contact section */}
                    <Card>
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
                                <div className="flex flex-row items-center space-x-2">
                                    <Bell className="w-4 h-4" />
                                    <div>
                                        {getPotentialCustomerDetails.data?.preferredCommunicationMedium ? getPotentialCustomerDetails.data?.preferredCommunicationMedium : "-"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Latest Next Step</CardTitle>
                            <CardDescription>
                                Latest Next step set by Home0001.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: make this ui much better, use untitledui for inspiration (maybe just make this a third card with profile notes and contact details) */}
                            <div>
                                Notes: {latestNextStep?.nextStepsNotes || "-"}
                            </div>
                            <div>
                                {/* TODO: format date using format and pass in analytics user's preferred timezone and such */}
                                Deferred Date: {latestNextStep?.deferredDate ? moment.utc(moment.unix(latestNextStep?.deferredDate)).format("MMM DD, YYYY") : "-"}
                            </div>
                            <div>
                                Status: {
                                    nextStepsAction ? (
                                        <Badge className={cn(
                                            nextStepsAction.startsWith("action:") ? "bg-red-500 hover:bg-red-500" : "bg-blue-300 hover:bg-blue-300",
                                        )}>
                                            {nextStepsAction.startsWith("action:") ? "Action Required" : "Awaiting Response"}
                                        </Badge>
                                    ) : "-"}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="right-element">
                        <CardHeader>
                            <CardTitle>Next Steps Chain</CardTitle>
                            <CardDescription>
                                History of Next steps set by Home0001.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: make this ui much better, use untitledui for inspiration (maybe just make this a third card with profile notes and contact details) */}
                            <div className="flex flex-row items-center space-x-2">
                                {(getPotentialCustomerDetails.data?.nextStepsDropdownValue || []).length > 0 ? (
                                    <div>
                                        {getPotentialCustomerDetails.data?.nextStepsDropdownValue.map((step: any, index: number) => (
                                            <div key={index} className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    {step.value.startsWith("action:") ? <CircleAlert className="w-4 h-4 text-red-500" /> : <Hourglass className="w-4 h-4 text-blue-300" />}
                                                    {/* @ts-expect-error TODO: Fix this */}
                                                    <h1>{nextStepsMapping[step.value] || step.value.split(":").slice(1).join(":")
                                                    } -</h1>
                                                    <h1>{
                                                        moment.utc(moment.unix(step.timestamp)).format("MMM DD, YYYY")
                                                    }</h1>
                                                </div>
                                                <DeleteNextStepChainLink email={email as string} index={index} />
                                            </div>
                                        ))}
                                    </div>
                                ) : <div>-</div>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 space-y-6">
                    {bookings.data && bookings.data.map((booking: any, index: number) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center space-x-2">
                                        <div>{booking?.type === "Property Tour" ? <School className="w-4 h-4" /> : <Phone className="w-4 h-4" />}</div>
                                        <div>{booking?.type === "Property Tour" ? "Property Tour" : "Phone Call"} Appointment Details</div>
                                    </div>
                                    {(booking?.rescheduleCount || 0) > 1 && <Badge variant="default" className="select-none hover:bg-black dark:hover:bg-white">
                                        rescheduled
                                    </Badge>}
                                </CardTitle>
                                <CardDescription>
                                    Appointment details for {
                                        booking ? (booking?.firstName + " " + booking?.lastName) : (registerDetails.data?.data?.firstName + " " + registerDetails.data?.data?.lastName)
                                    }
                                </CardDescription>
                                {!booking?.startTimestamp && !booking?.endTimestamp && <Alert variant="destructive" className="select-none">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Action Required</AlertTitle>
                                    <AlertDescription>
                                        Pending Booking. Add a date to this booking in the <span className="underline cursor-pointer" onClick={
                                            () => router.push(`/bookings`)
                                        }>bookings</span> page
                                    </AlertDescription>
                                </Alert>}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex flex-row items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <div>{formatTimestamp(booking?.startTimestamp, true, timezone) || "-"}</div>
                                    </div>
                                    <div className="flex flex-row items-center space-x-2">
                                        <Timer className="w-4 h-4" />
                                        <div className="font-semibold">Duration</div>
                                        <div>{
                                            booking && booking?.startTimestamp && booking?.endTimestamp ? (booking?.endTimestamp - booking?.startTimestamp) / (60 * 1000) + " minutes" : "-"
                                        }</div>
                                    </div>
                                    <div className="flex flex-row items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    {booking ? <div className="max-w-max truncate text-blue-500 hover:text-blue-400 cursor-pointer" onClick={
                                                        () => {
                                                            window.open(
                                                                booking?.type === "Property Tour" ? "https://streeteasy.com/building/home0001-48-allen" : ZOOM_URL, "_blank")
                                                        }
                                                    }>{
                                                            booking?.type === "Property Tour" ? "https://streeteasy.com/building/home0001-48-allen" : ZOOM_URL
                                                        }</div> : <div>-</div>}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {booking?.type === "Property Tour" ? "Click to view the location" : "Click to join the Zoom call"}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <Contact className="w-4 h-4" />
                                            <h1 className="font-semibold">Interviewer</h1>
                                            <h1>{booking?.interviewer || "-"}</h1>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <Contact className="w-4 h-4" />
                                            <h1 className="font-semibold">Status</h1>
                                            <Badge>{booking?.status || "scheduled"}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center space-x-2">
                                        <FileQuestion className="w-4 h-4" />
                                        <h1 className="font-semibold">Customer Questions</h1>
                                    </div>
                                    <div className="ml-6">
                                        <p className="whitespace-pre-wrap break-words">
                                            {booking?.notes || "-"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-row items-center space-x-2">
                                        <NotepadText className="w-4 h-4" />
                                        <h1 className="font-semibold">Legacy Meeting Notes</h1>
                                    </div>
                                    <div className="ml-6">
                                        <p className="whitespace-pre-wrap break-words">
                                            {booking?.additionalNotes || "-"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-row items-center space-x-2">
                                        <NotepadText className="w-4 h-4" />
                                        <h1 className="font-semibold">Meeting Notes</h1>
                                    </div>
                                    {/* TODO: remove hover on badges */}
                                    {/* TODO: make badge have an option to have no hover i.e. hover={false} which if true, will have cursor-pointer and such and not if false. need to reuse everywhere because not consistent atm */}
                                    {booking?.additionalDetails ? <div className="ml-6">
                                        <div>
                                            {/* TODO: consider using an icon instead of displaying true/false */}
                                            Budget: {JSON.stringify(booking?.additionalDetails?.budget)} {booking?.additionalDetails?.budgetAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD to {booking?.additionalDetails?.budgetAmountMax?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) || "$2,000,000"} USD
                                        </div>
                                        <div>
                                            Community Member: {JSON.stringify(booking?.additionalDetails?.communityMember)}
                                        </div>
                                        <div>
                                            Interest: {JSON.stringify(booking?.additionalDetails?.interest)} {booking?.additionalDetails?.interestNotes}
                                        </div>
                                        <div>
                                            Locations: {booking?.additionalDetails?.locations?.berlin && <Badge>Berlin</Badge>} {booking?.additionalDetails?.locations?.london && <Badge>London</Badge>} {booking?.additionalDetails?.locations?.losAngeles && <Badge>Los Angeles</Badge>} {booking?.additionalDetails?.locations?.mexicoCity && <Badge>Mexico City</Badge>} {booking?.additionalDetails?.locations?.newYork && <Badge>New York</Badge>} {booking?.additionalDetails?.locations?.paris && <Badge>Paris</Badge>} {booking?.additionalDetails?.locations?.somewhereElse && <Badge>{booking?.additionalDetails?.locations?.somewhereElseNotes}</Badge>}
                                        </div>
                                        <div>
                                            Product Fit: {JSON.stringify(booking?.additionalDetails?.productFit)} {booking?.additionalDetails?.productFitNotes}
                                        </div>
                                        <div>
                                            Timing: {JSON.stringify(booking?.additionalDetails?.timing)}
                                        </div>
                                        <div>
                                            Buying Timeline: {booking?.additionalDetails?.timeline}
                                        </div>
                                    </div> : <div className="ml-6">-</div>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
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
