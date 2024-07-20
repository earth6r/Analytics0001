import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/utils/api";
import { Trash2 } from "lucide-react";
import Spinner from "../common/spinner";
import { useState } from "react";

interface DeleteBookingAlertDialogProps {
    booking: any;
    refetch: () => Promise<any>;
}

const DeleteBookingAlertDialog = (props: DeleteBookingAlertDialogProps) => {
    const { booking, refetch } = props;

    const deleteBooking = api.bookings.deleteBooking.useMutation();

    const [loading, setLoading] = useState(false);

    const [open, onOpenChange] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">
                    <Trash2 className="w-5 h-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the booking.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button className="bg-red-500 hover:bg-red-600" onClick={
                        async () => {
                            setLoading(true);
                            await deleteBooking.mutateAsync({
                                uid: booking.uid,
                                bookingType: booking.type,
                            });
                            await refetch();
                            setLoading(false);
                            onOpenChange(false);
                        }
                    }>
                        {loading ? <Spinner /> : "Continue"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default DeleteBookingAlertDialog;
