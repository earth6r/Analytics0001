import Spinner from "@/components/common/spinner"
import { BuyingPropertyTypeSelect } from "@/components/customers/buying-property-type-select"
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
import { propertyTypes } from "@/lib/property-types"
import { api } from "@/utils/api"
import { useState } from "react"
import { toast } from "../ui/use-toast"
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles"

interface UpdateUserDetailsDialogProps {
    currentValue: any;
    email: string;
    refetch: () => Promise<any>;
    dialogOpenedByIndex: number | null;
    setDialogOpenedByIndex: (open: number | null) => void;
    index: number;
}

const UpdateUserDetailsDialog = (props: UpdateUserDetailsDialogProps) => {
    const { currentValue, email, refetch, dialogOpenedByIndex, setDialogOpenedByIndex, index } = props;

    const setUserBuyingPropertyType = api.post.setUserBuyingPropertyType.useMutation();
    const updateUserDetails = api.post.updateUserDetails.useMutation();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | undefined>(currentValue?.userBuyingPropertyType);
    const [firstName, setFirstName] = useState<string>(currentValue?.firstName || "");
    const [lastName, setLastName] = useState<string>(currentValue?.lastName || "");

    async function onSubmit() {
        if (!selectedItem || !propertyTypes.includes(selectedItem)) {
            toast({
                title: "Invalid property type",
                description: "The property type is not valid.",
                className: toastErrorStyle,
            });
            return;
        }
        try {
            setIsLoading(true);
            await setUserBuyingPropertyType.mutateAsync({ email, propertyType: selectedItem });
            await updateUserDetails.mutateAsync({ email, firstName, lastName });
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
                <Button variant="default">Update User Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update User Details</DialogTitle>
                    <DialogDescription>
                        {`This is the user's details that will be saved to the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            First Name
                        </Label>
                        <Input
                            className="w-[290px]"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name">
                            Last Name
                        </Label>
                        <Input
                            className="w-[290px]"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="name" className="">
                            Type
                        </Label>
                        <BuyingPropertyTypeSelect selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
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

export default UpdateUserDetailsDialog;
