import {useCallback, useState} from "react";

const STORAGE_KEY = "tablecrm_token";

export function useToken() {
    const [token, setTokenState] = useState<string | null>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;
            const trimmed = stored.trim();
            return trimmed.length ? trimmed : null;
        } catch {
            return null;
        }
    });

    const setToken = useCallback((value: string) => {
        const trimmed = value.trim();
        if (!trimmed.length) return;
        localStorage.setItem(STORAGE_KEY, trimmed);
        setTokenState(trimmed);
    }, []);

    const clearToken = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setTokenState(null);
    }, []);

    return {token, setToken, clearToken};
}
