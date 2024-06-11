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

const CreateCustomerDialog = () => {
    const [email, setEmail] = useState<string>("");

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

        try {
            const response = await createUserInDatabase.mutateAsync({ email });

            if (response?.error === "user_already_exists") {
                toast({
                    title: "User already exists",
                    description: "The user already exists in the database.",
                });
                return;
            }
        } catch (error) {
            toast({
                title: "An error occurred",
                description: "An error occurred while creating the user in the database.",
            });
        }
    }

    return (
        <Dialog>
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
                    <div className="grid grid-cols-7 items-center gap-7">
                        <Label htmlFor="name" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="name"
                            className="col-span-6"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                </div>
                <DialogFooter>
                <Button variant="outline" className="w-full" onClick={() => {setEmail("");}}>Clear</Button>
                    <Button type="submit" className="w-full" onClick={onSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCustomerDialog;
