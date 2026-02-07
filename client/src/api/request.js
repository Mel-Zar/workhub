import { apiFetch } from "./ApiFetch";

export async function request(url, options = {}) {
    const res = await apiFetch(url, options);

    // 🔴 Om refresh misslyckades → apiFetch har redan loggat ut
    if (res.status === 401) {
        throw new Error("Unauthorized");
    }

    let data = null;
    try {
        data = await res.json();
    } catch {
        // vissa responses har ingen body
    }

    if (!res.ok) {
        throw new Error(data?.error || "Request failed");
    }

    return data;
}
