const API_BASE = "http://localhost:5001";

export async function apiFetch(url, options = {}) {

    const accessToken = localStorage.getItem("accessToken");

    const headers = {
        ...(options.headers || {})
    };

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

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

    // 🔁 AUTO REFRESH TOKEN
    if (response.status === 401 && !options._retry) {

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.clear();
            window.location.href = "/login";
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
            localStorage.clear();
            window.location.href = "/login";
            return response;
        }

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

    return response;
}
