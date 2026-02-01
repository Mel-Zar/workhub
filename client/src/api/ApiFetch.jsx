export async function apiFetch(url, options = {}) {

    let accessToken = localStorage.getItem("accessToken");

    let headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, {
        ...options,
        headers
    });

    // ================= REFRESH =================
    if (response.status === 401) {

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("No refresh token");
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
            throw new Error("Refresh failed");
        }

        const data = await refreshRes.json();
        localStorage.setItem("accessToken", data.accessToken);

        headers.Authorization = `Bearer ${data.accessToken}`;

        // 🔁 kör original request igen
        response = await fetch(url, {
            ...options,
            headers
        });
    }

    return response;
}
