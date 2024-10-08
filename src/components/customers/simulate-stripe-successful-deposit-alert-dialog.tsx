import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/utils/api";
import { useState } from "react";
import Spinner from "../common/spinner";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles";

interface SimulateStripeSuccessfulDepositAlertDialogProps {
    user: any;
    refetch: () => Promise<any>;
}

const SimulateStripeSuccessfulDepositAlertDialog = (props: SimulateStripeSuccessfulDepositAlertDialogProps) => {
    const { user, refetch } = props;

    const [isLoading, setIsLoading] = useState(false);

    const simulateStripeSuccessfulDeposit = api.customer.simulateStripeSuccessfulDeposit.useMutation();

    const handleSubmit = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "No user found",
                className: toastErrorStyle,
            })
            return;
        }

        if (!user.email) {
            toast({
                title: "Error",
                description: "No email found for user",
                className: toastErrorStyle,
            })
            return;
        }

        if (!user.userBuyingPropertyType) {
            toast({
                title: "Error",
                description: "No userBuyingPropertyType not set for user",
                className: toastErrorStyle,
            })
            return;
        }

        if (user?.buyingProgressData?.escrowDeposit) {
            toast({
                title: "Error",
                description: "User has already made a deposit",
                className: toastErrorStyle,
            })
            return;
        }

        setIsLoading(true);
        await simulateStripeSuccessfulDeposit.mutateAsync({ email: user.email });
        await refetch();
        setIsLoading(false);

        toast({
            title: "Success",
            description: "Successfully simulated a successful deposit from Stripe for the customer",
            className: toastSuccessStyle,
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>{isLoading ? <Spinner /> : "Simulate Deposit"}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will simulate a successful deposit from Stripe for the customer with the email address {user.email}. This will allow the user to skip the deposit and move on to the next step.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default SimulateStripeSuccessfulDepositAlertDialog;
