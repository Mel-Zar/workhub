const API_BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}, retry = true) {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // ⚡️ Sätt headers
    options.headers = {
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    };

    const res = await fetch(`${API_BASE}${url}`, options);

    // ✅ Om inte 401, returnera direkt
    if (res.status !== 401 || !retry) return res;

    // 🔁 Access token expired → försök refresh
    if (!refreshToken) {
        console.error("Ingen refreshToken, logga in igen!");
        localStorage.clear();
        window.location.href = "/login";
        return res;
    }

    try {
        const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!refreshRes.ok) {
            console.error("Refresh-token ogiltig, logga in igen!");
            localStorage.clear();
            window.location.href = "/login";
            return refreshRes;
        }

        const data = await refreshRes.json();
        accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        // 🔁 Retry original request med nytt token
        options.headers.Authorization = `Bearer ${accessToken}`;
        return fetch(`${API_BASE}${url}`, options);
    } catch (err) {
        console.error("Refresh-token error:", err);
        localStorage.clear();
        window.location.href = "/login";
        return res;
    }
}
