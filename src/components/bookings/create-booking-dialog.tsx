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
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import { useState } from "react"
import { toast } from "../ui/use-toast"
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles"
import { TypeOfBookingSelect } from "./type-of-booking-select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
// import { useForm } from "react-hook-form"

interface CreateBookingDialogProps {
    refetch: () => Promise<any>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateBookingDialog = (props: CreateBookingDialogProps) => {
    const { refetch, open, onOpenChange } = props;

    const [email, setEmail] = useState<string>("");
    const [startTimestamp, setStartTimestamp] = useState<string>("");
    const [endTimestamp, setEndTimestamp] = useState<string>("");
    const [typeOfBooking, setTypeOfBooking] = useState<'propertyTour' | "phoneCall" | null | undefined>(undefined);
    const [propertyType, setPropertyType] = useState<string | null | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [notes, setNotes] = useState("");

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

        if (!startTimestamp) {
            toast({
                title: "Start Timestamp is required",
                description: "Please enter the timestamp.",
                className: toastErrorStyle,
            });
            return;
        }

        if (!endTimestamp) {
            toast({
                title: "End Timestamp is required",
                description: "Please enter the timestamp.",
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

            const formattedStartTimestamp = new Date(startTimestamp).getTime().toString();
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

            const createBooking = typeOfBooking === "propertyTour" ? createPropertyTourBooking : createPhoneBooking;
            // @ts-expect-error TODO: fix type
            await createBooking.mutateAsync({ email, startTimestamp: formattedStartTimestamp, endTimestamp: formattedEndTimestamp, typeOfBooking, propertyType, phoneNumber, notes, firstName, lastName });

            await refetch();

            setEmail("");
            setFirstName("");
            setLastName("");
            setPhoneNumber("");
            setStartTimestamp("");
            setEndTimestamp("");
            setTypeOfBooking(undefined);
            setPropertyType(null);

            setIsLoading(false);

            toast({
                title: "Booking created",
                description: "The booking was successfully created in the database.",
                className: toastSuccessStyle,
            });
            onOpenChange(false);
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "An error occurred",
                description: "An error occurred while creating a booking in the database.",
                className: toastErrorStyle,
            });
        }
    }

    const disabled = isLoading || !email || !email.includes("@") || !email.includes(".") || !startTimestamp || !endTimestamp || !typeOfBooking || (typeOfBooking === "propertyTour" && !propertyType) || !phoneNumber || !firstName || !lastName;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default">+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Booking</DialogTitle>
                    <DialogDescription>
                        Create a new booking in the database. This will not send a Google Calendar invite.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

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
                    <Input
                        id="startTimestamp"
                        placeholder="Start Timestamp YYYY-MM-DD HH:MM:SS"
                        onChange={(e) => setStartTimestamp(e.target.value)}
                        value={startTimestamp}
                    />
                    {/* TODO: think about whether there should be a date picker input and a time picker input */}
                    {/* TODO: add exact length for string restriction to len of 19 XXXX-XX-XX XX:XX:XX */}
                    <Input
                        id="endTimestamp"
                        placeholder="End Timestamp YYYY-MM-DD HH:MM:SS"
                        onChange={(e) => setEndTimestamp(e.target.value)}
                        value={endTimestamp}
                    />
                    <Input
                        id="phoneNumber"
                        placeholder="Phone Number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                    />
                    {/* @ts-expect-error TODO: fix type */}
                    <TypeOfBookingSelect className="w-full" selectedItem={typeOfBooking} setSelectedItem={setTypeOfBooking} />
                    <Input
                        id="notes"
                        placeholder="Notes"
                        onChange={(e) => setNotes(e.target.value)}
                        value={notes}
                    />
                    {/* TODO: disable if type is phone call booking */}
                    <BuyingPropertyTypeSelect className="w-full" selectedItem={propertyType} setSelectedItem={setPropertyType} />
                </div>
                <DialogFooter>
                    <Button variant="outline" className="w-full" onClick={() => {
                        setEmail("");
                        setPropertyType(null);
                        setStartTimestamp("");
                        setEndTimestamp("");
                        setTypeOfBooking(null);
                        setPhoneNumber("");
                    }} disabled={
                        isLoading || (!email && !startTimestamp && !endTimestamp && !phoneNumber && !typeOfBooking && !propertyType)
                    }>Clear</Button>
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger className="w-full">
                                <Button type="submit" className="w-full" onClick={onSubmit}
                                    disabled={disabled}>
                                    {isLoading ? <Spinner /> : "Create Booking"}
                                </Button>
                            </TooltipTrigger>
                            {disabled && <TooltipContent>
                                <div className="space-y-1">
                                    <div className="font-medium">{`Please fill in all the required fields:`}</div>
                                    <div>{!email && `The email is required.`}</div>
                                    <div>{email && (!email.includes("@") || !email.includes(".")) && "The email is invalid. Requires a `.` and a `@`"}</div>
                                    <div>{!startTimestamp && `The start timestamp is required.`}</div>
                                    <div>{startTimestamp && isNaN(Number(new Date(startTimestamp).getTime().toString())) && `The timestamp is invalid. Expected format is YYYY-MM-DD HH:MM:SS`}</div>
                                    <div>{startTimestamp && startTimestamp.length !== 19 && `The timestamp must be of length 19.`}</div>
                                    <div>{!endTimestamp && `The end timestamp is required.`}</div>
                                    <div>{endTimestamp && isNaN(Number(new Date(endTimestamp).getTime().toString())) && `The timestamp is invalid. Expected format is YYYY-MM-DD HH:MM:SS`}</div>
                                    <div>{!phoneNumber && `The phone number is required.`}</div>
                                    <div>{!typeOfBooking
                                        && `The type of booking is required.`}</div>
                                    <div>{typeOfBooking === "propertyTour" && !propertyType && `The property type is required.`}</div>
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
