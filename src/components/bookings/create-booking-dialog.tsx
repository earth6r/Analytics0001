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

interface CreateBookingDialogProps {
    refetch: () => Promise<any>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateBookingDialog = (props: CreateBookingDialogProps) => {
    const { refetch, open, onOpenChange } = props;

    const [email, setEmail] = useState<string>("");
    const [timestamp, setTimestamp] = useState<string>("");
    const [typeOfBooking, setTypeOfBooking] = useState<'propertyTour' | "phoneCall" | null | undefined>(undefined);
    const [propertyType, setPropertyType] = useState<string | null | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");

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

        if (!timestamp) {
            toast({
                title: "Timestamp is required",
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

            const formattedTimestamp = new Date(timestamp).getTime().toString();

            if (isNaN(Number(formattedTimestamp))) {
                toast({
                    title: "Invalid timestamp",
                    description: "Please enter a valid timestamp.",
                    className: toastErrorStyle,
                });
                setIsLoading(false);
                return;
            }

            const createBooking = typeOfBooking === "propertyTour" ? createPropertyTourBooking : createPhoneBooking;
            // @ts-expect-error TODO: fix type
            await createBooking.mutateAsync({ email, timestamp: formattedTimestamp, typeOfBooking, propertyType, phoneNumber });

            await refetch();

            setEmail("");
            setPhoneNumber("");
            setTimestamp("");
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default">+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Booking</DialogTitle>
                    <DialogDescription>
                        {`Create a new booking in the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            className="w-[250px]"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="timestamp">
                            Timestamp
                        </Label>
                        {/* TODO: think about whether there should be a date picker input and a time picker input */}
                        {/* TODO: add exact length for string restriction to len of 19 XXXX-XX-XX XX:XX:XX */}
                        <Input
                            id="timestamp"
                            className="w-[250px]"
                            onChange={(e) => setTimestamp(e.target.value)}
                            value={timestamp}
                            placeholder="YYYY-MM-DD HH:MM:SS"
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="phoneNumber">
                            Phone Number
                        </Label>
                        <Input
                            id="phoneNumber"
                            className="w-[250px]"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="typeOfBooking">
                            Type of Booking
                        </Label>
                        {/* @ts-expect-error TODO: fix type */}
                        <TypeOfBookingSelect className="w-[250px]" selectedItem={typeOfBooking} setSelectedItem={setTypeOfBooking} />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        {/* TODO: disable if type is phone call booking */}
                        <Label htmlFor="propertyType">
                            Property Type
                        </Label>
                        <BuyingPropertyTypeSelect className="w-[250px]" selectedItem={propertyType} setSelectedItem={setPropertyType} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" className="w-full" onClick={() => {
                        setEmail("");
                        setPropertyType(null);
                        setTimestamp("");
                        setTypeOfBooking(undefined);
                        setPhoneNumber("");
                    }}>Clear</Button>
                    {/* TODO: hover on button for error messages of reason it is disabled, immediate tooltip */}
                    <Button type="submit" className="w-full" onClick={onSubmit}
                        disabled={isLoading || !email || !email.includes("@") || !email.includes(".") || !timestamp || !typeOfBooking || (typeOfBooking === "propertyTour" && !propertyType) || !phoneNumber}>
                        {isLoading ? <Spinner /> : "Create Booking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBookingDialog;
