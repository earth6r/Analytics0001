import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";

const RecentRegisters = () => {
    const { interval } = useInterval();

    const recentRegisters = api.post.getRecentRegisters.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );

    return (
        <Card className="w-full md:w-3/5 shadow h-[600px] mt-6 md:mt-0">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Registers</CardTitle>
                    <CardDescription>
                        Recent registers from Home0001.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/registers">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
                {/* {JSON.stringify(recentRegisters.data)} */}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="hidden xl:table-column">
                                Type
                            </TableHead>
                            <TableHead className="hidden xl:table-column">
                                Status
                            </TableHead>
                            <TableHead className="hidden md:table-column">
                                Date
                            </TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentRegisters.data?.map((register, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="font-medium">{register.firstName + " " + register.lastName}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {register.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    {register.type}
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    <Badge className="text-xs" variant="outline">
                                        {register.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                    {register.createdAt}
                                </TableCell>
                                <TableCell className="text-right">{45}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default RecentRegisters;
