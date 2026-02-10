const API_BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}, retry = true) {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const isFormData = options.body instanceof FormData;

    options.headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    };

    const res = await fetch(`${API_BASE}${url}`, options);

    // ✅ SUCCESS
    if (res.ok) {
        if (res.status === 204) return null;
        return res.json();
    }

    // ❌ Inte auth-fel
    if (res.status !== 401 || !retry) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Request failed");
    }

    // 🔁 Refresh token
    if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("Session expired");
    }

    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
    });

    if (!refreshRes.ok) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("Session expired");
    }

    const data = await refreshRes.json();
    accessToken = data.accessToken;
    localStorage.setItem("accessToken", accessToken);

    options.headers.Authorization = `Bearer ${accessToken}`;

    const retryRes = await fetch(`${API_BASE}${url}`, options);
    if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({}));
        throw new Error(err.error || "Request failed");
    }

    return retryRes.json();
}
