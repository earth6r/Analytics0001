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
import { Textarea } from "../ui/textarea"
import { useState } from "react";
import { api } from "@/utils/api";
import Spinner from "../common/spinner";
import { Check, Save } from "lucide-react";
import { DatePicker } from "./date-picker";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { toastSuccessStyle } from "@/lib/toast-styles";
import NextStepsDropdown from "./next-steps-dropdown";
import moment from "moment-timezone";

interface MarkCompletedPostNotesDialogProps {
    booking: any;
};

const NextStepsDialog = (props: MarkCompletedPostNotesDialogProps) => {
    const { booking } = props;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // next steps
    const [nextStepsNotes, setNextStepsNotes] = useState('');
    const [nextStepsDropdownValue, setNextStepsDropdownValue] = useState('');
    const [otherNextSteps, setOtherNextSteps] = useState('');
    const [deferredDate, setDeferredDate] = useState<Date | null>(null);

    const addNextSteps = api.bookings.addNextSteps.useMutation();
    // TODO: query existing next steps if exists and useEffect to set the values, add skeleton loading


    // TODO: break out into several components into a subfolder with a proper structure i.e. parent folder would be meeting-notes/...
    // https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=74675897
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="w-full space-x-2 select-none">
                    <Check className="w-4 h-4" />
                    <span className="block xl:hidden">Next Steps</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 select-none">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Next Steps</DialogTitle>
                    <DialogDescription>
                        {`Potential customer's lead status and next steps`}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll">
                    <div className="grid gap-4 px-6 py-2">
                        <div>
                            <Textarea
                                id="next-steps"
                                rows={4}
                                value={nextStepsNotes}
                                onChange={(e) => setNextStepsNotes(e.target.value)}
                                className="resize-none mt-2"
                                placeholder="Notes about next steps"
                            />
                            <div className="mt-2">
                                <NextStepsDropdown
                                    value={nextStepsDropdownValue}
                                    onChange={(value) => setNextStepsDropdownValue(value)}
                                />
                            </div>
                            {
                                nextStepsDropdownValue === "other" &&
                                <div>
                                    <Input
                                        id="other-next-steps"
                                        value={otherNextSteps}
                                        onChange={(e) => setOtherNextSteps(e.target.value)}
                                        className="resize-none mt-2"
                                        placeholder="You've selected other, describe the next steps"
                                    />
                                </div>
                            }
                            <div className="mt-2">
                                <DatePicker
                                    placeholder="Select the deferred date"
                                    // @ts-expect-error TODO: fix type error
                                    value={deferredDate}
                                    onValueChange={(value) => setDeferredDate(value as Date)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="px-6 pb-6">
                    <Button onClick={
                        async () => {
                            setLoading(true);

                            // convert deferredDate to utc
                            let deferredDateUtc = null;
                            if (deferredDate) {
                                deferredDateUtc = moment(deferredDate).utc().unix();
                            }
                            await addNextSteps.mutateAsync({
                                email: booking.email,
                                nextStepsNotes,
                                nextStepsDropdownValue,
                                otherNextSteps,
                                deferredDate: deferredDateUtc,
                            });
                            // TODO: do i refetch the table?
                            setOpen(false);
                            setLoading(false);

                            setNextStepsNotes('');
                            setNextStepsDropdownValue('');
                            setOtherNextSteps('');
                            setDeferredDate(null);

                            toast({
                                title: "Success", // TODO: keep all the titles and descriptions the same format and similar text labels
                                description: "Marked booking as completed",
                                className: toastSuccessStyle,
                            })
                        }
                    }
                        disabled={loading || nextStepsNotes === '' || nextStepsDropdownValue === '' || (nextStepsDropdownValue === "other" && otherNextSteps === '')}
                        className="w-full"
                    >
                        {loading ? <Spinner /> :
                            <div className="flex items-center justify-center space-x-2">
                                <Save className="w-4 h-4" />
                                <h1>Save</h1>
                            </div>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NextStepsDialog;
