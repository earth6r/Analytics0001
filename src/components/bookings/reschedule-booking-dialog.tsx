import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { api } from "@/utils/api"
import { CalendarClock, CircleCheck, Info } from "lucide-react"
import { useState } from "react"
import Spinner from "../common/spinner"
import { DatePicker } from "./date-picker"
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip"
import { toast } from "../ui/use-toast"
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles"
import moment from "moment-timezone";
import SuggestedTimes from "./suggested-times"
import ConflictingBookings from "./conflicting-bookings"

interface RescheduleDialogProps {
    booking: any;
    refetchBookings: () => Promise<any>;
    bookings: any[];
}

const RescheduleBookingDialog = (props: RescheduleDialogProps) => {
    const { booking, refetchBookings, bookings } = props;

    const [notes, setNotes] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [startTime, setStartTime] = useState("");

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [viewConflicts, setViewConflicts] = useState(true);

    const rescheduleBooking = api.bookings.rescheduleBooking.useMutation();

    async function handleReschedule() {
        setIsLoading(true);

        if (!startDate || !startTime) {
            setIsLoading(false);
            toast({
                title: "Error",
                description: "Please select a valid date and time.",
                className: toastErrorStyle,
            });
            return;
        }

        const startHour = Number(startTime.split(":")[0]);
        const startMinuteNumber = Number(startTime.split(":")[1]);
        startDate.setHours(startHour, startMinuteNumber, 0, 0);
        let startMinute = startMinuteNumber.toString();
        if (startMinute === "0") {
            startMinute = "00";
        }

        const startMonthUTCMonth = startDate.getMonth() + 1;
        const startMonth = startMonthUTCMonth.toString().length === 1 ? `0${startMonthUTCMonth}` : startMonthUTCMonth;
        const startDay = startDate.getDate().toString().length === 1 ? `0${startDate.getDate()}` : startDate.getDate();
        const startTimestampEst = `${startDate.getFullYear()}-${startMonth}-${startDay} ${startHour}:${startMinute}:00`;

        // Convert startTimestamp from EST to UTC
        const estMomentStartTimestamp = moment.tz(startTimestampEst, 'YYYY-MM-DD HH:mm:ss', 'America/New_York');
        const utcMomentStartTimestamp = estMomentStartTimestamp.clone().tz('UTC');
        const startTimestamp = utcMomentStartTimestamp.format('YYYY-MM-DD HH:mm:ss');
        const formattedStartTimestamp = new Date(startTimestamp).getTime().toString();

        const addTimeMinutes = booking?.type === "Property Tour" ? 60 : 15;
        const endTimestampEst = moment(estMomentStartTimestamp).add(addTimeMinutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        const estMomentEndTimestamp = moment.tz(endTimestampEst, 'YYYY-MM-DD HH:mm:ss', 'America/New_York');
        const utcMomentEndTimestamp = estMomentEndTimestamp.clone().tz('UTC');
        const endTimestamp = utcMomentEndTimestamp.format('YYYY-MM-DD HH:mm:ss');
        const formattedEndTimestamp = new Date(endTimestamp).getTime().toString();

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

        setViewConflicts(false);

        try {
            await rescheduleBooking.mutateAsync({
                uid: booking?.uid,
                bookingType: booking?.type,
                customerNotes: notes,
                startTimestamp: startTimestamp,
                endTimestamp: endTimestamp,
            });


            await refetchBookings();
            toast({
                title: "Booking Rescheduled",
                description: "The booking has been successfully rescheduled.",
                className: toastSuccessStyle,
            })
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "An error occurred while rescheduling the booking.",
                className: toastErrorStyle,
            });

            setIsLoading(false);
            setIsSuccess(false);
            setStartDate(undefined);
            setStartTime("");
            setOpen(false);
            return;
        }

        setIsLoading(false);
        setIsSuccess(true);

        setTimeout(() => {
            setNotes("");
            setStartDate(undefined);
            setStartTime("");
            setOpen(false);
            setIsSuccess(false);
        }, 2000);

        setTimeout(() => {
            setViewConflicts(true);
        }, 2500);
    };

    const [infoTooltipOpened, setInfoTooltipOpened] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    disabled={booking?.status === "completed"}
                    className={cn("w-full space-x-2")}
                    onClick={
                        async () => {
                            if (booking?.status === "completed") return;
                            setOpen(true);
                        }
                    }
                >
                    <CalendarClock className="w-4 h-4" />
                    <div>
                        Reschedule
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="flex flex-row items-center space-x-2">
                        <h1>Reschedule Booking</h1>
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
                    <DialogDescription className="text-start">
                        Reschedule the {booking?.type.toLowerCase()} with {booking?.firstName} {booking?.lastName}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll">
                    <div className="grid gap-4 px-6 py-2">
                        <div>
                            <div className="flex flex-row items-center space-x-2">
                                {/* @ts-expect-error TODO: fix this type */}
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
                            <div className="text-xs text-muted-foreground text-center mt-1">EST Timezone 24H Time</div>
                        </div>
                        <SuggestedTimes
                            startDate={startDate}
                            startTime={startTime}
                            setStartDate={setStartDate}
                            setStartTime={setStartTime}
                            bookingType={booking?.type}
                        />
                        {viewConflicts &&
                            <ConflictingBookings
                                startDate={startDate}
                                startTime={startTime}
                                bookingType={booking?.type}
                                bookings={bookings}
                            />}
                    </div>
                </div>
                <DialogFooter className="flex flex-row items-center space-x-2 px-6 pb-6">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setNotes("");
                                setStartDate(undefined);
                                setStartTime("");
                                setOpen(false);
                            }}
                            disabled={isLoading || isSuccess}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" className="w-full" onClick={handleReschedule}
                        disabled={!startDate || !startTime || isSuccess || isLoading}>
                        {isLoading ? <Spinner /> : (isSuccess ? <CircleCheck className="w-4 h-4 animate-pop" /> : "Reschedule")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RescheduleBookingDialog
