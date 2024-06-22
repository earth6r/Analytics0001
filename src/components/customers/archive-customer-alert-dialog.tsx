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
import { useState } from "react";
import Spinner from "../common/spinner";

interface DeleteCustomerAlertDialog {
    email: string;
    refetch: () => Promise<any>;
}

const ArchiveCustomerAlertDialog = (props: DeleteCustomerAlertDialog) => {
    const { email, refetch } = props;

    const [loading, setLoading] = useState(false);

    const archiveUser = api.customer.archiveCustomer.useMutation();

    const handleSubmit = async () => {
        setLoading(true);
        await archiveUser.mutateAsync({ email });
        await refetch();
        setLoading(false);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">
                    {loading ? <Spinner /> : <Trash2 className="w-4 h-4" />}
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
