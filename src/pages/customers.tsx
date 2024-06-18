import Header from "@/components/common/header";
import CreateCustomerDialog from "@/components/customers/create-customer-dialog";
import SetBuyingPropertyTypeDialog from "@/components/customers/set-buying-property-type-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";

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

    const [dialogOpenedByIndex, setDialogOpenedByIndex] = useState<number | null>(null);
    const [createCustomerDialogOpen, setCreateCustomerDialogOpen] = useState(false);

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-between pb-4">
                    <h1 className="text-4xl font-bold">Customers</h1>
                    {/* @ts-expect-error fix this*/}
                    <CreateCustomerDialog refetch={getUsersInDatabase.refetch} open={createCustomerDialogOpen} onOpenChange={setCreateCustomerDialogOpen} />
                </div>

                <div>
                    {getUsersInDatabase.isLoading ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="font-bold text-xl">Email</div>
                                <div className="font-bold text-xl">Created At</div>
                                <div className="font-bold text-xl">Password Set</div>
                                <div className="font-bold text-xl">Buying Property Type</div>
                                <div className="font-bold text-xl">Actions</div>
                            </div>
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-5 gap-2">
                                <div className="font-bold text-xl">Email</div>
                                <div className="font-bold text-xl">Created At</div>
                                <div className="font-bold text-xl">Password Set</div>
                                <div className="font-bold text-xl">Buying Property Type</div>
                                <div className="font-bold text-xl">Actions</div>
                            </div>
                            {getUsersInDatabase.data?.map((user, index) => (
                                <div key={user.id} className="grid grid-cols-5 gap-2">
                                    <div className="flex flex-col justify-center">
                                        {user.email}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        {
                                            user?.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                                                : "No creation date set"}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        has password set: {JSON.stringify(user?.setPassword) ?? "No value for setPassword"}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        {user?.userBuyingPropertyType ?? "No value for buying property type"}
                                    </div>
                                    {/* @ts-expect-error fix this*/}
                                    <SetBuyingPropertyTypeDialog currentValue={user?.userBuyingPropertyType} email={user.email} refetch={getUsersInDatabase.refetch} dialogOpenedByIndex={dialogOpenedByIndex} setDialogOpenedByIndex={setDialogOpenedByIndex} index={index} />
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
