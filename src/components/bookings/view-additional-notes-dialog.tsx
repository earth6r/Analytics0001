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
import { Notebook, Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
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
    const [newNotes, setNewNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const updateAdditionalNotes = api.bookings.updateAdditionalNotes.useMutation();

    useEffect(() => {
        setNewNotes(booking?.additionalNotes || "");
    }, [booking]);

    return (
        <Dialog onOpenChange={
            (isOpen) => {
                if (!isOpen) {
                    setEditMode(false);
                }
            }
        }>
            <DialogTrigger asChild>
                <Button className="w-full xl:max-w-max select-none" variant="default">
                        <div className="flex flex-row items-center space-x-1">
                            <Notebook className="w-4 h-4" />
                            <div>
                                Meeting Notes
                            </div>
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
                    <div className="whitespace-pre-wrap break-words">
                        {booking?.additionalNotes || "No additional notes set"}
                    </div>
                </div>}
                <DialogFooter className="flex flex-row items-center justify-between space-x-4">
                    <DialogClose className="w-full">
                        <Button className="w-full space-x-2" variant="outline" onClick={() => setEditMode(false)}>
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
