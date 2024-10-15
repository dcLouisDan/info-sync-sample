import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const bodyFont = "11pt";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        fontFamily: "Helvetica",
    },
    section: {
        display: "flex",
        flexDirection: "row",
        borderBottom: "1px solid black",
    },
    sectionHeader: {
        fontFamily: "Helvetica-Bold",
        textAlign: "center",
        fontSize: "12pt",
        flexDirection: "row",
        backgroundColor: "#d1d1d1",
        borderBottom: "1px solid black",
    },
    headerTitle: {
        textAlign: "center",
        width: "100%",
    },
    cell: {
        flex: 1,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderRight: "1px solid black",
    },
    cellHalf: {
        flex: 0.5,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderRight: "1px solid black",
    },
    cellLast: {
        fontSize: bodyFont,
        flex: 1,
        padding: 2,
        margin: 0,
    },
    signatoryCell: {
        flex: 1,
        fontSize: "8pt",
        padding: 1,
        margin: 0,
        width: "100%",
        textAlign: "center",
        borderRight: "1px solid black",
    },
    signatoryCellLast: {
        flex: 1,
        fontSize: "8pt",
        padding: 1,
        margin: 0,
        width: "100%",
        textAlign: "center",
    },
});

export default function ServiceReportDocument({
    accountName,
    address,
    contactName,
    contactNumber,
    contactEmail,
    jobOrderDescription,
    date,
}: {
    accountName?: string;
    address?: string;
    contactName?: string;
    contactNumber?: string;
    contactEmail?: string;
    jobOrderDescription?: string;
    date: Date | undefined;
}) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "1in",
                        marginBottom: "0.1in",
                        fontFamily: "Helvetica-Bold",
                    }}
                >
                    <Text>SERVICE REPORT</Text>
                </View>
                <View
                    style={{
                        border: "1px solid black",
                        margin: "0 1in 0.5in 1in",
                    }}
                >
                    <View style={styles.section}>
                        {!!date ? (
                            <Text style={styles.cell}>
                                DATE: {date?.getMonth() + 1}-{date?.getDate()}-
                                {date?.getFullYear()}
                            </Text>
                        ) : (
                            <Text style={styles.cell}>DATE:</Text>
                        )}
                        <View
                            style={{
                                ...styles.cell,
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <Text>TIME STARTED:</Text>
                            <Text
                                style={{
                                    fontSize: "6pt",
                                    color: "#b8b8b8",
                                    marginBottom: "auto",
                                    paddingLeft: 2,
                                }}
                            >
                                (hh:mmAM/PM)
                            </Text>
                        </View>
                        <View
                            style={{
                                ...styles.cell,
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <Text>TIME FINISHED:</Text>
                            <Text
                                style={{
                                    fontSize: "6pt",
                                    color: "#b8b8b8",
                                    marginBottom: "auto",
                                    paddingLeft: 2,
                                }}
                            >
                                (hh:mmAM/PM)
                            </Text>
                        </View>
                    </View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerTitle}>
                            CUSTOMER INFORMATION
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cellLast}>
                            ACCOUNT NAME: {accountName}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cellLast}>ADDRESS: {address}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cellLast}>
                            CONTACT NAME: {contactName}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cell}>
                            CONTACT NUMBER: {contactNumber}
                        </Text>
                        <Text style={styles.cellLast}>
                            CONTACT EMAIL: {contactEmail}
                        </Text>
                    </View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerTitle}>ACTIVITY DETAILS</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cell}>NAP ID:</Text>
                        <Text style={styles.cell}>NAP PORT:</Text>
                        <View
                            style={{
                                ...styles.cell,
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <Text>PORT SIGNAL:</Text>
                            <Text
                                style={{
                                    fontSize: "6pt",
                                    color: "#b8b8b8",
                                    marginBottom: "auto",
                                    paddingLeft: 2,
                                }}
                            >
                                (dBm)
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            fontSize: bodyFont,
                            borderBottom: "1px solid black",
                        }}
                    >
                        <Text
                            style={{
                                textDecoration: "underline",
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            CABLE TYPE:
                        </Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                gap: 5,
                                padding: 2,
                            }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                ___Drop Fiber
                            </Text>
                            <Text style={{ textAlign: "center" }}>
                                ___F8(12/24Core) Cable
                            </Text>
                            <Text style={{ textAlign: "center" }}>___Cat6</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cell}>Cable Start meter:</Text>
                        <Text style={styles.cell}>Cable End meter:</Text>
                        <Text style={styles.cellLast}>Total Cable meter:</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cell}>APC Used:</Text>
                        <Text style={styles.cell}>UPC Used:</Text>
                        <Text style={styles.cellLast}>Faulty:</Text>
                    </View>
                    <View style={styles.section}>
                        <View
                            style={{
                                flex: 1,
                                height: 40,
                                borderRight: "1px solid black",
                            }}
                        ></View>
                        <View
                            style={{
                                flex: 1,
                                height: 40,
                                borderRight: "1px solid black",
                            }}
                        ></View>
                        <View style={{ flex: 1, height: 40 }}></View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cell}>Modem 2.4G SSID:</Text>
                        <Text style={styles.cellLast}>2.4G Password:</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cell}>Modem 5G SSID:</Text>
                        <Text style={styles.cellLast}>5G Password:</Text>
                    </View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerTitle}>
                            OTHER PARTS AND MATERIALS
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text
                            style={{ ...styles.cellHalf, textAlign: "center" }}
                        >
                            Unit
                        </Text>
                        <Text
                            style={{ ...styles.cellHalf, textAlign: "center" }}
                        >
                            Qty
                        </Text>
                        <Text style={styles.cell}>Description</Text>
                        <Text style={styles.cellLast}>Serial Number</Text>
                    </View>
                    <View style={{ ...styles.section, height: 14 }}>
                        <Text style={styles.cellHalf}></Text>
                        <Text style={styles.cellHalf}></Text>
                        <Text style={styles.cell}></Text>
                        <Text style={styles.cellLast}></Text>
                    </View>
                    <View style={{ ...styles.section, height: 14 }}>
                        <Text style={styles.cellHalf}></Text>
                        <Text style={styles.cellHalf}></Text>
                        <Text style={styles.cell}></Text>
                        <Text style={styles.cellLast}></Text>
                    </View>
                    <View style={{ ...styles.section, height: 14 }}>
                        <Text style={styles.cellHalf}></Text>
                        <Text style={styles.cellHalf}></Text>
                        <Text style={styles.cell}></Text>
                        <Text style={styles.cellLast}></Text>
                    </View>
                    <View
                        style={{
                            padding: 2,
                            minHeight: 70,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: bodyFont,
                                fontFamily: "Helvetica-Bold",
                            }}
                        >
                            Job Order Description:
                        </Text>
                        <Text
                            style={{
                                marginHorizontal: "auto",
                                marginVertical: "auto",
                                fontSize: bodyFont,
                            }}
                        >
                            {jobOrderDescription}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        border: "1px solid black",
                        margin: "0 1in 1in 1in",
                    }}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerTitle}>
                            SERVICE ACKNOWLEDGEMENT
                        </Text>
                    </View>
                    <View style={{ ...styles.section, height: 30 }}>
                        <Text style={styles.cell}>CUSTOMER:</Text>
                        <Text style={styles.cellLast}>
                            ASSIGNED TECHNICIANS:
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.signatoryCell}>
                            PRINT NAME AND SIGNATURE
                        </Text>
                        <Text style={styles.signatoryCellLast}>
                            PRINT NAME AND SIGNATURE
                        </Text>
                    </View>
                    <View
                        style={{
                            padding: 2,
                            minHeight: 70,
                            display: "flex",
                            flexDirection: "column",
                            borderBottom: "1px solid black",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: bodyFont,
                            }}
                        >
                            FINDINGS:
                        </Text>
                    </View>
                    <View
                        style={{
                            padding: 2,
                            minHeight: 70,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: bodyFont,
                            }}
                        >
                            SOLUTIONS:
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
