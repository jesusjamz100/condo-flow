import { useState, useEffect } from "react";
import Loading from "../../../components/Loading";
import type { ApartmentResponse, InvoiceResponse } from "../../../types/api";
import formatDate from "../../../utils/formatDate";
import { getInvoiceById } from "../api";
import { getApartmentById, getOneOfMyApartments } from "../../apartments/api";

const InvoiceDetails = ({ invoiceId, isAdmin }: { invoiceId: number; isAdmin: boolean }) => {

    const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
    const [apartment, setApartment] = useState<ApartmentResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const dataInvoice = await getInvoiceById(invoiceId);
            setInvoice(dataInvoice);
            const dataApartment = isAdmin ? await getApartmentById(dataInvoice.apartmentId) : await getOneOfMyApartments(dataInvoice.apartmentId);
            setApartment(dataApartment);
            setLoading(false);
        };
        fetchData();
    }, [invoiceId, isAdmin])

    if (loading) {
        return <Loading text="Cargando Factura..." />
    }

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                <p className="text-lg">
                    <span className="font-semibold">Subtotal: </span>
                    ${invoice?.amount}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Descuento (10%): </span>
                    {invoice?.discountAmount ? `$${invoice?.discountAmount}` : "N/A" }
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Multa (10%): </span>
                    {invoice?.penaltyAmount ? `$${invoice?.penaltyAmount}` : "N/A" }
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Total Factura: </span>
                    ${invoice?.finalAmount}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Apartamento: </span>
                    {apartment?.code}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Fecha: </span>
                    { invoice ? formatDate(invoice.createdDate) : "Cargando" }
                </p>
            </div>
        </>
    )
}

export default InvoiceDetails;