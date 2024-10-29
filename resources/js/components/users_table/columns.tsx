"use client";

import { useForm, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserRow = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export const columns: ColumnDef<UserRow>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            const authUser = usePage().props.auth.user;
            const { toast } = useToast();
            const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
            const {
                data: formData, // Renamed to formData
                setData: setFormData, // Renamed to setFormData
                put: updateUser, // Renamed to updateUser
                // processing: isCreating, // Renamed to isCreating
                // errors: formErrors, // Renamed to formErrors
                reset: resetForm, // Renamed to resetForm
            } = useForm({
                name: user.name,
                email: user.email,
                password: "",
                password_confirmation: "",
                role: user.role,
            });
            return (
                <Dialog
                    open={updateDialogOpen}
                    onOpenChange={setUpdateDialogOpen}
                >
                    <DialogTrigger
                        asChild
                        disabled={Number(authUser.id) === Number(user.id)}
                    >
                        <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit User Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to a user here. Click save when
                                you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData("name", e.target.value)
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData("email", e.target.value)
                                    }
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="password"
                                    className="text-right"
                                >
                                    Reset password
                                </Label>
                                <Input
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData("password", e.target.value)
                                    }
                                    type="password"
                                    placeholder="Enter new password..."
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="password"
                                    className="text-right"
                                >
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={(e) =>
                                        setFormData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    type="password_confirmation"
                                    placeholder="Confirm new password..."
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Role
                                </Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        setFormData("role", value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
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
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={() => {
                                    updateUser(route("user.update", user.id), {
                                        onSuccess: () => {
                                            setUpdateDialogOpen(false);
                                            resetForm();
                                            toast({
                                                description:
                                                    "User update successfully.",
                                            });
                                        },
                                    });
                                }}
                            >
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        },
    },
];
