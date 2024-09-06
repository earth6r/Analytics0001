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
import { Check } from "lucide-react"
import Spinner from "../common/spinner"
import { useState } from "react"

interface MarkNextStepsAsCompletedDialogProps {
    index: number;
    email: string;
}

const MarkNextStepsAsCompletedDialog = (props: MarkNextStepsAsCompletedDialogProps) => {
    const { index, email } = props;

    const api_utils = api.useUtils();
    const markNextStepAsCompleted = api.bookings.markNextStepAsCompleted.useMutation();

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full">
                <Button variant="outline" className="w-full flex flex-row items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <div className="block xl:hidden">Mark as Completed</div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mark Step as Completed</DialogTitle>
                    <DialogDescription>
                        Mark this step as completed.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full">
                    <Button
                        className="w-full"
                        onClick={
                            async () => {
                                setLoading(true);
                                await markNextStepAsCompleted.mutateAsync({
                                    index: index,
                                    email: email,
                                });
                                await api_utils.user.allNextSteps.refetch();
                                setLoading(false);
                                setOpen(false);
                            }
                        }
                    >
                        {loading ? <Spinner /> : "Mark as Completed"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MarkNextStepsAsCompletedDialog;
