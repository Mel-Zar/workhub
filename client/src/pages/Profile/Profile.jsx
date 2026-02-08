import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { authService } from "../../services/authService";

function capitalizeFirst(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

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

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    const [loading, setLoading] = useState(false);

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
                                    name: capitalizeFirst(name),
                                    email: capitalizeFirst(email),
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
                <input
                    value={name}
                    onChange={e => setName(capitalizeFirst(e.target.value))}
                    placeholder="Namn"
                />
                <input
                    value={email}
                    onChange={e => setEmail(capitalizeFirst(e.target.value))}
                    placeholder="Email"
                />

                <h4>Byt lösenord</h4>
                <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nytt lösenord"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <label style={{ display: "block", marginBottom: 10 }}>
                    <input
                        type="checkbox"
                        checked={showNewPassword}
                        onChange={() => setShowNewPassword(!showNewPassword)}
                    />{" "}
                    Visa lösenord
                </label>

                <h4>Bekräfta identitet</h4>
                <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Nuvarande lösenord"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                />
                <label style={{ display: "block", marginBottom: 10 }}>
                    <input
                        type="checkbox"
                        checked={showCurrentPassword}
                        onChange={() => setShowCurrentPassword(!showCurrentPassword)}
                    />{" "}
                    Visa lösenord
                </label>

                <button disabled={!hasChanges || loading}>
                    {loading ? "Sparar..." : "Spara"}
                </button>
            </form>

            <hr />

            <h4>Farlig zon</h4>
            <input
                type={showDeletePassword ? "text" : "password"}
                placeholder="Bekräfta lösenord för radering"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
            />
            <label style={{ display: "block", marginBottom: 10 }}>
                <input
                    type="checkbox"
                    checked={showDeletePassword}
                    onChange={() => setShowDeletePassword(!showDeletePassword)}
                />{" "}
                Visa lösenord
            </label>

            <button type="button" disabled={loading} onClick={handleDeleteAccount}>
                Radera konto
            </button>
        </div>
    );
}

export default Profile;
