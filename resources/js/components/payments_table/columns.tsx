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
        accessorKey: "datePaid",
        header: "Date Paid",
    },
    {
        accessorKey: "amountPaid",
        header: "Amount Paid",
    },
    {
        accessorKey: "customer",
        header: "Customer",
    },
    {
        accessorKey: "officialReceipt",
        header: "Official Receipt",
    },
    {
        accessorKey: "planName",
        header: "Plan Name",
    },
];
