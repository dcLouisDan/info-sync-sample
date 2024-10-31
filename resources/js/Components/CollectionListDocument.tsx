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
        fontSize: "11pt",
        flexDirection: "row",
        padding: "2px 0",
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
    cellHalfLast: {
        fontSize: bodyFont,
        flex: 0.5,
        padding: 2,
        margin: 0,
    },
    headerCell: {
        flex: 1,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderRight: "1px solid black",
        fontFamily: "Helvetica-Bold",
    },
    headerCellHalf: {
        flex: 0.5,
        fontSize: bodyFont,
        padding: 2,
        margin: 0,
        borderRight: "1px solid black",
        fontFamily: "Helvetica-Bold",
    },
    headerCellLast: {
        fontSize: bodyFont,
        flex: 1,
        padding: 2,
        margin: 0,
        fontFamily: "Helvetica-Bold",
    },
    headerCellHalfLast: {
        fontSize: bodyFont,
        flex: 0.5,
        padding: 2,
        margin: 0,
        fontFamily: "Helvetica-Bold",
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

export default function CollectionListDocument({}: {}) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "0.5in",
                        marginBottom: "0.1in",
                        fontFamily: "Helvetica-Bold",
                        fontSize: "12pt",
                    }}
                >
                    <Text>Collection List</Text>
                </View>
                <View
                    style={{
                        border: "1px solid black",
                        margin: "0 0.5in 0.5in 0.5in",
                    }}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerTitle}>Baranggay Name</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.headerCell}>Customer</Text>
                        <Text style={styles.headerCell}>Plan</Text>
                        <Text style={styles.headerCellHalfLast}>
                            Amount Due
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.cell}>Name</Text>
                        <Text style={styles.cell}>Plan</Text>
                        <Text style={styles.cellHalfLast}>Amount Due</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
