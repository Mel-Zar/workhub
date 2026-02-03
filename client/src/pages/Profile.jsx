import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { apiFetch } from "../api/ApiFetch";
import { AuthContext } from "../context/AuthContext";

// ================= LOAD USER FROM TOKEN =================
function getUserFromToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return { name: "", email: "" };

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            name: payload.name || "",
            email: payload.email || ""
        };
    } catch {
        return { name: "", email: "" };
    }
}

function Profile() {

    // ✅ FROM CONTEXT
    const { updateUserName } = useContext(AuthContext);

    const user = getUserFromToken();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const [initialName, setInitialName] = useState(user.name);
    const [initialEmail, setInitialEmail] = useState(user.email);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");

    const [loading, setLoading] = useState(false);

    // ================= SAVE PROFILE =================
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await apiFetch("/api/auth/profile", {
                method: "PUT",
                body: JSON.stringify({
                    name,
                    email,
                    currentPassword,
                    newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Profile update failed");
                return;
            }

            // ✅ STORE NEW TOKEN
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            }

            // ✅ UPDATE NAVBAR NAME
            updateUserName(data.user.name);

            toast.success("Profile updated!");

            setInitialName(name);
            setInitialEmail(email);
            setCurrentPassword("");
            setNewPassword("");

        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    }

    // ================= DELETE ACCOUNT =================
    async function handleDeleteAccount() {

        if (!deletePassword) {
            toast.error("Password required to delete account");
            return;
        }

        const confirmDelete = window.confirm(
            "This will permanently delete your account. Continue?"
        );

        if (!confirmDelete) return;

        try {
            const res = await apiFetch("/api/auth/delete", {
                method: "DELETE",
                body: JSON.stringify({
                    currentPassword: deletePassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Delete failed");
                return;
            }

            toast.success("Account deleted");

            localStorage.clear();

            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } catch (err) {
            console.error(err);
            toast.error("Server error");
        }
    }

    // ================= CHECK CHANGES =================
    const hasChanges =
        name !== initialName ||
        email !== initialEmail ||
        newPassword.length > 0;

    return (
        <div>

            <h2>Profile</h2>

            {/* ================= PROFILE FORM ================= */}
            <form onSubmit={handleSubmit}>

                <h4>Profile info</h4>

                <input
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <h4>Change password</h4>

                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />

                <h4>Confirm identity</h4>

                <input
                    type="password"
                    placeholder="Current password (required)"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                />

                <button disabled={!hasChanges || loading}>
                    {loading ? "Saving..." : "Save"}
                </button>

            </form>

            {/* ================= DELETE ACCOUNT ================= */}
            <hr />

            <h4>Danger zone</h4>

            <input
                type="password"
                placeholder="Confirm password to delete account"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
            />

            <button type="button" onClick={handleDeleteAccount}>
                Delete account
            </button>

        </div>
    );
}

export default Profile;
