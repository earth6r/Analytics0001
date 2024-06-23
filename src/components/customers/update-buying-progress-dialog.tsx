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
import { api } from "@/utils/api"
import { useState } from "react"
import Spinner from "../common/spinner"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"
import { TrueFalseSelect } from "./true-false-select"
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles"

interface UpdateDialogProps {
    currentValue: any;
    email: string;
    refetch: () => Promise<any>;
    dialogOpenedByIndex: number | null;
    setDialogOpenedByIndex: (open: number | null) => void;
    index: number;
}

const UpdateBuyingProgressDialog = (props: UpdateDialogProps) => {
    const { currentValue, email, refetch, dialogOpenedByIndex, setDialogOpenedByIndex, index } = props;

    const [escrowDeposit, setEscrowDeposit] = useState<boolean | undefined>(currentValue?.buyingProgressData?.escrowDeposit);
    const [scheduleClosing, setScheduleClosing] = useState<boolean | undefined>(currentValue?.buyingProgressData?.scheduleClosing);
    const [downloadDocuments, setDownloadDocuments] = useState<boolean | undefined>(currentValue?.buyingProgressData?.downloadDocuments);
    const [fullPayment, setFullPayment] = useState<boolean | undefined>(currentValue?.buyingProgressData?.fullPayment);

    const updateBuyingProgressBooleanValues = api.post.updateBuyingProgressBooleanValues.useMutation();

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit() {
        try {
            if (typeof escrowDeposit !== "boolean" || typeof scheduleClosing !== "boolean" || typeof downloadDocuments !== "boolean" || typeof fullPayment !== "boolean") {
                toast({
                    title: "This user has not started the buying process yet.",
                    description: "Once the user makes a deposit, the buying process will start.",
                    className: toastErrorStyle,
                });
                return;
            }
            setIsLoading(true);
            await updateBuyingProgressBooleanValues.mutateAsync({
                email,
                escrowDeposit,
                scheduleClosing,
                downloadDocuments,
                fullPayment,
            });
            await refetch();
            setIsLoading(false);
            toast({
                title: "Property type set",
                description: "The property type has been set successfully.",
                className: toastSuccessStyle,
            });
            setDialogOpenedByIndex(null);
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "An error occurred",
                description: "An error occurred while creating the user in the database.",
                className: toastErrorStyle,
            });
        }
    }

    return (
        <Dialog open={dialogOpenedByIndex === index} onOpenChange={(open) => setDialogOpenedByIndex(open ? index : null)}>
            <DialogTrigger asChild>
                <Button variant="default">Update Buying Progress Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update</DialogTitle>
                    <DialogDescription>
                        {`You can update various details for the customer from the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Escrow Deposit
                        </Label>
                        <TrueFalseSelect selectedItem={escrowDeposit} setSelectedItem={setEscrowDeposit} />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Schedule Closing
                        </Label>
                        <TrueFalseSelect selectedItem={scheduleClosing} setSelectedItem={setScheduleClosing} />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Download Documents
                        </Label>
                        <TrueFalseSelect selectedItem={downloadDocuments} setSelectedItem={setDownloadDocuments} />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Full Payment
                        </Label>
                        <TrueFalseSelect selectedItem={fullPayment} setSelectedItem={setFullPayment} />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Completed
                        </Label>
                        <Input
                            className="w-[220px] select-none"
                            value={escrowDeposit && scheduleClosing && downloadDocuments && fullPayment ? "True" : "False"}
                            readOnly
                            disabled
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full" onClick={onSubmit} disabled={
                        isLoading
                    }>
                        {isLoading ? <Spinner /> : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateBuyingProgressDialog;
