import { columns } from "@/components/client_table/columns";
import { columns as invoice_columns } from "@/components/invoice_table/columns";
import { DataTable } from "@/components/client_table/data-table";
import { DataTable as InvoiceTable } from "@/components/invoice_table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { FlashMessages } from "@/types/global";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
    quickbaseClients: Array<any>;
    invoiceClients: Array<any>;
    quickbaseInvoices: Array<any>;
    invoiceInvoices: Array<any>;
    ninjaInvoices: Array<any>;
};

function QBInvoiceForm() {
    const { data, setData, post, processing, reset, errors } = useForm({
        clientNumber: "",
        clientName: "",
        description: "",
        item: "",
        amount: "",
    });
    return (
        <div>
            <h2>Add new Invoice</h2>
            <form
                className="grid grid-cols-2 gap-1 pb-4 border-b"
                onSubmit={(e) => {
                    e.preventDefault();

                    post(route("ninjaClient.add"), {
                        onSuccess: () => reset(),
                        onError: (error) => {
                            console.log(error);
                        },
                    });
                }}
            >
                <Input
                    type="text"
                    placeholder="Client Number"
                    name="clientNumber"
                    value={data.clientNumber}
                    onChange={(e) => setData("clientNumber", e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Client Number"
                    name="clientName"
                    value={data.clientNumber}
                    onChange={(e) => setData("clientNumber", e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={data.clientNumber}
                    onChange={(e) => setData("clientNumber", e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Item"
                    name="item"
                    value={data.clientNumber}
                    onChange={(e) => setData("clientNumber", e.target.value)}
                    required
                />
                <Input
                    type="number"
                    placeholder="Amount"
                    name="amount"
                    value={data.clientNumber}
                    onChange={(e) => setData("clientNumber", e.target.value)}
                    required
                />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}

export default function Dashboard({
    quickbaseClients,
    invoiceClients,
    quickbaseInvoices,
    invoiceInvoices,
    ninjaInvoices,
}: Props) {
    const { props } = usePage<PageProps & { flash: FlashMessages }>();
    const { success, error } = props.flash ?? { success: null, error: null };
    const { data, setData, post, processing, reset, errors } = useForm({
        number: "",
        clientName: "",
        contactFirstName: "",
        contactLastName: "",
        email: "",
    });
    console.log(ninjaInvoices);
    console.log(invoiceInvoices);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
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
                            <QBInvoiceForm />
                            <Tabs defaultValue="clients">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="clients">
                                        Clients
                                    </TabsTrigger>
                                    <TabsTrigger value="invoices">
                                        Invoices
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="clients">
                                    <DataTable
                                        columns={columns}
                                        data={quickbaseClients}
                                    />
                                </TabsContent>
                                <TabsContent value="invoices">
                                    <InvoiceTable
                                        columns={invoice_columns}
                                        data={quickbaseInvoices}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-center font-bold">
                                Invoice Ninja
                            </h1>
                            <div className="grid gap-4">
                                <h2>Add New Client</h2>
                                <form
                                    className="grid gap-1 grid-cols-2 border-b pb-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        post(route("ninjaClient.add"), {
                                            onSuccess: () => reset(),
                                            onError: (error) => {
                                                console.log(error);
                                            },
                                        });
                                    }}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Account Number"
                                        name="number"
                                        value={data.number}
                                        onChange={(e) =>
                                            setData("number", e.target.value)
                                        }
                                        required
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Client Name"
                                        name="clientName"
                                        value={data.clientName}
                                        onChange={(e) =>
                                            setData(
                                                "clientName",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Contact First Name"
                                        name="contactFirstName"
                                        value={data.contactFirstName}
                                        onChange={(e) =>
                                            setData(
                                                "contactFirstName",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Contact Last Name"
                                        name="contactLastName"
                                        value={data.contactLastName}
                                        onChange={(e) =>
                                            setData(
                                                "contactLastName",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />
                                    <Button className="">Submit</Button>
                                </form>
                                <Tabs defaultValue="clients">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="clients">
                                            Clients
                                        </TabsTrigger>
                                        <TabsTrigger value="invoices">
                                            Invoices
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="clients">
                                        <DataTable
                                            columns={columns}
                                            data={invoiceClients}
                                        />
                                    </TabsContent>
                                    <TabsContent value="invoices">
                                        <TabsContent value="invoices">
                                            <InvoiceTable
                                                columns={invoice_columns}
                                                data={invoiceInvoices}
                                            />
                                        </TabsContent>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
