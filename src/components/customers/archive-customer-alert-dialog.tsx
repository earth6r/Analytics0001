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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/utils/api";
import { Trash2 } from "lucide-react";

interface DeleteCustomerAlertDialog {
    email: string;
    refetch: () => Promise<any>;
}

const ArchiveCustomerAlertDialog = (props: DeleteCustomerAlertDialog) => {
    const { email, refetch } = props;

    const archiveUser = api.customer.archiveCustomer.useMutation();

    const handleSubmit = async () => {
        await archiveUser.mutateAsync({ email });
        await refetch();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archive Customer?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will archive the customer and can be restored later. Contact support if you need to restore the customer.
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

export default ArchiveCustomerAlertDialog;
