import { groupBy } from "@/lib/utils";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const bodyFont = "11pt";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        fontFamily: "Helvetica",
        margin: "0.5in",
        overflow: "hidden",
    },
    section: {
        display: "flex",
        flexDirection: "row",
        borderBottom: "1px solid black",
    },
    sectionHeader: {
        fontFamily: "Helvetica-Bold",
        fontSize: "11pt",
        flexDirection: "row",
        padding: "4px 0",
        borderBottom: "1px solid black",
    },
    headerTitle: {
        width: "100%",
    },
    cell: {
        flex: 1.2,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderLeft: "1px solid black",
    },
    cellHalf: {
        flex: 0.5,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderLeft: "1px solid black",
    },
    cellLast: {
        fontSize: bodyFont,
        flex: 1,
        padding: 2,
        margin: 0,
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
    },
    cellHalfLast: {
        fontSize: bodyFont,
        flex: 0.5,
        padding: 2,
        margin: 0,
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
    },
    headerCell: {
        flex: 1.2,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderLeft: "1px solid black",
        fontFamily: "Helvetica-Bold",
    },
    headerCellHalf: {
        flex: 0.5,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderLeft: "1px solid black",
        fontFamily: "Helvetica-Bold",
    },
    headerCellLast: {
        fontSize: bodyFont,
        flex: 1,
        padding: 2,
        margin: 0,
        fontFamily: "Helvetica-Bold",
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
    },
    headerCellHalfLast: {
        fontSize: bodyFont,
        flex: 0.5,
        padding: 2,
        margin: 0,
        fontFamily: "Helvetica-Bold",
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
    },
});

export default function CollectionListDocument({
    clientList,
}: {
    clientList: Array<any>;
}) {
    const clientsByBarangay = groupBy(clientList, "address2");
    const barangayList = Object.keys(clientsByBarangay);

    console.log(barangayList);
    return (
        <Document>
            <Page size="A4" style={styles.page} wrap={true}>
                <View
                    style={{
                        width: "7.27in",
                        textAlign: "center",
                        marginBottom: "0.1in",
                        fontFamily: "Helvetica-Bold",
                        fontSize: "12pt",
                    }}
                >
                    <Text>Collection List</Text>
                </View>
                <View
                    style={{
                        width: "7.27in",
                    }}
                >
                    {barangayList.map((barangay, index) => {
                        return (
                            <View key={index} wrap={false}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.headerTitle}>
                                        {barangay.trim()}
                                    </Text>
                                </View>
                                {clientsByBarangay[barangay].map(
                                    (client: any, index: number) => {
                                        return (
                                            <View
                                                style={styles.section}
                                                key={index}
                                                wrap={false}
                                            >
                                                <Text style={styles.cell}>
                                                    {client.name}
                                                </Text>
                                                <Text style={styles.cell}>
                                                    {client.custom_value3}
                                                </Text>
                                                <Text style={styles.cellHalf}>
                                                    {client.overdue_balance}
                                                </Text>
                                                <Text
                                                    style={styles.cellHalfLast}
                                                ></Text>
                                            </View>
                                        );
                                    }
                                )}
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
}
