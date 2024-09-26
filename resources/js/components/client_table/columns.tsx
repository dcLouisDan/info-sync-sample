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
        accessorKey: "number",
        header: "Number",
    },
    {
        accessorKey: "clientName",
        header: "Client Name",
    },
    {
        accessorKey: "contactName",
        header: "Contact Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
];
