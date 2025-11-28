const API_BASE_URL = "https://app.tablecrm.com/api/v1";

type Query = Record<string, string | number | boolean | undefined | null>;

function buildQuery(params: Query) {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        search.append(key, String(value));
    });

    const queryString = search.toString();
    return queryString ? `?${queryString}` : "";
}

async function request<T>(
    path: string,
    token: string,
    options?: RequestInit & { query?: Query }
): Promise<T> {
    if (!token) {
        throw new Error("Token is required for API request");
    }

    const {query, ...init} = options ?? {};

    const queryString = buildQuery({
        ...(query ?? {}),
        token,
    });

    const url = `${API_BASE_URL}${path}${queryString}`;

    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
        },
    });

    if (!res.ok) {
        let text = "";
        try {
            text = await res.text();
        } catch {

        }
        throw new Error(
            `API error ${res.status}: ${text || res.statusText}`
        );
    }

    return (await res.json()) as T;
}

export function apiGet<T>(path: string, token: string, query?: Query) {
    return request<T>(path, token, {method: "GET", query});
}

export function apiPost<T>(
    path: string,
    token: string,
    body: unknown,
    query?: Query
) {
    return request<T>(path, token, {
        method: "POST",
        body: JSON.stringify(body),
        query,
    });
}
