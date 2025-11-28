export interface BaseEntity {
    id: number | string;
    name: string;
    [key: string]: unknown;
}

export interface Organization extends BaseEntity {}

export interface Warehouse extends BaseEntity {}

export interface Paybox extends BaseEntity {}

export interface PriceType extends BaseEntity {}

export interface Contragent extends BaseEntity {
    phone?: string;
}

export interface NomenclatureItem extends BaseEntity {
    price?: number;
    article?: string;
}

export interface ListResponse<T> {
    count?: number;
    result?: T[];
    results?: T[];
}

