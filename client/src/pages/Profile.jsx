import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";

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

    // ================= UPDATE PROFILE =================
    function handleSubmit(e) {
        e.preventDefault();

        toast.info(
            ({ closeToast }) => (
                <div>
                    <p>Är du säker på att du vill uppdatera profilen?</p>
                    <button
                        onClick={async () => {
                            closeToast();
                            setLoading(true);

                            try {
                                const data = await authService.updateProfile({
                                    name,
                                    email,
                                    currentPassword,
                                    newPassword
                                });

                                if (data.accessToken) {
                                    localStorage.setItem("accessToken", data.accessToken);
                                }

                                updateUserName(data.user.name);

                                toast.success("Profil uppdaterad ✅");
                                setInitialName(name);
                                setInitialEmail(email);
                                setCurrentPassword("");
                                setNewPassword("");
                            } catch (err) {
                                console.error(err);
                                toast.error(err.message || "Serverfel vid uppdatering");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Ja
                    </button>
                    <button onClick={closeToast}>Avbryt</button>
                </div>
            ),
            { autoClose: false }
        );
    }

    // ================= DELETE ACCOUNT =================
    function handleDeleteAccount() {
        if (!deletePassword) {
            toast.error("Lösenord krävs för att radera konto");
            return;
        }

        toast.error(
            ({ closeToast }) => (
                <div>
                    <p>⚠️ Är du säker på att du vill radera kontot?</p>
                    <button
                        onClick={async () => {
                            closeToast();
                            setLoading(true);

                            try {
                                await authService.deleteAccount(deletePassword);
                                toast.success("Kontot raderat");

                                localStorage.clear();
                                setTimeout(() => (window.location.href = "/login"), 1000);
                            } catch (err) {
                                console.error(err);
                                toast.error(err.message || "Serverfel vid radering");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Ja, radera
                    </button>
                    <button onClick={closeToast}>Avbryt</button>
                </div>
            ),
            { autoClose: false }
        );
    }

    const hasChanges =
        name !== initialName || email !== initialEmail || newPassword.length > 0;

    return (
        <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
            <h2>Profil</h2>

            <form onSubmit={handleSubmit}>
                <h4>Profil info</h4>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Namn" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />

                <h4>Byt lösenord</h4>
                <input
                    type="password"
                    placeholder="Nytt lösenord"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />

                <h4>Bekräfta identitet</h4>
                <input
                    type="password"
                    placeholder="Nuvarande lösenord"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                />

                <button disabled={!hasChanges || loading}>
                    {loading ? "Sparar..." : "Spara"}
                </button>
            </form>

            <hr />

            <h4>Farlig zon</h4>
            <input
                type="password"
                placeholder="Bekräfta lösenord för radering"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
            />
            <button type="button" disabled={loading} onClick={handleDeleteAccount}>
                Radera konto
            </button>
        </div>
    );
}

export default Profile;
