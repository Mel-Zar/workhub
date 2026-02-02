export async function apiFetch(url, options = {}) {

    let accessToken = localStorage.getItem("accessToken");

    const headers = {
        ...(options.headers || {})
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // ================= REFRESH =================
    if (response.status === 401 && !options._retry) {

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.clear();
            window.location.href = "/login";
            return;
        }

        const refreshRes = await fetch(
            "http://localhost:5001/api/auth/refresh",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            }
        );

        if (!refreshRes.ok) {
            localStorage.clear();
            window.location.href = "/login";
            return;
        }

        const data = await refreshRes.json();
        localStorage.setItem("accessToken", data.accessToken);

        headers["Authorization"] = `Bearer ${data.accessToken}`;

        return apiFetch(url, {
            ...options,
            headers,
            _retry: true
        });
    }

    return response;
}
