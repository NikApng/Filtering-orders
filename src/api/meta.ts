import { apiGet } from "@/api/client";
import {
    ListResponse,
    Organization,
    Warehouse,
    Paybox,
    PriceType,
    Contragent,
    NomenclatureItem,
} from "@/types/api";

function unwrapList<T>(data: ListResponse<T> | T[]): T[] {
    if (Array.isArray(data)) return data;

    if (Array.isArray((data as any).result)) {
        return (data as any).result as T[];
    }

    if (Array.isArray((data as any).results)) {
        return (data as any).results as T[];
    }

    return [];
}

export async function fetchOrganizations(token: string) {
    const data = await apiGet<ListResponse<Organization> | Organization[]>(
        "/organizations/",
        token
    );
    return unwrapList(data);
}

export async function fetchWarehouses(token: string) {
    const data = await apiGet<ListResponse<Warehouse> | Warehouse[]>(
        "/warehouses/",
        token
    );
    return unwrapList(data);
}

export async function fetchPayboxes(token: string) {
    const data = await apiGet<ListResponse<Paybox> | Paybox[]>(
        "/payboxes/",
        token
    );
    return unwrapList(data);
}

export async function fetchPriceTypes(token: string) {
    const data = await apiGet<ListResponse<PriceType> | PriceType[]>(
        "/price_types/",
        token
    );
    return unwrapList(data);
}

export async function fetchContragents(token: string) {
    const data = await apiGet<ListResponse<Contragent> | Contragent[]>(
        "/contragents/",
        token
    );
    return unwrapList(data);
}

export async function fetchAllNomenclature(token: string) {
    const data = await apiGet<
        ListResponse<NomenclatureItem> | NomenclatureItem[]
    >("/nomenclature/", token);

    return unwrapList(data);
}
