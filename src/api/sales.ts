import {apiPost} from "@/api/client";
export interface SaleResponse {
    id: number;
    number?: string;

    [key: string]: unknown;
}

export function createSale(token: string, payload: any[]) {
    return apiPost("/docs_sales/", token, payload);
}
