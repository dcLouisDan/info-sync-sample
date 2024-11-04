import { columns } from "@/components/collection_table/columns";
import { CollectionDataTable } from "@/components/collection_table/data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import CollectionListDocument from "@/components/CollectionListDocument";
import { Skeleton } from "@/components/ui/skeleton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PDFViewer } from "@react-pdf/renderer";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function CollectionListPage() {
    const [clientsWithOverdueBalance, setClientsWithOverdueBalance] = useState<
        Array<any>
    >([]);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [rowSelection, setRowSelection] = useState<{
        [key: number]: boolean;
    }>({});
    const [barangayList, setBarangayList] = useState<Array<string>>([]);
    const [planList, setPlanList] = useState<Array<string>>([]);
    const selectedData = Object.keys(rowSelection)
        .filter((index: string) => rowSelection[Number(index)]) // Only keep selected indices
        .map((index) => clientsWithOverdueBalance[Number(index)]);
    console.log(selectedData);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let allClients: Array<any> = []; // Temporary array to store all client data
                let currentPage = 1;
                let totalPages = 1;

                do {
                    const response = await axios.get(
                        route("overdueClients", currentPage)
                    );

                    allClients = [...allClients, ...response.data.data];
                    totalPages = response.data.pagination.total_pages;
                    currentPage += 1;
                    setProgress(Math.ceil((currentPage / totalPages) * 100));
                } while (currentPage <= totalPages);
                // Update totalPage only once (to prevent unnecessary re-renders)
                if (totalPage !== totalPages) {
                    setTotalPage(totalPages);
                }
                // Update progress based on the current page
                setClientsWithOverdueBalance(allClients);
                const baranggaySet = new Set(
                    allClients.map((client) => client["address2"])
                );
                const planSet = new Set(
                    allClients.map((client) => client["custom_value3"])
                );
                setBarangayList(Array.from(baranggaySet).sort());
                setPlanList(Array.from(planSet).sort());
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Head>
                <title>Collection List</title>
            </Head>
            <AuthenticatedLayout>
                <div className="mx-auto bg-white w-full max-w-4xl p-4 my-4 rounded-lg shadow flex justify-between items-center">
                    <h1 className="font-bold">Payment Collection List</h1>
                    <Dialog>
                        <DialogTrigger className={buttonVariants({})}>
                            Print List
                        </DialogTrigger>
                        <DialogContent className="">
                            <DialogHeader>
                                <DialogTitle>Print Preview</DialogTitle>
                                <DialogDescription>
                                    List of clients for payment collection.
                                </DialogDescription>
                            </DialogHeader>
                            <PDFViewer className="w-full h-[500px] rounded-md">
                                <CollectionListDocument
                                    clientList={selectedData}
                                />
                            </PDFViewer>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="w-full max-w-4xl bg-white rounded-lg mx-auto mb-8">
                    {isLoading && (
                        <div className="p-4 grid gap-2">
                            <div className="grid grid-cols-4 gap-2">
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                            </div>
                            <Skeleton className="h-6 w-full" />
                            <div className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-6 w-full" />
                                <h1 className="text-center text-gray-500 text-2xl">
                                    Fetching data {`${progress}%`}
                                </h1>
                                <Skeleton className="h-6 w-full" />
                            </div>
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    )}
                    {!isLoading && (
                        <div className="p-4">
                            <CollectionDataTable
                                columns={columns}
                                data={clientsWithOverdueBalance}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                barangayList={barangayList}
                                planList={planList}
                            />
                        </div>
                    )}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
