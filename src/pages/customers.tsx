import Header from "@/components/header";
import Image from "next/image";

const Customers = () => {
    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-col items-center justify-center border rounded-md min-h-screen-calc-13vh">
                    <Image src="/coming-soon.png" className="rounded-full aspect-square object-cover" width={300} height={300} alt="Coming Soon" />
                    <div className="text-5xl">Coming Soon!</div>
                </div>
            </div>
        </div>
    );
};

export default Customers;
