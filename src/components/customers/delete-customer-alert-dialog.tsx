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
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import Spinner from "../common/spinner";

interface DeleteCustomerAlertDialog {
    email: string;
    refetch: () => Promise<any>;
}

const DeleteCustomerAlertDialog = (props: DeleteCustomerAlertDialog) => {
    const { email, refetch } = props;

    const [loading, setLoading] = useState(false);

    const deleteCustomer = api.customer.deleteCustomer.useMutation();

    const handleSubmit = async () => {
        setLoading(true);
        await deleteCustomer.mutateAsync({ email });
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
                    <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the customer and cannot be restored later.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCustomerAlertDialog;
