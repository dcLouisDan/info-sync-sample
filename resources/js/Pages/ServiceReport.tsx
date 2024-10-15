import { ClientCombobox } from "@/components/ClientCombobox";
import ServiceReportDocument from "@/components/ServiceReportDocument";
import { Textarea } from "@/components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";
export default function ServiceReport({
    clientList,
}: {
    clientList: Array<any>;
}) {
    console.log(clientList);
    const [value, setValue] = useState("");
    const [jobOrder, setJobOrder] = useState("");
    const clientData =
        value !== ""
            ? clientList.find((client) => client?.customer == value)
            : null;
    console.log(clientData);
    return (
        <>
            <Head>
                <title>Service Report</title>
            </Head>
            <AuthenticatedLayout>
                <div className="flex flex-col items-center w-full">
                    <h1 className="font-bold text-3xl py-4">
                        Generate Service Report
                    </h1>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-8 justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 items-center">
                                    <p>Customer:</p>
                                    <ClientCombobox
                                        setValue={setValue}
                                        value={value}
                                        clientList={clientList}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p>Job Order Description:</p>
                                    <Textarea
                                        className="bg-white min-h-[100px]"
                                        placeholder="Enter job order description..."
                                        value={jobOrder}
                                        onChange={(e) =>
                                            setJobOrder(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {value !== "" && (
                            <div className="w-[600px] border-2 border-zinc-950 rounded-lg overflow-hidden">
                                <PDFViewer className="w-full h-[500px]">
                                    <ServiceReportDocument
                                        accountName={clientData.customer}
                                        address={clientData.address}
                                        contactName={clientData.customer}
                                        contactNumber={clientData.mobileNumber}
                                        contactEmail={clientData.emailAddress}
                                        jobOrderDescription={jobOrder}
                                    />
                                </PDFViewer>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
