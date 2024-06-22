import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react";
import UpdateUserDetailsDialog from "@/components/customers/update-user-details-dialog";
import CustomerDetailsDialog from "@/components/customers/customer-details-dialog";
import UpdateBuyingProgressDialog from "@/components/customers/update-buying-progress-dialog";
import ArchiveCustomerAlertDialog from "@/components/customers/archive-customer-alert-dialog";
import { useState } from "react";

interface ActionDropdownProps {
    user: any;
    refetch: () => Promise<any>;
    dialogOpenedByIndex: number | null;
    setDialogOpenedByIndex: (open: number | null) => void;
    index: number;
    updateDialogOpenedByIndex: number | null;
    setUpdateDialogOpenedByIndex: (open: number | null) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ActionDropdown = (props: ActionDropdownProps) => {
    const { user, refetch, dialogOpenedByIndex, setDialogOpenedByIndex, index, updateDialogOpenedByIndex, setUpdateDialogOpenedByIndex, open, onOpenChange } = props;

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Ellipsis className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <CustomerDetailsDialog customerDetails={user} trigger={
                        <DropdownMenuItem onClick={
                            () => {
                                setDialogOpenedByIndex(index);
                            }
                        }>
                            View Details
                        </DropdownMenuItem>
                    } />
                    <UpdateUserDetailsDialog currentValue={user} email={user.email} refetch={refetch} dialogOpenedByIndex={updateDialogOpenedByIndex} setDialogOpenedByIndex={setUpdateDialogOpenedByIndex} index={index} trigger={
                        <DropdownMenuItem>
                            Update Customer Details
                        </DropdownMenuItem>
                    } />
                    <UpdateBuyingProgressDialog currentValue={user} email={user.email} refetch={refetch} dialogOpenedByIndex={dialogOpenedByIndex} setDialogOpenedByIndex={setDialogOpenedByIndex} index={index} trigger={
                        <DropdownMenuItem>
                            Update Buying Progress
                        </DropdownMenuItem>
                    } />
                    <ArchiveCustomerAlertDialog email={user.email} refetch={refetch} trigger={
                        <DropdownMenuItem>
                            Archive Customer
                        </DropdownMenuItem>
                    } />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ActionDropdown;
