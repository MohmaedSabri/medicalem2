import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

export interface InvoiceItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface InvoicePdfProps {
    logoSrc?: string;
    business: {
        name: string;
        address?: string;
        phone?: string;
        email?: string;
        website?: string;
    };
    contact: {
        name: string;
        address?: string;
        phone?: string;
        email?: string;
    };
    invoiceMeta: {
        number: string | number;
        date: string;
        dueDate: string;
    };
    items: InvoiceItem[];
    totals: {
        subtotal: number;
        vat: number;
        total: number;
        currency?: string;
    };
    terms?: string[];
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 36,
        paddingHorizontal: 36,
        paddingBottom: 40,
        fontSize: 10,
        lineHeight: 1.5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16
    },
    logo: {
        width: 80,
        height: 50,
        objectFit: 'contain'
    },
    businessBlock: {
        flexGrow: 1,
        marginLeft: 12
    },
    businessName: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 4
    },
    label: {
        fontSize: 9,
        color: '#666'
    },
    value: {
        fontSize: 10
    },
    sectionTitle: {
        fontSize: 12,
        marginTop: 8,
        marginBottom: 6,
        fontWeight: 700
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    contactBox: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb'
    },
    metaBox: {
        marginTop: 10
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    th: {
        paddingVertical: 6,
        paddingHorizontal: 6,
        fontSize: 9,
        fontWeight: 700
    },
    td: {
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        fontSize: 10
    },
    colNo: { width: '6%' },
    colTitle: { width: '54%' },
    colPrice: { width: '12%', textAlign: 'right' as const },
    colQty: { width: '10%', textAlign: 'right' as const },
    colUnit: { width: '8%', textAlign: 'right' as const },
    colTotal: { width: '10%', textAlign: 'right' as const },
    totalsBox: {
        marginTop: 12,
        marginLeft: 'auto',
        width: 220,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 8
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    totalsLabel: {
        color: '#374151'
    },
    totalsValue: {
        fontWeight: 700
    },
    termsBox: {
        marginTop: 16,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb'
    },
    termItem: {
        fontSize: 9,
        color: '#4b5563',
        marginBottom: 4
    }
});

const format = (value: number, currency: string = 'AED') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);

export const InvoicePdf: React.FC<InvoicePdfProps> = ({ logoSrc, business, contact, invoiceMeta, items, totals, terms }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : <View />}
                <View style={styles.businessBlock}>
                    <Text style={styles.businessName}>{business.name}</Text>
                    {business.address ? <Text>{business.address}</Text> : null}
                    {business.phone ? <Text>{business.phone}</Text> : null}
                    {business.email ? <Text>{business.email}</Text> : null}
                    {business.website ? <Text>{business.website}</Text> : null}
                </View>
                <View>
                    <Text style={styles.sectionTitle}>Invoice</Text>
                    <Text>Invoice #: {invoiceMeta.number}</Text>
                    <Text>Date: {invoiceMeta.date}</Text>
                    <Text>Due: {invoiceMeta.dueDate}</Text>
                </View>
            </View>

            <View style={styles.contactBox}>
                <Text style={styles.sectionTitle}>Bill To</Text>
                <Text><Text style={styles.label}>Name: </Text><Text style={styles.value}>{contact.name}</Text></Text>
                {contact.address ? <Text><Text style={styles.label}>Address: </Text><Text style={styles.value}>{contact.address}</Text></Text> : null}
                {contact.phone ? <Text><Text style={styles.label}>Phone: </Text><Text style={styles.value}>{contact.phone}</Text></Text> : null}
                {contact.email ? <Text><Text style={styles.label}>Email: </Text><Text style={styles.value}>{contact.email}</Text></Text> : null}
            </View>

            <View style={{ height: 8 }} />

            <View style={styles.tableHeader}>
                <Text style={[styles.th, styles.colNo]}>#</Text>
                <Text style={[styles.th, styles.colTitle]}>Item</Text>
                <Text style={[styles.th, styles.colPrice]}>Price</Text>
                <Text style={[styles.th, styles.colQty]}>Qty</Text>
                <Text style={[styles.th, styles.colUnit]}>Unit</Text>
                <Text style={[styles.th, styles.colTotal]}>Total</Text>
            </View>
            {items.map((it, idx) => (
                <View key={idx} style={styles.row} wrap>
                    <Text style={[styles.td, styles.colNo]}>{idx + 1}</Text>
                    <Text style={[styles.td, styles.colTitle]}>{it.name}</Text>
                    <Text style={[styles.td, styles.colPrice]}>{format(it.price, totals.currency)}</Text>
                    <Text style={[styles.td, styles.colQty]}>{it.quantity}</Text>
                    <Text style={[styles.td, styles.colUnit]}>pcs</Text>
                    <Text style={[styles.td, styles.colTotal]}>{format(it.total, totals.currency)}</Text>
                </View>
            ))}

            <View style={styles.totalsBox}>
                <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Subtotal</Text>
                    <Text style={styles.totalsValue}>{format(totals.subtotal, totals.currency)}</Text>
                </View>
                <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>VAT</Text>
                    <Text style={styles.totalsValue}>{format(totals.vat, totals.currency)}</Text>
                </View>
                <View style={styles.totalsRow}>
                    <Text style={[styles.totalsLabel, { fontWeight: 700 }]}>Total</Text>
                    <Text style={[styles.totalsValue, { fontSize: 12 }]}>{format(totals.total, totals.currency)}</Text>
                </View>
            </View>

            {terms && terms.length > 0 ? (
                <View style={styles.termsBox}>
                    <Text style={styles.sectionTitle}>Terms and Conditions</Text>
                    {terms.map((t, i) => (
                        <Text key={i} style={styles.termItem}>- {t}</Text>
                    ))}
                </View>
            ) : null}
        </Page>
    </Document>
);

export default InvoicePdf;
