import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { useState } from "react";

interface PotentialCustomerProps {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

const PotentialCustomer = (props: PotentialCustomerProps) => {
    const { uid, email, firstName, lastName, phoneNumber } = props;

    const [_firstName, _setFirstName] = useState(firstName);
    const [_lastName, _setLastName] = useState(lastName);
    const [_phoneNumber, _setPhoneNumber] = useState(phoneNumber);

    const potentialCustomers = api.bookings.getPotentialCustomers.useQuery();
    const updatePotentialCustomer = api.bookings.updatePotentialCustomer.useMutation();

    return (
        <div className="border rounded-md p-2">
            <div>
                Email: {email || "-"}
            </div>
            <div>
                First Name:
                {firstName ||
                    <Input
                        value={_firstName}
                        onChange={(e) => _setFirstName(e.target.value)}
                    />
                }
            </div>
            <div>
                Last Name:
                {lastName ||
                    <Input
                        value={_lastName}
                        onChange={(e) => _setLastName(e.target.value)}
                    />
                }
            </div>
            <div>
                Phone:
                {phoneNumber ||
                    <Input
                        value={_phoneNumber}
                        onChange={(e) => _setPhoneNumber(e.target.value)}
                    />
                }
            </div>
            <div className="flex justify-end space-x-2">
                <Button
                    onClick={async () => {
                        await updatePotentialCustomer.mutateAsync({
                            uid,
                            firstName: _firstName,
                            lastName: _lastName,
                            phoneNumber: _phoneNumber,
                        });
                        await potentialCustomers.refetch();
                    }}
                >Save</Button>
            </div>
        </div>
    );
}

const Admin = () => {
    const potentialCustomers = api.bookings.getPotentialCustomers.useQuery();

    return (
        <div>
            <h1>Admin</h1>

            <div>
                <h1>Potential Customers</h1>

                {potentialCustomers.isLoading && <div>Loading...</div>}

                {potentialCustomers.error && (
                    <div>Error: {potentialCustomers.error.message}</div>
                )}

                {potentialCustomers.data && (
                    <div>
                        <div className="p-2 space-y-4">
                            {potentialCustomers.data.map((customer) => (
                                <div key={customer.id} className="">
                                    <PotentialCustomer
                                        uid={customer.uid}
                                        email={customer.email}
                                        firstName={customer.firstName}
                                        lastName={customer.lastName}
                                        phoneNumber={customer.phoneNumber}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
