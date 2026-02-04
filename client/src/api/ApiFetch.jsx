const API_BASE = "http://localhost:5001";

// ============================================
export async function apiFetch(url, options = {}) {

    const accessToken = localStorage.getItem("accessToken");

    const headers = {
        ...(options.headers || {})
    };

    // Auto JSON header
    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    // Attach access token
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const fullUrl = url.startsWith("http")
        ? url
        : `${API_BASE}${url}`;

    let response = await fetch(fullUrl, {
        ...options,
        headers
    });

    // ============================================
    // 🔁 AUTO REFRESH ACCESS TOKEN
    // ============================================

    if (response.status === 401 && !options._retry) {

        const refreshToken = localStorage.getItem("refreshToken");

        // No refresh token → logout
        if (!refreshToken) {
            hardLogout();
            return response;
        }

        const refreshRes = await fetch(
            `${API_BASE}/api/auth/refresh`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken })
            }
        );

        // Refresh failed → logout
        if (!refreshRes.ok) {
            hardLogout();
            return response;
        }

        const data = await refreshRes.json();

        // Save new access token
        localStorage.setItem("accessToken", data.accessToken);

        // Retry original request with new token
        return apiFetch(url, {
            ...options,
            _retry: true,
            headers: {
                ...headers,
                Authorization: `Bearer ${data.accessToken}`
            }
        });
    }

    return response;
}

// 🔒 HARD LOGOUT

function hardLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
}
