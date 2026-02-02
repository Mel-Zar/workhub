export async function apiFetch(url, options = {}) {
    // Hämta token från localStorage
    let accessToken = localStorage.getItem("accessToken");

    // Starta headers
    const headers = {
        ...(options.headers || {})
    };

    // Sätt Content-Type om det inte är FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    // Lägg till Authorization om accessToken finns
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Kör första request
    let response = await fetch(url, { ...options, headers });

    // 🔁 Om 401 → försök refresh
    if (response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("No refresh token available");
        }

        try {
            // Hämta nytt accessToken
            const refreshRes = await fetch("http://localhost:5001/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            });

            if (!refreshRes.ok) {
                localStorage.clear();
                window.location.href = "/login";
                throw new Error("Refresh token invalid");
            }

            const data = await refreshRes.json();
            localStorage.setItem("accessToken", data.accessToken);

            // Uppdatera headers med nytt token
            headers["Authorization"] = `Bearer ${data.accessToken}`;

            // Kör original request igen
            response = await fetch(url, { ...options, headers });

        } catch (err) {
            console.error("Token refresh failed:", err);
            localStorage.clear();
            window.location.href = "/login";
            throw err;
        }
    }

    return response;
}
