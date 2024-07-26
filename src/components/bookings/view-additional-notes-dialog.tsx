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
import { CircleX, Notebook, Pencil, Save } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import Spinner from "../common/spinner";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { toastErrorStyle } from "@/lib/toast-styles";

interface ViewAdditionalNotesDialogProps {
    booking: any;
    getBookings: any;
}

const ViewAdditionalNotesDialog = (props: ViewAdditionalNotesDialogProps) => {
    const { booking, getBookings } = props;

    const [editMode, setEditMode] = useState(false);
    const [newNotes, setNewNotes] = useState(booking?.additionalNotes || "");
    const [loading, setLoading] = useState(false);

    const updateAdditionalNotes = api.bookings.updateAdditionalNotes.useMutation();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="space-x-2 w-full select-none" variant="default">
                    <Notebook className="w-4 h-4" />
                    <div>
                        Meeting Notes
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Meeting Notes</DialogTitle>
                    <DialogDescription>
                        Meeting notes for the booking.
                    </DialogDescription>
                </DialogHeader>
                {editMode ? <div>
                    <Textarea
                        id="additional-notes"
                        value={newNotes || ""}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="resize-none h-96"
                    />
                </div> : <div className="max-h-96 overflow-y-scroll">
                    <pre>
                        {booking?.additionalNotes || "No additional notes set"}
                    </pre>
                </div>}
                <DialogFooter className="flex flex-row items-center justify-between space-x-4">
                    <DialogClose className="w-full">
                        <Button className="w-full space-x-2" variant="outline" onClick={() => setEditMode(false)}>
                            <CircleX className="w-4 h-4" />
                            <span>Close</span>
                        </Button>
                    </DialogClose>
                    <Button className="w-full space-x-2 select-none" onClick={
                        async () => {
                            if (editMode) {
                                setLoading(true);

                                try {
                                    await updateAdditionalNotes.mutateAsync({
                                        uid: booking.uid,
                                        additionalNotes: newNotes,
                                        bookingType: booking.type,
                                    });
                                    await getBookings.refetch();
                                } catch (e) {
                                    console.error(e);
                                    toast({
                                        title: "Error",
                                        description: "Failed to update notes",
                                        className: toastErrorStyle,
                                    })
                                }
                                setLoading(false);
                                setEditMode(false);
                            } else {
                                setEditMode(true);
                            }
                        }
                    }
                    disabled={booking?.status === "completed" || loading}
                    >
                        {!loading && (editMode ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />)}
                        <span>
                            {editMode ?
                                loading ? <Spinner /> : "Save"
                                : "Edit"}
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewAdditionalNotesDialog;
