import Header from "@/components/common/header";
import Image from "next/image";

const Customers = () => {
  return (
    <div>
      <Header />
      <div className="p-6">
        <div className="min-h-screen-calc-13vh flex flex-col items-center justify-center rounded-md border">
          <Image
            src="/coming-soon.png"
            className="aspect-square rounded-full object-cover"
            width={300}
            height={300}
            alt="Coming Soon"
          />
          <div className="text-5xl">Coming Soon!</div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
