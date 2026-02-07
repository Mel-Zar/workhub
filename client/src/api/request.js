import { apiFetch } from "./apiFetch";

export async function request(url, options = {}) {
    const res = await apiFetch(url, options);

    // ⚡️ Försök alltid parsa JSON, annars null
    let data = null;
    try {
        data = await res.json();
    } catch {
        // kan vara tom
    }

    // 🚨 Om response inte OK, kasta error med meddelande
    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
}
