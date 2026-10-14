import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Login() {
    const navigate = useNavigate();

    const { login, loading: authLoading} = useAuth();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const cleanPhone = phone.trim();

        if (!cleanPhone) {
            setError("Veuillez entrer votre numéro de téléphone.");
            return;
        }

        if (!password) {
            setError("Veuillez entrer votre mot de passe.");
            return;
        }

        try {
            setIsSubmitting(true);

            const result = await login(cleanPhone, password);

            if (!result.success) {
                setError(result.message);
                return;
            }

            // Redirect after successful login
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
};

const isLoading = authLoading || isSubmitting;

return (
    <div className="login-container">
        <div className="login-card">
            <h1>Connexion</h1>

            <p className="login-subtitle">
                Connectez-vous à votre compte Niger Marketplace.
            </p>

            {error && (
                <div className="login-error" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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
                        onChange={(event) => setPhone(event.target.value)}
                        autComplete="tel"
                        required
                        disabled={isLoading}
                        />
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        Mot de passe
                    </label>

                    <input
                         id="pasword"
                         type="password"
                         name="password"
                         placeholder="Votre mot de passe"
                         value={password}
                         onChange={(event) => setPassword(event.target.value)}
                         autoComplete="current-password"
                         required
                         disabled={isLoading}
                    />
                       
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Connexion..." : "Se connecter"}
                </button>
            </form>

            <p className="register-link">
                Vous n'avez pas encore de compte ?{""}
                <button
                    type="button"
                    onClick={() => navigate("/reigister")}
                    disabled={isLoading}
                >
                    Créer un compte
                </button>
            </p>
        </div>
    </div>
);
}
export default Login;