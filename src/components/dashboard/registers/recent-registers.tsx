import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const RecentRegisters = () => {
  const { interval } = useInterval();

  const recentRegisters = api.post.getRecentRegisters.useQuery(
    undefined,
    {
      refetchInterval: interval,
    },
  );

  const [numberOfBadges, setNumberOfBadges] = useState(2);

  const handleResize = () => {
    if (window.innerWidth < 550) {
      setNumberOfBadges(1);
    } else {
      setNumberOfBadges(2);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Card className="mt-6 h-[600px] w-full shadow md:mt-0 md:w-3/5">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Registers</CardTitle>
          <CardDescription>Recent registers from Home0001.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/registers">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Locations of Interest</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRegisters.data
              ? recentRegisters.data.map((register, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">
                        {register.firstName + " " + register.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {register.email}
                      </div>
                    </TableCell>
                    {/* <TableCell className="hidden xl:table-cell">
                      {register.type} TODO: add this field in the api and distinguish the types based on the inputs (ask Yan how to classify them)
                    </TableCell> */}
                    <TableCell className="flex flex-wrap items-center gap-2">
                      {(register.locationsOfInterest || [])
                        .slice(0, numberOfBadges)
                        .map((location: string, index: number) => (
                          <Badge
                            key={index}
                            className="text-xs"
                            variant="outline"
                          >
                            {location}
                          </Badge>
                        ))}
                      {(register.locationsOfInterest || []).length >
                        numberOfBadges && (
                        <Badge className="text-xs" variant="outline">
                          +{register.locationsOfInterest.length - numberOfBadges}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {register.createdAt ? register.createdAt.slice(0, 10) : ""}
                    </TableCell>
                  </TableRow>
                ))
              : [1, 2, 3, 4, 5, 6].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px]" />
                      <Skeleton className="h-4 w-[100px] mt-2" />
                    </TableCell>
                    <TableCell className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                      {numberOfBadges === 2 && (
                        <Skeleton className="h-6 w-[80px] rounded-full" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-6 w-[80px] ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentRegisters;
