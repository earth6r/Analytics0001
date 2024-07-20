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
import { useState } from "react";
import Spinner from "../common/spinner";
import { NotebookPen } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { api } from "@/utils/api";

interface AddAdditionalNotesDialogProps {
    booking: any;
    refetch: () => Promise<any>;
}

const AddAdditionalNotesDialog = (props: AddAdditionalNotesDialogProps) => {
    const { booking, refetch } = props;

    const [open, onOpenChange] = useState(false);

    const [notes, setNotes] = useState(booking.additionalNotes || "");
    const [loading, setLoading] = useState(false);

    const updateAdditionalNotes = api.bookings.updateAdditionalNotes.useMutation();

    const handleClick = async () => {
        setLoading(true);
        await updateAdditionalNotes.mutateAsync({
            uid: booking.uid,
            additionalNotes: notes,
            bookingType: booking.type,
        })
        await refetch();
        setLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="px-3">
                    <NotebookPen className="" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Additional Notes</DialogTitle>
                    <DialogDescription>
                        Add additional notes for the booking.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add additional notes..."
                        className="w-full h-[400px] resize-none"
                    />
                </div>
                <DialogFooter className="flex flex-row items-center justify-between space-x-4">
                    <DialogClose className="w-full">
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="w-full" disabled={
                        (notes === "" && !booking.additionalNotes) || loading || notes === booking.additionalNotes
                    } onClick={handleClick}>
                        {loading ? <Spinner /> : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddAdditionalNotesDialog;
