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

interface SetBuyingPropertyTypeDialogProps {
    currentValue: string;
    email: string;
    refetch: () => Promise<void>;
    dialogOpenedByIndex: number | null;
    setDialogOpenedByIndex: (open: number | null) => void;
    index: number;
}

const SetBuyingPropertyTypeDialog = (props: SetBuyingPropertyTypeDialogProps) => {
    const { currentValue, email, refetch, dialogOpenedByIndex, setDialogOpenedByIndex, index } = props;
    const [selectedItem, setSelectedItem] = useState<string | undefined>(currentValue);

    const setUserBuyingPropertyType = api.post.setUserBuyingPropertyType.useMutation();

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
            setIsLoading(true);
            await setUserBuyingPropertyType.mutateAsync({ email, propertyType: selectedItem });
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
                <Button variant="default">Set Buying Property Type</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Customer Buying Property Type</DialogTitle>
                    <DialogDescription>
                        {`This is the buying property type that will be saved to the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-7 items-center gap-7">
                        <Label htmlFor="name" className="text-right">
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

export default SetBuyingPropertyTypeDialog;
