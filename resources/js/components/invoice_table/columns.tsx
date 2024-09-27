"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = {
    invoiceNumber: string;
    item: string;
    clientNumber: string;
    clientName: string;
    amount: string;
};

export const columns: ColumnDef<Invoice>[] = [
    {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
    },
    {
        accessorKey: "clientName",
        header: "Client Name",
    },
    {
        accessorKey: "clientNumber",
        header: "Client Number",
    },
    {
        accessorKey: "item",
        header: "Item",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
];
