import CollectionListDocument from "@/components/CollectionListDocument";
import { Head } from "@inertiajs/react";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";

export default function CollectionListPage({
    clientsByBarangay,
}: {
    clientsByBarangay: Object;
}) {
    console.log(clientsByBarangay);
    return (
        <>
            <Head>
                <title>Collection List</title>
            </Head>
            <div className="h-screen w-screen">
                <PDFViewer className="h-full w-full">
                    <CollectionListDocument />
                </PDFViewer>
            </div>
        </>
    );
}
