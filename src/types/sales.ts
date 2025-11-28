export interface SaleGoodPayload {
    price_type?: number | null;
    price: number;
    quantity: number;
    unit?: number | null;
    unit_name?: string | null;
    tax?: number | null;
    discount?: number;
    sum_discounted?: number;
    status?: boolean | null;
    nomenclature: string | number;
    nomenclature_name?: string;
}

export interface SalePayload {
    operation: string;
    comment?: string | null;
    contragent: number | string;
    contragent_name?: string;
    organization: number | string;
    warehouse: number | string;
    sum: number;
    doc_discount?: number | null;
    priority?: number;
    status?: boolean;
    order_status?: string;
    goods: SaleGoodPayload[];

    tags?: string;
    sales_manager?: number | null;
    tax_included?: boolean | null;
    tax_active?: boolean | null;
    paid_doc?: number | null;
    paid_rubles?: number | null;
    paid_loyality?: number | null;
}
