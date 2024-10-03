"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Client = {
    id: string;
    number: string;
    clientName: string;
    contanctName: string;
};

export const columns: ColumnDef<Client>[] = [
    {
        accessorKey: "userid",
        header: "Number",
    },
    {
        accessorKey: "customer",
        header: "Client Name",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "mobileNumber",
        header: "Phone",
    },
];
