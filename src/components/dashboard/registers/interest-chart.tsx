import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { useInterval } from '@/contexts/IntervalContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProgressChart from '@/components//common/progress-chart';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const { interval } = useInterval();
    const [labels, setLabels] = useState([]);
    const [pieData, setPieData] = useState([]);

    const locationInterests = api.post.getLocationsOfInterest.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );

    useEffect(() => {
        if (locationInterests.data) {
            setLabels((locationInterests.data).map((item) => Object.keys(item)[0]));
            setPieData((locationInterests.data).map((item) => Object.values(item)[0]));
        }
    }, [locationInterests.data]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Property Interests',
                data: pieData,
                backgroundColor: [
                    'rgba(25, 25, 112, 1)', // midnight blue
                    'rgba(0, 0, 255, 1)', // blue
                    'rgba(70, 130, 180, 1)', // steel blue
                    'rgba(135, 206, 235, 1)', // sky blue
                    'rgba(240, 248, 255, 1)', // alice blue
                    'rgba(70, 130, 180, 1)', // steel blue
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Card className="w-full md:w-2/5 shadow pb-3 h-[600px] overflow-hidden">
            <CardHeader>
                <CardTitle>Property Interests</CardTitle>
                <CardDescription>Property interests by type</CardDescription>
            </CardHeader>
            <div className='h-[300px]'>
                <Pie data={data} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                }} />
            </div>
            {
                (locationInterests.isLoading || locationInterests.isError) ? (
                    <ScrollArea className="max-h-48">
                        <div className='flex flex-col space-y-3 p-4'>
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-10" />
                        </div>
                    </ScrollArea>
                ) : (
                    <ScrollArea className="flex flex-col space-y-3 max-h-48">
                        <ProgressChart data={locationInterests} />
                    </ScrollArea>
                )}
        </Card>
    );
};

export default PieChart;
