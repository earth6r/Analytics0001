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
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { useState } from "react";
import { api } from "@/utils/api";
import Spinner from "../common/spinner";
import { Check } from "lucide-react";

interface MarkCompletedPostNotesDialogProps {
    booking: any;
    getBooking: any;
};

const MarkCompletedPostNotesDialog = (props: MarkCompletedPostNotesDialogProps) => {
    const { booking, getBooking } = props;

    const [postNotes, setPostNotes] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const completeBooking = api.bookings.completeBooking.useMutation();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="w-full space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Mark As Completed</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Post Meeting Notes</DialogTitle>
                    <DialogDescription>
                        Add notes about the meeting you had with this potential customer to complete the booking.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Label htmlFor="post-notes">Post Meeting Notes</Label>
                    <Textarea
                        id="post-notes"
                        rows={4}
                        value={postNotes}
                        onChange={(e) => setPostNotes(e.target.value)}
                        className="resize-none"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={
                        async () => {
                            setLoading(true);
                            await completeBooking.mutateAsync({ uid: booking?.uid, bookingType: booking?.type, postNotes, });
                            await getBooking.refetch();
                            setPostNotes('');
                            setOpen(false);
                            setLoading(false);
                        }
                    }
                        disabled={loading || !postNotes}
                    >
                        {loading ? <Spinner /> : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MarkCompletedPostNotesDialog;
