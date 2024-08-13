import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { api } from '@/utils/api';
import moment from 'moment';

interface SuggestedTimesProps {
    startDate: Date | undefined;
    startTime: string;
    setStartDate: (date: Date) => void;
    setStartTime: (time: string) => void;
}

const SuggestedTimesWrapper = (props: SuggestedTimesProps) => {
    const { startDate, startTime } = props;
    const [showSuggestedTimes, setShowSuggestedTimes] = useState(false);

    if (startDate && startTime) {
        return null;
    }

    if (!showSuggestedTimes) {
        return (
            <div className="text-center text-xs select-none text-blue-500">
                <span onClick={() => setShowSuggestedTimes(true)} className="cursor-pointer hover:underline">Want to see suggested times?</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4 select-none">
            <h1 className="text-center text-sm font-semibold text-primary">Suggested Times</h1>
            <SuggestedTimes {...props} />
        </div>
    );
}

const SuggestedTimes = (props: SuggestedTimesProps) => {
    const { startDate, setStartDate, setStartTime } = props;

    const [visibleCount, setVisibleCount] = useState(6);

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 6);
    };

    const getAvailableHoursTalin = api.bookings.getAvailableHoursTalin.useQuery();

    if (getAvailableHoursTalin.isLoading) {
        return <Skeleton className="h-[82px]" />;
    }

    const filteredItems = (getAvailableHoursTalin.data || [])
        .filter((item: any) => item.HasAvailability)
        .flatMap((item: any, index: number) =>
            item.slots.map((slot: any, index1: number) => {
                if (!startDate || (startDate && startDate.toISOString().split("T")[0] === item.date)) {
                    return (
                        <div
                            key={`${index}-${index1}`}
                            className="flex flex-row items-center space-x-2"
                        >
                            <Badge
                                variant="outline"
                                className="cursor-pointer text-[10px] font-normal hover:bg-gray-200 dark:hover:bg-gray-700"
                                onClick={() => {
                                    const newDate = moment.tz(item.date, 'America/New_York').toDate();
                                    setStartDate(newDate);
                                    setStartTime(slot);
                                }}
                            >
                                {`${item.date} ${slot}`}
                            </Badge>
                        </div>
                    );
                }
                return null;
            })
        )
        .filter(Boolean); // Remove null values

    if (filteredItems.length === 0) {
        return (
            <div className="flex justify-center items-center text-center text-xs space-x-1">
                <h1 className='text-muted-foreground'>No available times</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>There are no available calendar meetings found for the selected date</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }

    return (
        <div>
            {getAvailableHoursTalin.data && getAvailableHoursTalin.data.length > 0 && (
                <div>
                    <div className="grid grid-cols-3 gap-4">
                        {filteredItems.slice(0, visibleCount)}
                    </div>
                    <div>
                        {visibleCount < filteredItems.length && (
                            <div className="text-center text-xs mt-2 select-none">
                                <span onClick={loadMore} className="cursor-pointer hover:underline">Load More</span>
                            </div>
                        )}
                    </div>
                </div>
            ) || (
                    <div className="flex justify-center items-center text-center text-xs space-x-1">
                        <h1 className='text-muted-foreground'>No available times</h1>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>There are no available calendar meetings found in talin@home0001.com calendar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
        </div>
    );
};

export default SuggestedTimesWrapper;