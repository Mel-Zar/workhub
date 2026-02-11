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

    let res;
    try {
        res = await fetch(`${API_BASE}${url}`, {
            ...options,
            signal: options.signal,
        });
    } catch (err) {
        if (err.name === "AbortError") throw err; // ✅ Viktigt
        throw err;
    }

    if (res.ok) {
        if (res.status === 204) return null;
        return res.json();
    }

    if (res.status !== 401 || !retry) {
        let errMsg = "Request failed";
        try {
            const err = await res.json();
            errMsg = err.error || errMsg;
        } catch {
            const text = await res.text().catch(() => "");
            if (text) errMsg = text;
        }
        throw new Error(errMsg);
    }

    // Refresh token
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

    const retryRes = await fetch(`${API_BASE}${url}`, {
        ...options,
        signal: options.signal,
    });
    if (!retryRes.ok) {
        let errMsg = "Request failed";
        try {
            const err = await retryRes.json();
            errMsg = err.error || errMsg;
        } catch {
            const text = await retryRes.text().catch(() => "");
            if (text) errMsg = text;
        }
        throw new Error(errMsg);
    }

    return retryRes.json();
}
