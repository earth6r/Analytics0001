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
import { DetailItem } from "../customers/customer-details-dialog";
import { formatTimestamp } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "../common/spinner";

interface ViewBookingDetailsDialogProps {
    booking: any;
}

const ViewBookingDetailsDialog = (props: ViewBookingDetailsDialogProps) => {
    const { booking } = props;

    const router = useRouter();
    const [routeLoading, setRouteLoading] = useState(false);

    const handleClick = async () => {
        setRouteLoading(true);
        await router.push(`/user?email=${booking.email}`);
        setRouteLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">View Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>
                        View details of the booking.
                    </DialogDescription>
                </DialogHeader>
                <div className="px-1">
                    <DetailItem label="Email" value={
                        booking?.email || "No email set"
                    } />
                    <DetailItem label="UID" value={booking?.uid} copyable />
                    <DetailItem label="Type" value={booking?.type || "No type set"} />
                    <DetailItem label="Start Timestamp" value={formatTimestamp(booking.startTimestamp) || "No Start Timestamp set"} />
                    <DetailItem label="End Timestamp" value={formatTimestamp(booking.endTimestamp) || "No End Timestamp set"} />
                    <DetailItem label="Property" value={booking?.property || "No property set"} />
                    <DetailItem label="Phone Number" value={booking?.phoneNumber || "No phone number set"} />
                    <DetailItem label="First Name" value={booking?.firstName || "No first name set"} />
                    <DetailItem label="Last Name" value={booking?.lastName || "No last name set"} />
                    <DetailItem label="Notes" value={booking?.notes || "No notes set"} tooltipLabel={booking?.notes}/>
                    <DetailItem label="Additional Notes" value={booking?.additionalNotes || "No additional notes set"} tooltipLabel={booking?.additionalNotes}/>

                    {booking?.email && <div className="flex flex-row items-center justify-center mt-2">
                        {routeLoading ? <Spinner /> : <div onClick={handleClick} className="text-blue-400 hover:text-blue-500 cursor-pointer">View User Details</div>}
                    </div>}
                </div>
                <DialogFooter>
                    <DialogClose className="w-full">
                        <Button className="w-full">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewBookingDetailsDialog;
