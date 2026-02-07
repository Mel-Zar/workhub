const API_BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
    const accessToken = localStorage.getItem("accessToken");

    let headers = { ...(options.headers || {}) };

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

    const response = await fetch(fullUrl, { ...options, headers });

    if (response.status !== 401 || options._retry) {
        return response;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return hardLogout();

    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
    });

    if (!refreshRes.ok) return hardLogout();

    const data = await refreshRes.json();
    localStorage.setItem("accessToken", data.accessToken);

    return apiFetch(url, {
        ...options,
        _retry: true,
        headers: {
            ...headers,
            Authorization: `Bearer ${data.accessToken}`
        }
    });
}

function hardLogout() {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Logged out");
}
