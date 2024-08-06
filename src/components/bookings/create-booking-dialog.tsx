import Spinner from "@/components/common/spinner"
import { BuyingPropertyTypeSelect } from "@/components/customers/buying-property-type-select"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles"
import { api } from "@/utils/api"
import { CircleCheck, CirclePlus, Info } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { toast } from "../ui/use-toast"
import { DatePicker } from "./date-picker"
import { TypeOfBookingSelect } from "./type-of-booking-select"
import moment from 'moment-timezone';
// import { useForm } from "react-hook-form"

interface CreateBookingDialogProps {
    refetch: () => Promise<any>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// TODO: move to utils
export const formatTimeAlternate = (startTimestamp: string) => {
    // Step 1: Extract date and time components
    const [datePart, timePart, period] = startTimestamp.split(" ");

    // Step 2: Reformat the date to YYYY-MM-DD
    // @ts-expect-error TODO: fix type
    const [year, day, month] = datePart.split("-");
    // @ts-expect-error TODO: fix type
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    // Step 3: Reformat the time to HH:MM:SS
    // @ts-expect-error TODO: fix type
    // eslint-disable-next-line prefer-const
    let [hours, minutes, seconds] = timePart.split(":");
    if (period === "PM" && hours !== "12") {
        // @ts-expect-error TODO: fix type
        hours = (parseInt(hours) + 12).toString();
    } else if (period === "AM" && hours === "12") {
        hours = "00";
    }
    // @ts-expect-error TODO: fix type
    const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;

    // Step 4: Combine the date and time into the desired format
    startTimestamp = `${formattedDate} ${formattedTime}`;

    return startTimestamp;
};

const CreateBookingDialog = (props: CreateBookingDialogProps) => {
    const { refetch, open, onOpenChange } = props;

    const [email, setEmail] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [startTime, setStartTime] = useState<string>("");
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<string>("");
    const [typeOfBooking, setTypeOfBooking] = useState<'propertyTour' | "phoneCall" | null | undefined>(undefined);
    const [propertyType, setPropertyType] = useState<string | null | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [notes, setNotes] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // const form = useForm({
    //     defaultValues: {
    //         email: "",
    //         startTimestamp: "",
    //         endTimestamp: "",
    //         typeOf
    //     }
    // })

    const createPhoneBooking = api.bookings.createPhoneBooking.useMutation();
    const createPropertyTourBooking = api.bookings.createPropertyTourBooking.useMutation();

    async function onSubmit() {
        if (!email) {
            toast({
                title: "Email is required",
                description: "Please enter the email address.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!firstName) {
            toast({
                title: "First Name is required",
                description: "Please enter the first name.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!lastName) {
            toast({
                title: "Last Name is required",
                description: "Please enter the last name.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!startDate) {
            toast({
                title: "Start Date is required",
                description: "Please enter the date.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!startTime) {
            toast({
                title: "Start Time is required",
                description: "Please enter the time.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!endDate) {
            toast({
                title: "End Date is required",
                description: "Please enter the date.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!endTime) {
            toast({
                title: "End Time is required",
                description: "Please enter the time.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!typeOfBooking) {
            toast({
                title: "Type of Booking is required",
                description: "Please select the type of booking.",
                className: toastErrorStyle,
            });
            return;
        }

        if (typeOfBooking === "propertyTour" && !propertyType) {
            toast({
                title: "Property Type is required",
                description: "Please enter the property type.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!phoneNumber) {
            toast({
                title: "Phone Number is required",
                description: "Please enter the phone number.",
                className: toastErrorStyle,
            });
            return;
        }

        try {
            setIsLoading(true);

            const startHour = Number(startTime.split(":")[0]);
            const startMinuteNumber = Number(startTime.split(":")[1]);
            startDate.setHours(startHour, startMinuteNumber, 0, 0);
            let startMinute = startMinuteNumber.toString();
            if (startMinute === "0") {
                startMinute = "00";
            }
            const formattedStartTimestamp = startDate.getTime().toString();
            const startMonthUTCMonth = startDate.getMonth() + 1;
            const startMonth = startMonthUTCMonth.toString().length === 1 ? `0${startMonthUTCMonth}` : startMonthUTCMonth;
            const startDay = startDate.getDate().toString().length === 1 ? `0${startDate.getDate()}` : startDate.getDate();
            let startTimestamp = `${startDate.getFullYear()}-${startMonth}-${startDay} ${startHour}:${startMinute}:00`;

            // Convert startTimestamp from EST to UTC
            const estMoment = moment.tz(startTimestamp, 'YYYY-MM-DD HH:mm:ss', 'America/New_York');
            const utcMoment = estMoment.clone().tz('UTC');
            startTimestamp = utcMoment.format('YYYY-MM-DD HH:mm:ss');

            const endHour = Number(endTime.split(":")[0]);
            const endMinuteNumber = Number(endTime.split(":")[1]);
            endDate.setHours(endHour, endMinuteNumber, 0, 0);
            let endMinute = endMinuteNumber.toString();
            if (endMinute === "0") {
                endMinute = "00";
            }
            const formattedEndTimestamp = endDate.getTime().toString();
            const endMonthUTCMonth = endDate.getMonth() + 1;
            const endMonth = endMonthUTCMonth.toString().length === 1 ? `0${endMonthUTCMonth}` : endMonthUTCMonth;
            const endDay = endDate.getDate().toString().length === 1 ? `0${endDate.getDate()}` : endDate.getDate();
            let endTimestamp = `${endDate.getFullYear()}-${endMonth}-${endDay} ${endHour}:${endMinute}:00`;

            // Convert endTimestamp from EST to UTC
            const estEndMoment = moment.tz(endTimestamp, 'YYYY-MM-DD HH:mm:ss', 'America/New_York');
            const utcEndMoment = estEndMoment.clone().tz('UTC');
            endTimestamp = utcEndMoment.format('YYYY-MM-DD HH:mm:ss');

            if (isNaN(Number(formattedStartTimestamp))) {
                toast({
                    title: "Invalid timestamp",
                    description: "Please enter a valid start timestamp.",
                    className: toastErrorStyle,
                });
                setIsLoading(false);
                return;
            }

            if (startTimestamp.length !== 19) {
                toast({
                    title: "Invalid timestamp",
                    description: `Please enter a valid start timestamp. Length must be 19. Got ${formattedStartTimestamp.length}.`,
                    className: toastErrorStyle,
                });
                setIsLoading(false);
                return;
            }

            if (isNaN(Number(formattedEndTimestamp))) {
                toast({
                    title: "Invalid timestamp",
                    description: "Please enter a valid end timestamp.",
                    className: toastErrorStyle,
                });
                setIsLoading(false);
                return;
            }

            if (endTimestamp.length !== 19) {
                toast({
                    title: "Invalid timestamp",
                    description: `Please enter a valid end timestamp. Length must be 19. Got ${formattedEndTimestamp.length}.`,
                    className: toastErrorStyle,
                });
                setIsLoading(false);
                return;
            }

            if (new Date(startTimestamp).getTime() >= new Date(endTimestamp).getTime()) {
                toast({
                    title: "Invalid timestamp",
                    description: "The start timestamp must be before the end timestamp.",
                    className: toastErrorStyle,
                });
                setIsLoading(false);
                return;
            }

            if (new Date(startTimestamp).getTime() <= new Date().getTime()) {
                toast({
                    title: "Invalid timestamp",
                    description: "The start timestamp must be in the future.",
                    className: toastErrorStyle,
                });
                setIsLoading(false);
                return;
            }

            const createBooking = typeOfBooking === "propertyTour" ? createPropertyTourBooking : createPhoneBooking;
            // @ts-expect-error TODO: fix type
            await createBooking.mutateAsync({ email, startTimestamp, endTimestamp, typeOfBooking, propertyType, phoneNumber, notes, firstName, lastName });

            await refetch();

            setIsLoading(false);

            toast({
                title: "Booking created",
                description: "The booking was successfully created in the database.",
                className: toastSuccessStyle,
            });

            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                setEmail("");
                setFirstName("");
                setLastName("");
                setPhoneNumber("");
                setStartDate(new Date());
                setStartTime("");
                setEndDate(new Date());
                setEndTime("");
                setTypeOfBooking(undefined);
                setPropertyType(null);
                onOpenChange(false);
            }, 2000);
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "An error occurred",
                description: "An error occurred while creating a booking in the database.",
                className: toastErrorStyle,
            });
        }
    }

    // TODO: disabled for timestamp 19 len and Nan timestamp
    const disabled = isLoading || !email || !email.includes("@") || !email.includes(".") || !startDate || !startTime || !endDate || !endTime || !typeOfBooking || !phoneNumber || !firstName || !lastName;

    const [infoTooltipOpened, setInfoTooltipOpened] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default" className="space-x-2">
                    <CirclePlus className="w-4 h-4" />
                    <h1>Create Booking</h1>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="flex flex-row items-center space-x-2">
                        <h1>Create Booking</h1>
                        {/* TODO: make this supportive in mobile */}
                        <TooltipProvider>
                            <Tooltip open={infoTooltipOpened} onOpenChange={setInfoTooltipOpened} delayDuration={0}>
                                <Info
                                    className="w-4 h-4 cursor-pointer"
                                    onMouseEnter={
                                        (e) => {
                                            e.preventDefault();
                                            setInfoTooltipOpened(!infoTooltipOpened);
                                        }
                                    }
                                    onMouseLeave={
                                        (e) => {
                                            e.preventDefault();
                                            setInfoTooltipOpened(!infoTooltipOpened);
                                        }
                                    }
                                />
                                <TooltipContent className="mt-[-50px] select-none">
                                    <p className="font-semibold max-w-96">This will create a Google Calendar Event and send a WhatsApp Notification Message to the Home0001 Team.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </DialogTitle>
                    <DialogDescription>
                        Create a new booking in the database. This will not send a Google Calendar invite.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll">
                    <div className="grid gap-4 px-6 py-2">
                        <Input
                            id="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <Input
                            id="firstName"
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />
                        <Input
                            id="lastName"
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                        />
                        {/* TODO: think about whether there should be a date picker input and a time picker input */}
                        {/* TODO: add exact length for string restriction to len of 19 XXXX-XX-XX XX:XX:XX */}
                        <div>
                            <div className="flex flex-row items-center space-x-2">
                                <DatePicker placeholder="Pick a start date" value={startDate} onValueChange={setStartDate} />
                                <Input
                                    id="startTimestamp"
                                    placeholder={"🕛 HH:MM"}
                                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                    onChange={(e) => {
                                        let input = e.target.value;

                                        const numbers = input.split(":").map(Number);
                                        // @ts-expect-error TODO: fix type
                                        const isDeleting = e.nativeEvent?.inputType === 'deleteContentBackward' || e.nativeEvent?.inputType === 'deleteContentForward';
                                        const isInputStartingWithBasicDigit = input.startsWith("0") || input.startsWith("1") || input.startsWith("2");

                                        if (input.length > 5 || numbers.some(isNaN) || input.split(":").length - 1 > 1) {
                                            return;
                                        }

                                        if (input.length === 3 && !input.includes(":")) {
                                            input = `${input.slice(0, 2)}:${input.slice(2)}`;
                                        }

                                        if (!isDeleting && input.length > 3 && (Number(input[3]) > 5 || Number(input[0]) > 2)) {
                                            return;
                                        }

                                        if (input.startsWith("2") && input.length === 2 && !input.includes(":") && Number(input[1]) > 3) {
                                            return;
                                        }

                                        if (!isDeleting) {
                                            if (!isInputStartingWithBasicDigit && input.length === 1 && !input.includes(":")) {
                                                input = `0${input}:`;
                                            } else if (input.length === 2 && !input.includes(":")) {
                                                input = `${input}:`;
                                            } else if (isInputStartingWithBasicDigit && input[1] === ":" && input.length === 2) {
                                                input = `0${input}`;
                                            }
                                        }
                                        setStartTime(input)
                                    }}
                                    value={startTime}
                                />
                            </div>
                            <div className="text-xs text-muted-foreground text-center">EST Timezone</div>
                        </div>
                        <div>
                            <div className="flex flex-row items-center space-x-2">
                                <DatePicker placeholder="Pick an end date" value={endDate} onValueChange={setEndDate} />
                                {/* TODO: think about whether there should be a date picker input and a time picker input */}
                                {/* TODO: add exact length for string restriction to len of 19 XXXX-XX-XX XX:XX:XX */}
                                <Input
                                    id="endTimestamp"
                                    placeholder="🕛 HH:MM"
                                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                    onChange={(e) => {
                                        let input = e.target.value;

                                        const numbers = input.split(":").map(Number);
                                        // @ts-expect-error TODO: fix type
                                        const isDeleting = e.nativeEvent?.inputType === 'deleteContentBackward' || e.nativeEvent?.inputType === 'deleteContentForward';
                                        const isInputStartingWithBasicDigit = input.startsWith("0") || input.startsWith("1") || input.startsWith("2");

                                        if (input.length > 5 || numbers.some(isNaN) || input.split(":").length - 1 > 1) {
                                            return;
                                        }

                                        if (input.length === 3 && !input.includes(":")) {
                                            input = `${input.slice(0, 2)}:${input.slice(2)}`;
                                        }

                                        if (!isDeleting && input.length > 3 && (Number(input[3]) > 5 || Number(input[0]) > 2)) {
                                            return;
                                        }

                                        if (input.startsWith("2") && input.length === 2 && !input.includes(":") && Number(input[1]) > 3) {
                                            return;
                                        }

                                        if (!isDeleting) {
                                            if (!isInputStartingWithBasicDigit && input.length === 1 && !input.includes(":")) {
                                                input = `0${input}:`;
                                            } else if (input.length === 2 && !input.includes(":")) {
                                                input = `${input}:`;
                                            } else if (isInputStartingWithBasicDigit && input[1] === ":" && input.length === 2) {
                                                input = `0${input}`;
                                            }
                                        }
                                        setEndTime(input)
                                    }}
                                    value={endTime}
                                />
                            </div>
                            <div className="text-xs text-muted-foreground text-center">EST Timezone</div>
                        </div>
                        <Input
                            id="phoneNumber"
                            placeholder="Phone Number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                        />
                        {/* @ts-expect-error TODO: fix type */}
                        <TypeOfBookingSelect className="w-full" selectedItem={typeOfBooking} setSelectedItem={setTypeOfBooking} />
                        {/* <Input
                            id="notes"
                            placeholder="Customer Notes"
                            // TODO: change every single Input to have value over onChange i.e. like 430 should be value and 431 should be onChange
                            onChange={(e) => setNotes(e.target.value)}
                            value={notes}
                        /> */}
                        {/* TODO: disable if type is phone call booking */}
                        {/* <BuyingPropertyTypeSelect className="w-full" selectedItem={propertyType} setSelectedItem={setPropertyType} /> */}
                    </div>
                </div>
                <DialogFooter className="flex flex-row items-center space-x-2 px-6 pb-6">
                    <Button variant="outline" className="w-full" onClick={() => {
                        setEmail("");
                        setPropertyType(null);
                        setFirstName("");
                        setLastName("");
                        setStartDate(new Date());
                        setStartTime("");
                        setEndDate(new Date());
                        setEndTime("");
                        setTypeOfBooking(null);
                        setPhoneNumber("");
                    }} disabled={
                        isLoading || (!email && !startTime && !endTime && !phoneNumber && !typeOfBooking) || isSuccess
                    }>Clear</Button>
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger className="w-full transition ease-in-out duration-300">
                                <Button type="submit" className="w-full" onClick={onSubmit}
                                    disabled={disabled || isSuccess}>
                                    {isLoading ? <Spinner /> : (isSuccess ? <CircleCheck className="w-4 h-4 animate-pop" /> : "Save")}
                                </Button>
                            </TooltipTrigger>
                            {disabled && <TooltipContent>
                                <div className="space-y-1">
                                    <div className="font-medium">{`Please fill in all the required fields:`}</div>
                                    <div>{!email && `The email is required.`}</div>
                                    <div>{email && (!email.includes("@") || !email.includes(".")) && "The email is invalid. Requires a `.` and a `@`"}</div>
                                    {/* <div>{!startTimestamp && `The start timestamp is required.`}</div> */}
                                    <div>{!startDate && `The start date is required.`}</div>
                                    <div>{!startTime && `The start time is required.`}</div>
                                    {/* <div>{startTimestamp && isNaN(Number(new Date(startTimestamp).getTime().toString())) && `The timestamp is invalid. Expected format is YYYY-MM-DD HH:MM:SS`}</div> */}
                                    {/* <div>{startTimestamp && startTimestamp.length !== 19 && `The timestamp must be of length 19.`}</div> */}
                                    {/* <div>{!endTimestamp && `The end timestamp is required.`}</div> */}
                                    {/* <div>{endTimestamp && isNaN(Number(new Date(endTimestamp).getTime().toString())) && `The timestamp is invalid. Expected format is YYYY-MM-DD HH:MM:SS`}</div> */}
                                    <div>{!endDate && `The end date is required.`}</div>
                                    <div>{!endTime && `The end time is required.`}</div>
                                    <div>{!phoneNumber && `The phone number is required.`}</div>
                                    <div>{!typeOfBooking
                                        && `The type of booking is required.`}</div>
                                    {/* <div>{typeOfBooking === "propertyTour" && !propertyType && `The property type is required.`}</div> */}
                                    <div>{!firstName && `The first name is required.`}</div>
                                    <div>{!lastName && `The last name is required.`}</div>
                                </div>
                            </TooltipContent>}
                        </Tooltip>
                    </TooltipProvider>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBookingDialog;
