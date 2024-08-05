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
import { CalendarClock, CircleCheck } from "lucide-react"
import { useState } from "react"
import Spinner from "../common/spinner"
import { DatePicker } from "./date-picker"

interface RescheduleDialogProps {
    booking: any;
    refetchBookings: () => Promise<any>;
}

const RescheduleBookingDialog = (props: RescheduleDialogProps) => {
    const { booking, refetchBookings } = props;

    const [notes, setNotes] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const rescheduleBooking = api.bookings.rescheduleBooking.useMutation();

    async function handleReschedule() {
        setIsLoading(true);
        // TODO: need to call endpoint in Home0001 to create calendar booking + send whatsapp message
        alert(`${startDate.toISOString().split("T")[0]} ${startTime}:00`)
        alert(`${endDate.toISOString().split("T")[0]} ${endTime}:00`)
        await rescheduleBooking.mutateAsync({
            uid: booking?.uid,
            bookingType: booking?.type,
            customerNotes: notes,
            startTimestamp: `${startDate.toISOString().split("T")[0]} ${startTime}:00`,
            endTimestamp: `${endDate.toISOString().split("T")[0]} ${endTime}:00`
        });


        await refetchBookings();

        setIsLoading(false);
        setIsSuccess(true);

        setTimeout(() => {
            setNotes("");
            setStartDate(new Date());
            setEndDate(new Date());
            setStartTime("");
            setEndTime("");
            setOpen(false);
            setIsSuccess(false);
        }, 2000);
    };

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
                    <DialogTitle>Reschedule Meeting</DialogTitle>
                    <DialogDescription>
                        Reschedule the meeting with {booking?.firstName} {booking?.lastName}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll">
                    <div className="grid gap-4 px-6 py-2">
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
                            id="notes"
                            type="text"
                            placeholder="Customer Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
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
                                setStartDate(new Date());
                                setEndDate(new Date());
                                setStartTime("");
                                setEndTime("");
                                setOpen(false);
                            }}
                            disabled={isLoading || isSuccess}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" className="w-full" onClick={handleReschedule}
                        disabled={!startDate || !startTime || !endDate || !endTime || isSuccess || isLoading}>
                        {isLoading ? <Spinner /> : (isSuccess ? <CircleCheck className="w-4 h-4 animate-pop" /> : "Reschedule")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RescheduleBookingDialog
