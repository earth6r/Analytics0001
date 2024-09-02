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
import { api } from "@/utils/api"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import Spinner from "../common/spinner"
import { Button } from "../ui/button"

interface DeleteNextStepChainLinkProps {
    email: string
    index: number
}

const DeleteNextStepChainLink = (props: DeleteNextStepChainLinkProps) => {
    const { email, index } = props;

    const api_utils = api.useUtils();
    const deleteChainLink = api.user.deleteChainLink.useMutation();

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger>
                <div>
                    <Trash2 className="w-4 h-4 hover:text-red-500" />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the next step chain link.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        className="w-24"
                        variant="destructive"
                        onClick={
                            async () => {
                                setIsLoading(true);
                                await deleteChainLink.mutateAsync({ email, index });
                                await api_utils.user.getPotentialCustomerDetails.refetch();
                                setIsLoading(false);
                                setIsOpen(false);
                            }
                        }>
                        {isLoading ? <Spinner /> : "Continue"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteNextStepChainLink;
