import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "../ui/use-toast";
import { useState } from "react";
import { api } from "@/utils/api";
import {
    BuyingPropertyTypeSelect,
    validUserBuyingPropertyTypes,
} from "./buying-property-type-select";
import Spinner from "../common/spinner";

interface SetBuyingPropertyTypeDialogProps {
    currentValue: string;
    email: string;
    refetch: () => Promise<void>;
}

const SetBuyingPropertyTypeDialog = (
    props: SetBuyingPropertyTypeDialogProps,
) => {
    const { currentValue, email, refetch } = props;
    const [selectedItem, setSelectedItem] = useState<string | undefined>(
        currentValue,
    );

    const setUserBuyingPropertyType =
        api.post.setUserBuyingPropertyType.useMutation();

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit() {
        if (
            !selectedItem ||
            !validUserBuyingPropertyTypes.includes(selectedItem)
        ) {
            toast({
                title: "Invalid property type",
                description: "The property type is not valid.",
            });
            return;
        }
        try {
            setIsLoading(true);
            const response = await setUserBuyingPropertyType.mutateAsync({
                email,
                propertyType: selectedItem,
            });
            setIsLoading(false);

            if (response?.error === "user_already_exists") {
                toast({
                    title: "User already exists",
                    description: "The user already exists in the database.",
                });
                return;
            }

            toast({
                title: "User created",
                description:
                    "The user was successfully created in the database.",
            });
            await refetch();
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "An error occurred",
                description:
                    "An error occurred while creating the user in the database.",
            });
        }
    }

    return (
        <Dialog>
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
                        <BuyingPropertyTypeSelect
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        className="w-full"
                        onClick={onSubmit}
                        disabled={
                            isLoading ||
                            !selectedItem ||
                            !validUserBuyingPropertyTypes.includes(selectedItem)
                        }
                    >
                        {isLoading ? <Spinner /> : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SetBuyingPropertyTypeDialog;
