import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";
import Header from "@/components/common/header";
import ActionDropdown from "@/components/customers/action-dropdown";
import ArchiveCustomerAlertDialog from "@/components/customers/archive-customer-alert-dialog";
import CreateCustomerDialog from "@/components/customers/create-customer-dialog";
import CustomerDetailsDialog from "@/components/customers/customer-details-dialog";
import UpdateBuyingProgressDialog from "@/components/customers/update-buying-progress-dialog";
import UpdateUserDetailsDialog from "@/components/customers/update-user-details-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";

const BuyingStepTitle = () => {
    return (
        <div className="flex flex-row items-center space-x-2">
            <div className="font-bold text-xl">Buying Step</div>
            <CircularQuestionMarkTooltip label="This step is what the customer has completed last. The ordered steps include: Escrow Deposit, Schedule Closing, Download Documents, Full Payment, Completed" />
        </div>
    );
}

const BuyingPropertyTypeTitle = () => {
    return (
        <div className="flex flex-row items-center space-x-2">
            <div className="font-bold text-xl">Buying Property Type</div>
            <CircularQuestionMarkTooltip label="This is the property type that the customer is interested in buying." />
        </div>
    );
}

const Customers = () => {
    const { interval } = useInterval();

    useEffect(() => {
        const authenticatedData = JSON.parse(
            localStorage.getItem("authenticated") ?? "{}",
        );
        if (
            !authenticatedData.authenticated ||
            authenticatedData.expires < new Date().getTime()
        ) {
            window.location.href = "/";
        }
    }, []);

    const getUsersInDatabase = api.post.getUsersInDatabase.useQuery(
        undefined, {
        refetchInterval: interval,
    });

    const [createCustomerDialogOpen, setCreateCustomerDialogOpen] = useState(false);
    const [updateDialogOpenedByIndex, setUpdateDialogOpenedByIndex] = useState<number | null>(null);
    const [dialogOpenedByIndex, setDialogOpenedByIndex] = useState<number | null>(null);
    const [actionDialogOpenedByIndex, setActionDialogOpenedByIndex] = useState<number | null>(null);

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-between pb-4">
                    <h1 className="text-4xl font-bold">Customers</h1>
                    <CreateCustomerDialog refetch={getUsersInDatabase.refetch} open={createCustomerDialogOpen} onOpenChange={setCreateCustomerDialogOpen} />
                </div>

                <div>
                    {getUsersInDatabase.isLoading ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-5">
                                <div className="font-bold text-xl">Customer</div>
                                <div className="font-bold text-xl">Password Set</div>
                                <BuyingStepTitle />
                                <BuyingPropertyTypeTitle />
                                <div className="font-bold text-xl">Actions</div>
                            </div>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <Skeleton key={index} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-5">
                                <div className="font-bold text-xl">Customer</div>
                                <div className="font-bold text-xl">Password Set</div>
                                <BuyingStepTitle />
                                <BuyingPropertyTypeTitle />
                                <div className="font-bold text-xl">Actions</div>
                            </div>
                            {getUsersInDatabase.data?.map((user, index) => (
                                <div key={user.id} className="grid grid-cols-5">
                                    <div className="flex flex-col justify-center">
                                        <div>
                                            <div className="text-sm">{user.firstName || "First Name"} {user.lastName || "Last Name"}</div>
                                            <div className="text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        {JSON.stringify(user?.setPassword) ?? "No value for setPassword"}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        {user?.buyingProgress ?? "Escrow Deposit"}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        {user?.userBuyingPropertyType ?? "No value for buying property type"}
                                    </div>
                                    <div className="flex flex-row space-x-2">
                                        <ActionDropdown
                                            open={actionDialogOpenedByIndex === index}
                                            onOpenChange={(open) => setActionDialogOpenedByIndex(open ? index : null)}
                                            user={user}
                                            refetch={getUsersInDatabase.refetch}
                                            dialogOpenedByIndex={dialogOpenedByIndex}
                                            setDialogOpenedByIndex={setDialogOpenedByIndex}
                                            index={index}
                                            updateDialogOpenedByIndex={updateDialogOpenedByIndex}
                                            setUpdateDialogOpenedByIndex={setUpdateDialogOpenedByIndex}
                                        />
                                        {/* <UpdateUserDetailsDialog currentValue={user} email={user.email} refetch={getUsersInDatabase.refetch} dialogOpenedByIndex={updateDialogOpenedByIndex} setDialogOpenedByIndex={setUpdateDialogOpenedByIndex} index={index} />
                                        <CustomerDetailsDialog customerDetails={user} />
                                        <UpdateBuyingProgressDialog currentValue={user} email={user.email} refetch={getUsersInDatabase.refetch} dialogOpenedByIndex={dialogOpenedByIndex} setDialogOpenedByIndex={setDialogOpenedByIndex} index={index} />
                                        <ArchiveCustomerAlertDialog email={user.email} refetch={getUsersInDatabase.refetch} /> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers;
