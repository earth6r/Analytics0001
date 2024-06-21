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
import { toast } from "../ui/use-toast"
import { useState } from "react"
import { api } from "@/utils/api"
import { BuyingPropertyTypeSelect } from "./buying-property-type-select"
import Spinner from "../common/spinner"
import { propertyTypes } from "@/lib/property-types"
import { TrueFalseSelect } from "./true-false-select"
import { Input } from "../ui/input"

interface UpdateDialogProps {
    currentValue: any;
    email: string;
    refetch: () => Promise<any>;
    dialogOpenedByIndex: number | null;
    setDialogOpenedByIndex: (open: number | null) => void;
    index: number;
}

const UpdateDialog = (props: UpdateDialogProps) => {
    const { currentValue, email, refetch, dialogOpenedByIndex, setDialogOpenedByIndex, index } = props;

    const [selectedItem, setSelectedItem] = useState<string | undefined>(currentValue?.userBuyingPropertyType);
    const [escrowDeposit, setEscrowDeposit] = useState<boolean | undefined>(currentValue?.buyingProgressData?.escrowDeposit);
    const [scheduleClosing, setScheduleClosing] = useState<boolean | undefined>(currentValue?.buyingProgressData?.scheduleClosing);
    const [downloadDocuments, setDownloadDocuments] = useState<boolean | undefined>(currentValue?.buyingProgressData?.downloadDocuments);
    const [fullPayment, setFullPayment] = useState<boolean | undefined>(currentValue?.buyingProgressData?.fullPayment);
    const [firstName, setFirstName] = useState<string | undefined>(currentValue?.firstName);
    const [lastName, setLastName] = useState<string | undefined>(currentValue?.lastName);

    const setUserBuyingPropertyType = api.post.setUserBuyingPropertyType.useMutation();
    const updateBuyingProgressBooleanValues = api.post.updateBuyingProgressBooleanValues.useMutation();
    const updateUserDetails = api.post.updateUserDetails.useMutation();

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit() {
        if (!selectedItem || !propertyTypes.includes(selectedItem)) {
            toast({
                title: "Invalid property type",
                description: "The property type is not valid.",
            });
            return;
        }
        try {
            // if (typeof escrowDeposit !== "boolean" || typeof scheduleClosing !== "boolean" || typeof downloadDocuments !== "boolean" || typeof fullPayment !== "boolean") {
            //     toast({
            //         title: "Invalid boolean value(s)",
            //         description: "The boolean value(s) are not valid.",
            //     });
            //     return;
            // }
            setIsLoading(true);
            await setUserBuyingPropertyType.mutateAsync({ email, propertyType: selectedItem });
            await updateBuyingProgressBooleanValues.mutateAsync({
                email,
                escrowDeposit: escrowDeposit || false,
                scheduleClosing: scheduleClosing || false,
                downloadDocuments: downloadDocuments || false,
                fullPayment: fullPayment || false,
            });
            await updateUserDetails.mutateAsync({ email, firstName: firstName || "", lastName: lastName || "" });
            await refetch();
            setIsLoading(false);
            toast({
                title: "Property type set",
                description: "The property type has been set successfully.",
            });
            setDialogOpenedByIndex(null);
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "An error occurred",
                description: "An error occurred while creating the user in the database.",
            });
        }
    }

    return (
        <Dialog open={dialogOpenedByIndex === index} onOpenChange={(open) => setDialogOpenedByIndex(open ? index : null)}>
            <DialogTrigger asChild>
                <Button variant="default">Update Details</Button>
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
                            First Name
                        </Label>
                        <Input
                            className="w-[220px]"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Last Name
                        </Label>
                        <Input
                            className="w-[220px]"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Type
                        </Label>
                        <BuyingPropertyTypeSelect selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                    </div>
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
                        isLoading || !selectedItem || !propertyTypes.includes(selectedItem)
                    }>
                        {isLoading ? <Spinner /> : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateDialog;
