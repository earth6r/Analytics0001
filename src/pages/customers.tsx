import Header from "@/components/common/header";
import CreateCustomerDialog from "@/components/customers/create-customer-dialog";
import SetBuyingPropertyTypeDialog from "@/components/customers/set-buying-property-type-dialog";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { useEffect } from "react";

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

  return (
    <div>
      <Header />
      <div className="p-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-4xl font-bold">Customers</h1>
          {/* @ts-expect-error fix this*/}
          <CreateCustomerDialog refetch={getUsersInDatabase.refetch} />
        </div>

        <div>
          {getUsersInDatabase.isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {getUsersInDatabase.data?.map((user) => (
                <div key={user.id} className="border p-4 mt-4">
                  <div>
                    {user.email}
                  </div>
                  <div>
                    {
                      user?.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                        : "No creation date set"}
                  </div>
                  <div>
                    has password set: {JSON.stringify(user?.setPassword) ?? "No value for setPassword"}
                  </div>
                  <div>
                    {user?.userBuyingPropertyType}
                  </div>
                  {/* @ts-expect-error fix this*/}
                  <SetBuyingPropertyTypeDialog currentValue={user?.userBuyingPropertyType} email={user.email} refetch={getUsersInDatabase.refetch} />
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
