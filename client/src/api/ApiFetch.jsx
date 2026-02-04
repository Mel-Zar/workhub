const API_BASE = "http://localhost:5001";

// ============================================
export async function apiFetch(url, options = {}) {

    const accessToken = localStorage.getItem("accessToken");

    console.log("➡️ apiFetch called:", url);
    console.log("🔑 Access token exists:", !!accessToken);

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
    } else {
        console.warn("⚠️ No access token in localStorage");
    }

    const fullUrl = url.startsWith("http")
        ? url
        : `${API_BASE}${url}`;

    console.log("🌍 Request URL:", fullUrl);
    console.log("📦 Request headers:", headers);

    let response;

    try {
        response = await fetch(fullUrl, {
            ...options,
            headers
        });
    } catch (err) {
        console.error("❌ Network error:", err);
        throw err;
    }

    console.log("⬅️ Response status:", response.status);

    // ============================================
    // 🔁 AUTO REFRESH ACCESS TOKEN
    // ============================================

    if (response.status === 401 && !options._retry) {

        console.warn("🔁 401 received → trying refresh token");

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            console.error("❌ No refresh token → hard logout");
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

        console.log("🔄 Refresh status:", refreshRes.status);

        if (!refreshRes.ok) {
            console.error("❌ Refresh failed → logout");
            hardLogout();
            return response;
        }

        const data = await refreshRes.json();

        console.log("✅ New access token received");

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

// ============================================
// 🔒 HARD LOGOUT
// ============================================

function hardLogout() {
    console.warn("🚪 Logging out user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
}
