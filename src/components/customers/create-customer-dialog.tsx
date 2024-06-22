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
import { toast } from "../ui/use-toast"
import { useState } from "react"
import { api } from "@/utils/api"
import Spinner from "@/components/common/spinner"
import { BuyingPropertyTypeSelect } from "@/components/customers/buying-property-type-select"

interface CreateCustomerDialogProps {
    refetch: () => Promise<any>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateCustomerDialog = (props: CreateCustomerDialogProps) => {
    const { refetch, open, onOpenChange } = props;

    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [propertyType, setPropertyType] = useState<string | null | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const createUserInDatabase = api.post.createUserInDatabase.useMutation();

    async function onSubmit() {
        if (!email) {
            toast({
                title: "Email is required",
                description: "Please enter the email address.",
            });
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
            });
            return;
        }

        if (!firstName) {
            toast({
                title: "First Name is required",
                description: "Please enter the first name.",
            });
            return;
        }

        if (!lastName) {
            toast({
                title: "Last Name is required",
                description: "Please enter the last name.",
            });
            return;
        }

        if (!propertyType) {
            toast({
                title: "Property Type is required",
                description: "Please enter the property type.",
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await createUserInDatabase.mutateAsync({ email, firstName, lastName, propertyType });

            if (response?.error === "user_already_exists") {
                toast({
                    title: "User already exists",
                    description: "The user already exists in the database.",
                });
                return;
            }
            await refetch();

            setEmail("");
            setFirstName("");
            setLastName("");
            setPropertyType(null);

            setIsLoading(false);

            toast({
                title: "User created",
                description: "The user was successfully created in the database.",
            });
            onOpenChange(false);
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "An error occurred",
                description: "An error occurred while creating the user in the database.",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default">+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Customer</DialogTitle>
                    <DialogDescription>
                        {`This is the email address that will be saved to the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            className="w-[250px]"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="firstName">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            className="w-[250px]"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="lastName">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            className="w-[250px]"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="propertyType">
                            Property Type
                        </Label>
                        <BuyingPropertyTypeSelect className="w-[250px]" selectedItem={propertyType} setSelectedItem={setPropertyType} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" className="w-full" onClick={() => {
                        setEmail("");
                        setFirstName("");
                        setLastName("");
                        setPropertyType(null);
                    }}>Clear</Button>
                    <Button type="submit" className="w-full" onClick={onSubmit}
                        disabled={isLoading || !email || !email.includes("@") || !email.includes(".") || !firstName || !lastName || !propertyType}
                    >
                        {isLoading ? <Spinner /> : "Create Customer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCustomerDialog;
