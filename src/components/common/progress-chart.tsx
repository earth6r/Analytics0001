import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// TODO: rename data
interface ProgressChartProps {
    data: any;
}

// usage:
// data={[
//     { 'January': 50 },
//     { 'February': 100 },
//     { 'March': 150 },
//     { 'April': 200 },
// ]}


const ProgressChart = (props: ProgressChartProps) => {
    const { data } = props;
    const [maxValue, setMaxValue] = useState(0);

    useEffect(() => {
        if (data?.data) {
            setMaxValue(Math.max(...data.data.map((item) => Object.values(item)[0])));
        }
    }, [data]);

    if (data.isLoading || data.isError || !data.data) {
        return (
            <div className="relative flex flex-col space-y-3 items-center justify-between px-4 py-2 rounded-lg bg-transparent">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
            </div>
        );
    }

    return (
        <div className='space-y-3 pl-4 pr-4'>
            {(data.data)
                .map((item, index) => (
                    <div key={index} className="relative flex items-center justify-between px-4 py-2 rounded-lg bg-transparent">
                        <div className="absolute left-0 top-0 h-full bg-secondary rounded-lg" style={{ width: `${(Object.values(item)[0] / maxValue) * 100}%` }}></div>
                        <span className="relative text-foreground">{Object.keys(item)[0]}</span>
                        <span className="relative text-foreground">{Object.values(item)[0]}</span>
                    </div>
                ))}
        </div>
    );
};

export default ProgressChart;
