import React from "react";
import { Client } from "./collection_table/columns";
import * as XLSX from "xlsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { groupBy } from "@/lib/utils";
import { saveAs } from "file-saver";
import { buttonVariants } from "./ui/button";

export default function DownloadGroupedCSV({ data }: { data: Array<any> }) {
    const clientsByBarangay = groupBy(data, "address2");
    const currentDate = (() => {
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}${day}${year}`;
    })();
    const downloadGroupedCSV = (data: any) => {
        // Prepare data for the worksheet
        const worksheetData: Array<any> = [];
        Object.entries(data).forEach(
            ([location, clients]: [location: string, clients: any]) => {
                worksheetData.push([location]); // Adds location as a row
                clients.forEach((client: any) => {
                    const customer = client as Client;
                    worksheetData.push([
                        customer.name,
                        customer.custom_value3,
                        customer.overdue_balance,
                    ]);
                });
                worksheetData.push([]); // Blank row between locations
            }
        );

        // Create a worksheet and a workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Set column widths
        worksheet["!cols"] = [{ wch: 40 }, { wch: 20 }, { wch: 10 }];

        // Convert workbook to Blob and trigger download
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        saveAs(blob, `PaymentCollectionList-${currentDate}.xlsx`);
    };

    return (
        <div className="flex gap-2 items-center">
            {data.length === 0 && (
                <p className="text-gray-400">Select Customers from the list</p>
            )}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger
                        onClick={() => downloadGroupedCSV(clientsByBarangay)}
                        className={buttonVariants()}
                        disabled={data.length === 0}
                    >
                        Download XLSX
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Download collection list grouped by barangay</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
