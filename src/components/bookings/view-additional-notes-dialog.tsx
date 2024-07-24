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
import { Notebook } from "lucide-react";

interface ViewAdditionalNotesDialogProps {
    notes: string | null;
}

const ViewAdditionalNotesDialog = (props: ViewAdditionalNotesDialogProps) => {
    const { notes } = props;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="space-x-2" variant="default">
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
                <div className="max-h-96 overflow-y-scroll">
                    <pre>
                        {notes || "No additional notes set"}
                    </pre>
                </div>
                <DialogFooter className="flex flex-row items-center justify-between space-x-4">
                    <DialogClose className="w-full">
                        <Button className="w-full" variant="default">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewAdditionalNotesDialog;
