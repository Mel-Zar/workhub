const API_BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken && !url.includes("/auth") && !localStorage.getItem("refreshToken")) {
        hardLogout();
        throw new Error("No tokens");
    }

    let headers = {
        ...(options.headers || {})
    };

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = url.startsWith("http")
        ? url
        : `${API_BASE}${url}`;

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

    // 🔁 AUTO REFRESH
    if (response.status === 401 && !options._retry) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            hardLogout();
            return response;
        }

        const refreshRes = await fetch(
            `${API_BASE}/api/auth/refresh`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            }
        );

        if (!refreshRes.ok) {
            hardLogout();
            return response;
        }

        const data = await refreshRes.json();
        localStorage.setItem("accessToken", data.accessToken);

        // 🔁 RETRY ORIGINAL REQUEST WITH NEW TOKEN
        return apiFetch(url, {
            ...options,
            _retry: true,
            headers: {
                ...(options.headers || {}),
                "Authorization": `Bearer ${data.accessToken}`
            }
        });
    }

    return response;
}

function hardLogout() {
    console.warn("🚪 Logging out user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
}
