export async function apiFetch(url, options = {}) {

    let accessToken = localStorage.getItem("accessToken");

    // Lägg till headers automatiskt
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`
    };

    let response = await fetch(url, {
        ...options,
        headers
    });

    // Om accessToken gått ut → försök refresh
    if (response.status === 401) {

        const refreshToken = localStorage.getItem("refreshToken");

        const refreshRes = await fetch("http://localhost:5001/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!refreshRes.ok) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return;
        }

        const refreshData = await refreshRes.json();
        localStorage.setItem("accessToken", refreshData.accessToken);

        // Kör original-request igen
        headers.Authorization = `Bearer ${refreshData.accessToken}`;

        response = await fetch(url, {
            ...options,
            headers
        });
    }

    return response;
}
