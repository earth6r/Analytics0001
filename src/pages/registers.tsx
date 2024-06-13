"use client";

import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import Header from "@/components/common/header";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const data: Payment[] = [
    // @ts-expect-error - fix this
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@yahoo.com",
    },
    // @ts-expect-error - fix this
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@gmail.com",
    },
    // @ts-expect-error - fix this
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@gmail.com",
    },
    // @ts-expect-error - fix this
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@gmail.com",
    },
    // @ts-expect-error - fix this
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@hotmail.com",
    },
];

export type Payment = {
    createdAt: string;
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    firstName: string;
    lastName: string;
    locationsOfInterest: string[];
};

// @ts-expect-error - fix this
const ActionCell = ({ row }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() =>
                        navigator.clipboard.writeText(row.original.email)
                    }
                >
                    Copy Email
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        window.open(`mailto:${row.original.email}`, "_blank")
                    }
                >
                    Send Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    View Details
                </DropdownMenuItem>
            </DropdownMenuContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[450px] sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Message Details</DialogTitle>
                        <DialogDescription>
                            {`Details for ${row.original.firstName} ${row.original.lastName}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid max-h-96 min-w-96 gap-4 overflow-auto px-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={`${row.original.firstName} ${row.original.lastName}`}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="amount"
                                value={row.original.createdAt}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        {/* userAgent, source, routes, page, medium, locationsOfInterest, lastName, hutk, fullQuery, firstName, error, email, content, city, campaign, buyingTimelinedec2023, bedroomPreference, adSet, Else */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userAgent" className="text-right">
                                User Agent
                            </Label>
                            <Input
                                id="userAgent"
                                value={row.original.userAgent}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="source" className="text-right">
                                Source
                            </Label>
                            <Input
                                id="source"
                                value={row.original.source}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="routes" className="text-right">
                                Routes
                            </Label>
                            <Input
                                id="routes"
                                value={row.original.routes}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="page" className="text-right">
                                Page
                            </Label>
                            <Input
                                id="page"
                                value={row.original.page}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="medium" className="text-right">
                                Medium
                            </Label>
                            <Input
                                id="medium"
                                value={row.original.medium}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="locationsOfInterest"
                                className="text-right"
                            >
                                Locations of Interest
                            </Label>
                            <Input
                                id="locationsOfInterest"
                                value={row.original.locationsOfInterest?.join(
                                    ", ",
                                )}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={row.original.lastName}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hutk" className="text-right">
                                Hutk
                            </Label>
                            <Input
                                id="hutk"
                                value={row.original.hutk}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullQuery" className="text-right">
                                Full Query
                            </Label>
                            <Input
                                id="fullQuery"
                                value={row.original.fullQuery}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={row.original.firstName}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="error" className="text-right">
                                Error
                            </Label>
                            <Input
                                id="error"
                                value={row.original.error}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={row.original.email}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="content" className="text-right">
                                Content
                            </Label>
                            <Input
                                id="content"
                                value={row.original.content}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">
                                City
                            </Label>
                            <Input
                                id="city"
                                value={row.original.city}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="campaign" className="text-right">
                                Campaign
                            </Label>
                            <Input
                                id="campaign"
                                value={row.original.campaign}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="buyingTimelinedec2023"
                                className="text-right"
                            >
                                Buying Timeline Dec 2023
                            </Label>
                            <Input
                                id="buyingTimelinedec2023"
                                value={row.original.buyingTimelinedec2023}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="bedroomPreference"
                                className="text-right"
                            >
                                Bedroom Preference
                            </Label>
                            <Input
                                id="bedroomPreference"
                                value={row.original.bedroomPreference}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="adSet" className="text-right">
                                Ad Set
                            </Label>
                            <Input
                                id="adSet"
                                value={row.original.adSet}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Else" className="text-right">
                                Else
                            </Label>
                            <Input
                                id="Else"
                                value={row.original.Else}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div>
                <div className="font-medium">
                    {row.original.firstName + " " + row.original.lastName}
                </div>
                <div className="lowercase text-muted-foreground">
                    {row.getValue("email")}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => <div>{row.original.createdAt}</div>,
    },
    {
        accessorKey: "locationsOfInterest",
        header: "Locations of Interest",
        cell: ({ row }) => (
            <div className="flex flex-wrap space-x-2">
                {(row.original.locationsOfInterest || [])
                    .slice(0, 2)
                    .map((location, index) => (
                        <Badge
                            key={index}
                            className="capitalize"
                            variant="outline"
                        >
                            {location}
                        </Badge>
                    ))}
                {row.original.locationsOfInterest?.length > 2 && (
                    <Badge variant="outline">
                        +{row.original.locationsOfInterest.length - 2}
                    </Badge>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ActionCell,
    },
];

const Registers = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});

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

    const { interval } = useInterval();
    const getRegisters = api.post.getRegisters.useQuery(
        // @ts-expect-error - fix this
        {},
        {
            refetchInterval: interval,
        },
    );

    const table = useReactTable({
        data: getRegisters.data ?? data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div>
            <Header />
            <div className="w-full p-6">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter emails..."
                        value={
                            (table
                                .getColumn("email")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("email")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registers;
