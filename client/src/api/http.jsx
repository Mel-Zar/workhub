import { apiFetch } from "./ApiFetch";

// ============================================
// Mellanlager som:
// - kör apiFetch
// - parsar JSON
// - kastar errors
// ============================================

export async function request(url, options = {}) {

    const res = await apiFetch(url, options);

    let data = null;

    try {
        data = await res.json();
    } catch (err) {
        console.warn("No JSON body", err);
    }

    if (!res.ok) {
        throw new Error(data?.error || "Request failed");
    }

    return data;
}
