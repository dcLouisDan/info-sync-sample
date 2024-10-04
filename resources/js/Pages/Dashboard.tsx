import { columns } from "@/components/client_table/columns";
import { DataTable } from "@/components/client_table/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { FlashMessages } from "@/types/global";
import { Head, usePage } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
    quickbaseClients: Array<any>;
    invoiceClients: Array<any>;
    inconsistencies: Array<any>;
};

function InconsistenciesCard({ inconsistencies }: { inconsistencies: any }) {
    return (
        <div className="bg-destructive text-white px-6 py-4 overflow-hidden shadow-sm sm:rounded-lg">
            <h1>Inconsistencies:</h1>
            <ul className="list-disc ms-4">
                {Object.keys(inconsistencies).map((item) => {
                    return (
                        <li key={item}>
                            {Object.keys(
                                inconsistencies[item]["differences"]
                            ).map((diff, index) => {
                                if (typeof diff === "string") {
                                    return (
                                        <div key={index}>
                                            {item} : {diff} :{" "}
                                            {
                                                inconsistencies[item][
                                                    "differences"
                                                ][diff]
                                            }
                                        </div>
                                    );
                                }
                            })}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function Dashboard({
    quickbaseClients,
    invoiceClients,
    inconsistencies,
}: Props) {
    const { props } = usePage<PageProps & { flash: FlashMessages }>();
    const { success, error } = props.flash ?? { success: null, error: null };

    // console.log(quickbaseClients);
    console.log(inconsistencies);
    const quickbaseInconsistencies = inconsistencies[1];
    const ninjaInconcistencies = inconsistencies[0];
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            {/* Display Success Message */}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Display Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-2 gap-2">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 grid gap-4">
                            <h1 className="text-center font-bold">Quickbase</h1>
                            {/* <QBInvoiceForm /> */}
                            <Tabs defaultValue="clients">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="clients">
                                        Clients
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="clients">
                                    {quickbaseInconsistencies.length != 0 && (
                                        <InconsistenciesCard
                                            inconsistencies={
                                                quickbaseInconsistencies
                                            }
                                        />
                                    )}
                                    <DataTable
                                        columns={columns}
                                        data={quickbaseClients}
                                    />
                                </TabsContent>
                                <TabsContent value="invoices"></TabsContent>
                            </Tabs>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 grid gap-4">
                            <h1 className="text-center font-bold">
                                Invoice Ninja
                            </h1>
                            <Tabs defaultValue="clients">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="clients">
                                        Clients
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="clients">
                                    {ninjaInconcistencies.length != 0 && (
                                        <InconsistenciesCard
                                            inconsistencies={
                                                ninjaInconcistencies
                                            }
                                        />
                                    )}
                                    <DataTable
                                        columns={columns}
                                        data={invoiceClients}
                                    />
                                </TabsContent>
                                <TabsContent value="invoices">
                                    <TabsContent value="invoices"></TabsContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
