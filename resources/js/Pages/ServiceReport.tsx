import { ClientCombobox } from "@/components/ClientCombobox";
import { DatePicker } from "@/components/DatePicker";
import ServiceReportDocument from "@/components/ServiceReportDocument";
import { Textarea } from "@/components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type CustomerContact = {
    name: string;
    phone: string;
};

export default function ServiceReport({
    clientList,
}: {
    clientList: Array<any>;
}) {
    function getContactList(clientData: any) {
        const contactList = [];
        const contact1: CustomerContact = { name: "", phone: "" };
        const contact2: CustomerContact = { name: "", phone: "" };

        if (clientData.customer !== "") {
            contact1.name = clientData.customer;
        }

        if (clientData.mobileNumber !== "") {
            contact1.phone = clientData.mobileNumber;
            contactList.push(contact1);
        }

        if (clientData.alternateContactName !== "") {
            contact2.name = clientData.alternateContactName;
        }

        if (clientData.alternateContactNumber !== "") {
            contact2.phone = clientData.alternateContactNumber;
            contactList.push(contact2);
        }

        return contactList;
    }

    console.log(clientList);
    const [value, setValue] = useState("");
    const [jobOrder, setJobOrder] = useState("");
    const today = new Date();
    const [date, setDate] = useState<Date | undefined>(today);
    const clientData =
        value !== ""
            ? clientList.find((client) => client?.customer == value)
            : null;
    const contactNameList =
        clientData !== null ? getContactList(clientData) : [];
    const [contact, setContact] = useState(
        clientData !== null ? contactNameList[0] : { name: "", phone: "" }
    );
    const [isOther, setIsOther] = useState(false);

    useEffect(() => {
        setContact(
            clientData !== null ? contactNameList[0] : { name: "", phone: "" }
        );
    }, [value, clientData]);
    console.log(clientData);
    const gridLayout = value !== "" ? "xl:grid-cols-2" : "";
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
                    <div
                        className={
                            "grid grid-cols-1 gap-4 px-8 justify-center " +
                            gridLayout
                        }
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 items-center">
                                    <p>Customer:</p>
                                    <ClientCombobox
                                        setValue={(value) => {
                                            setValue(value);
                                        }}
                                        value={value}
                                        clientList={clientList}
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <p className="text-nowrap">Contact Name:</p>
                                    <Select
                                        value={contact.name}
                                        disabled={value === ""}
                                        onValueChange={(value) => {
                                            if (value == "other") {
                                                setIsOther(true);
                                                setContact({
                                                    name: "",
                                                    phone: "",
                                                });
                                                return;
                                            }

                                            setIsOther(false);
                                            const contact =
                                                contactNameList.find(
                                                    (contact) =>
                                                        contact.name == value
                                                );

                                            if (!contact) {
                                                setContact({
                                                    name: "",
                                                    phone: "",
                                                });
                                                return;
                                            }
                                            setContact(contact);
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select contact person" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Contact Person
                                                </SelectLabel>
                                                {contactNameList.map(
                                                    (contact, index) => {
                                                        return (
                                                            <SelectItem
                                                                key={index}
                                                                value={
                                                                    contact.name
                                                                }
                                                            >
                                                                {contact.name}
                                                            </SelectItem>
                                                        );
                                                    }
                                                )}
                                                <SelectItem value="other">
                                                    Other
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {isOther && (
                                    <div className="flex gap-2 items-center">
                                        <p className="text-nowrap text-transparent">
                                            Contact Name:
                                        </p>
                                        <Input
                                            className="bg-white"
                                            placeholder="Input contact name..."
                                            type="tel"
                                            value={contact.name}
                                            onChange={(e) =>
                                                setContact((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                )}
                                <div className="flex gap-2 items-center">
                                    <p className="text-nowrap">
                                        Contact Number:
                                    </p>
                                    <Input
                                        className="bg-white"
                                        value={contact.phone}
                                        disabled={!isOther}
                                        placeholder="Input contact number..."
                                        onChange={(e) =>
                                            setContact((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <p>Date:</p>
                                    <DatePicker date={date} setDate={setDate} />
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
                                        contactName={contact.name}
                                        contactNumber={contact.phone}
                                        contactEmail={clientData.emailAddress}
                                        jobOrderDescription={jobOrder}
                                        date={date}
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
