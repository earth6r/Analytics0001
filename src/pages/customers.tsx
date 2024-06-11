import Header from "@/components/common/header";
import CreateCustomerDialog from "@/components/customers/create-customer-dialog";

const Customers = () => {
  return (
    <div>
      <Header />
      <div className="p-6">
          <CreateCustomerDialog />
      </div>
    </div>
  );
};

export default Customers;
