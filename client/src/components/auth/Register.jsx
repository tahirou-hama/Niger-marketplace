import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("customer");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        // Basic validation
        if (!cleanName) {
            setError(
                "Veuillez entrer votre nom ou le nom de votre entreprise."
            );
            return;
        }

        if (!cleanPhone) {
            setError("Veuillez entrer votre numéro de téléphone.");
            return;
        }

        if (password.length < 8) {
            setError(
                "Le mot de passe doit contenir au moins 8 caractères."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setIsSubmitting(true);

            const result = await register({
                name: cleanName,
                phone: cleanPhone,
                password,
                role,
            });

            if (!result.success) {
                setError(result.message);
                return;
            }

            setSuccess(
                "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."
            );

            // Clear form
            setName("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");
            setRole("customer");

            // If registration does NOT automatically log the user in,
            // send them to the login page.
            if (!result.user) {
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        } catch (error) {
            console.error("Registration error:", error);

            setError(
                "Une erreur est survenue pendant la création du compte."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Créer un compte</h1>

                <p className="register-subtitle">
                    Rejoignez Niger Marketplace.
                </p>

                {error && (
                    <div className="register-error" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="register-success" role="status">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">
                            Nom complet / Nom de l'entreprise
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Ex: Hama Electronics"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            autoComplete="name"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label htmlFor="phone">
                            Numéro de téléphone
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="+227 90 00 00 00"
                            value={phone}
                            onChange={(event) =>
                                setPhone(event.target.value)
                            }
                            autoComplete="tel"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">
                            Mot de passe
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Minimum 8 caractères"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Confirm password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirmer le mot de passe
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmez votre mot de passe"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Role */}
                    <div className="form-group">
                        <label htmlFor="role">
                            Type de profil
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value)
                            }
                            disabled={isSubmitting}
                        >
                            <option value="customer">
                                Acheteur (Client)
                            </option>

                            <option value="seller">
                                Vendeur (Boutiquier)
                            </option>

                            <option value="driver">
                                Livreur (Coursier)
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Création du compte..."
                            : "S'inscrire"}
                    </button>
                </form>

                <p className="login-link">
                    Vous avez déjà un compte?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        disabled={isSubmitting}
                    >
                        Se connecter
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;