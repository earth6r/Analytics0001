import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MarkCompletedPostNotesAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    uid: string;
    notesOpens: any;
    setNotesOpens: (open: boolean) => void;
}

const MarkCompletedPostNotesAlertDialog = (props: MarkCompletedPostNotesAlertDialogProps) => {
    const { open, onOpenChange, uid, notesOpens, setNotesOpens } = props;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add notes to the meeting</AlertDialogTitle>
                    <AlertDialogDescription>
                        Would you like to add notes to the meeting?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Not Today</AlertDialogCancel>
                    <AlertDialogAction onClick={
                        () => {
                            setNotesOpens(
                                {
                                    ...notesOpens,
                                    [uid]: true,
                                }
                            );
                            onOpenChange(false);
                        }
                    }>Sure</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default MarkCompletedPostNotesAlertDialog;
