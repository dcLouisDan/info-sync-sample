import { columns } from "@/components/client_table/columns";
import { DataTable } from "@/components/client_table/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

type Props = {
    quickbaseClients: Array<any>;
    invoiceClients: Array<any>;
};

export default function Dashboard({ quickbaseClients, invoiceClients }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-2">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-center font-bold">Quickbase</h1>
                            <DataTable
                                columns={columns}
                                data={quickbaseClients}
                            />
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-center font-bold">
                                Invoice Ninja
                            </h1>
                            <DataTable
                                columns={columns}
                                data={invoiceClients}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
