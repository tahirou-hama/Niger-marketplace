import {
     useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import API from "../services/api";

import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --------------------------------------------------
    // Restore authentication when the application starts
    // --------------------------------------------------
    const restoreSession = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            // No stored authentication information
            if (!storedToken || !storedUser) {
                setUser(null);
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Invalid stored user data:", error);

                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Run once when the application starts
    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    // -------------------------------------------
    // Login
    // -------------------------------------------
    const login = useCallback(async(phone, password) => {
        try {
            const response = await API.post("/auth/login", {
                phone,
                password,
            });

            const {token, user: userData} = response.data;

            if (!token || !userData) {
                return {
                    success: false,
                    message: "Réponse d'authentification invalide.",
                };
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            setUser(userData);

            return {
                success: true,
                user: userData,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Échec de la connexion. Veuillez réessayer."
            };
        }
    }, []);

    // ----------------------------------------------------------
    // Register
    // ----------------------------------------------------------
    const register = useCallback(async(userData) => {
        try {
            const response = await API.post("/auth/register", userData)

            const { token, user: newUser} = response.data;

            // If the backend logs the user in immediately
            if (token && newUser) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(newUser));

                setUser(newUser);
            }

            return {
                success: true,
                user: newUser || null,
                message: response.data.message,
            };
        } catch (error) {
            return{
                success: false,
                message:
                    error.response?.data?.message ||
                    "Échec de l'inscription. Veuillez réessayer.",
            };
        }
    }, []);

    // ------------------------------------------------
    // Get current user from backend
    // ------------------------------------------------
    const refreshUser = useCallback(async () => {
        try {
            const response = await API.get("/auth/me");

            const currentUser = response.data.user;

            if (!currentUser) {
                throw new Error("Utilisateur introuvable.");
            }

            localStorage.setItem("user", JSON.stringify(currentUser));
            setUser(currentUser);

            return {
                success: true,
                user: currentUser,
            };
        } catch (error) {
            // Authentication is no longer valid
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Session expirée. Veuillez vous reconnecter.",
            };
        }

    }, []);

    // ---------------------------------------------
    //Logout
    // ---------------------------------------------
    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    }, []);

    // ----------------------------------------
    // Authentication status
    // ----------------------------------------
    const isAuthenticated = Boolean(user);

    // -----------------------------------
    // Context value
    // -----------------------------------
    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            refreshUser,
        }),
        [
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            refreshUser,
        ]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};