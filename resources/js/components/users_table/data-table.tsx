"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function UserDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

    const {
        data: formData, // Renamed to formData
        setData: setFormData, // Renamed to setFormData
        post: createUser, // Renamed to createUser
        // processing: isCreating, // Renamed to isCreating
        errors: formErrors, // Renamed to formErrors
        clearErrors: clearFormErrors,
        reset: resetForm, // Renamed to resetForm
    } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    return (
        <div>
            <div className="flex items-center py-4 gap-2 justify-between">
                <Dialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button variant="default" className="w-40">
                            Create User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>
                                Create a new user here. Click save when you're
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData("name", e.target.value);
                                        clearFormErrors("name");
                                    }}
                                    className="col-span-3"
                                    error={formErrors.name}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    name="email"
                                    id="email"
                                    error={formErrors.email}
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData("email", e.target.value);
                                        clearFormErrors("email");
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="password"
                                    className="text-right"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    error={formErrors.password}
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData("password", e.target.value);
                                        clearFormErrors("password");
                                    }}
                                    name="password"
                                    type="password"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-right"
                                >
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    error={formErrors.password_confirmation}
                                    value={formData.password_confirmation}
                                    onChange={(e) => {
                                        setFormData(
                                            "password_confirmation",
                                            e.target.value
                                        );
                                        clearFormErrors(
                                            "password_confirmation"
                                        );
                                    }}
                                    name="confirmPassword"
                                    type="password"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Role
                                </Label>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onValueChange={(value) => {
                                        setFormData("role", value);
                                        clearFormErrors("role");
                                    }}
                                >
                                    <SelectTrigger
                                        className="col-span-3"
                                        error={formErrors.role}
                                    >
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Roles</SelectLabel>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="user">
                                                User
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </form>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={() =>
                                    createUser(route("user.create"), {
                                        onSuccess: () => {
                                            setCreateDialogOpen(false);
                                            resetForm();
                                            // toast({
                                            //     description:
                                            //         "User created successfully.",
                                            // });
                                        },
                                    })
                                }
                            >
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Input
                    placeholder="Filter Name..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("userid")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
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
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
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
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
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
        </div>
    );
}
