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
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Spinner from "../common/spinner";
import { Check, CircleAlert, CircleOff, Hourglass, Save } from "lucide-react";
import { DatePicker } from "./date-picker";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { toastSuccessStyle } from "@/lib/toast-styles";
import NextStepsDropdown, { nextStepsMapping } from "./next-steps-dropdown";
import moment from "moment-timezone";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import NextStepDialogTabs from "./next-step-dialog-tabs";

interface NextStepsDialogProps {
    previousIndex?: number;
    email: string;
    variant?: string;
};

const NextStepsDialog = (props: NextStepsDialogProps) => {
    const { previousIndex = null, email, variant = undefined } = props;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // next steps
    const [typeOfStep, setTypeOfStep] = useState<string | null>(null);
    const [nextStepsNotes, setNextStepsNotes] = useState('');
    const [nextStepsDropdownValue, setNextStepsDropdownValue] = useState('');
    const [otherNextSteps, setOtherNextSteps] = useState('');
    const [deferredDate, setDeferredDate] = useState<Date | null>(null);
    const [existingChainVisible, setExistingChainVisible] = useState(false);

    const addNextSteps = api.bookings.addNextSteps.useMutation();
    const existingNextSteps = api.bookings.getNextSteps.useQuery(
        {
            email: email
        },
        {
            enabled: !!email
        }
    );

    const api_utils = api.useUtils();

    // TODO: break out into several components into a subfolder with a proper structure i.e. parent folder would be meeting-notes/...
    // https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=74675897
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="w-full space-x-2 select-none">
                    {variant ? variant : <Check className="w-4 h-4" />}
                    <span className={cn("block xl:hidden", variant && "ml-1")}>Next Steps</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 select-none">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Next Steps</DialogTitle>
                    <DialogDescription>
                        {`Add the potential customer's lead status and next steps.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll">
                    <div className="grid gap-4 px-6 py-2">
                        <NextStepDialogTabs
                            nextStepsNotes={nextStepsNotes}
                            setNextStepsNotes={setNextStepsNotes}
                            deferredDate={deferredDate}
                            setDeferredDate={setDeferredDate}
                            typeOfStep={typeOfStep}
                            setTypeOfStep={setTypeOfStep}
                            nextStepsDropdownValue={nextStepsDropdownValue}
                            setNextStepsDropdownValue={setNextStepsDropdownValue}
                            otherNextSteps={otherNextSteps}
                            setOtherNextSteps={setOtherNextSteps}
                            existingNextSteps={existingNextSteps}
                            existingChainVisible={existingChainVisible}
                            setExistingChainVisible={setExistingChainVisible}
                        />
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
                                previousIndex: previousIndex,
                                email: email,
                                nextStepsNotes,
                                nextStepsDropdownValue: nextStepsDropdownValue === "other" ? `${typeOfStep}:${otherNextSteps}` : nextStepsDropdownValue,
                                deferredDate: deferredDateUtc,
                            });
                            await existingNextSteps.refetch();
                            await api_utils.user.getPotentialCustomerDetails.refetch();
                            await api_utils.user.allNextSteps.refetch();
                            setOpen(false);
                            setLoading(false);

                            setNextStepsNotes('');
                            setNextStepsDropdownValue('');
                            setOtherNextSteps('');
                            setDeferredDate(null);
                            setExistingChainVisible(false);
                            setTypeOfStep(null);

                            toast({
                                title: "Success", // TODO: keep all the titles and descriptions the same format and similar text labels
                                description: "Next steps saved successfully.",
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
