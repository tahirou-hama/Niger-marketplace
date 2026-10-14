import { useEffect, useState } from "react";

const MOCK_VENDOR_DATA = {
    analytics: {
        shop_name: "Hama Electronics",
        total_revenue_fcfa: 485000,
        total_items_sold: 37,
        top_selling_products: [
            {
                id: 1,
                title: "Adaptateur intelligent 140W",
                units_sold: 15,
            },
            {
                id: 2,
                title: "Câble USB-C Fast Charge",
                units_sold: 10,
            },
            {
                id:3,
                title: "Écouteurs Bluetooth",
                units_sold: 7,
            },
            {
                id:4,
                title: "Chargeur voiture",
                units_sold: 5,
            },
        ],
        
    },

    balance: 125000,
};

const formatFCFA = (amount) => {
    return `${new Intl.NumberFormat("fr-FR").format(
        amount
    )}FCFA`;
};

function VendorDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [balance, setBalance] = useState(0);

    const [withdrawAmount, setWithdrawAmount] = useState("");

    const [loading, setLoading] = useState(true);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadVendorData = async () => {
            try {
                setError("");

                // Simulation du chargement des données.
                await new Promise((resolve) =>
                setTimeout(resolve, 800)
            );

            setAnalytics(
                MOCK_VENDOR_DATA.analytics
            );

            setBalance(
                MOCK_VENDOR_DATA.balance
            );

            } catch (error) {
                console.error(
                    "Vendor dashboard error:",
                    error
                );

                setError(
                     "Impossible de charger les données de votre boutique."
                );
            } finally {
                setLoading(false);
            }
        };

        loadVendorData();
    }, []);

    const handleWithdraw = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const amount = Number(withdrawAmount);

        if (!Number.isFinite(amount) || amount <= 0) {
            setError(
                "Veuillez saisir un montant de retrait valide."
            );
            return;
        }

        if (amount > balance) {
            setError(
                "Le montant demandé dépasse votre solde disponible."
            );
            return;
        }

        try {
            setIsWithdrawing(true);

            // simulation de la demande de retrait.
            await new Promise((resolve) =>
            setTimeout(resolve,1000)
        );

        setBalance(
            (currentBalance) =>
                currentBalance - amount
        );

        setWithdrawAmount("");

        setSuccess(
            `Votre demande de retrait de ${formatFCFA(
                amount
            )} a été enregistrée avec succès.`
        );
        } catch (error) {
            console.error(
                "Withdrawal error:",
                error
            );

            setError(
                "Une erreur est survenue lors de la demande de retrait."
            );
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (loading) {
        return (
            <div className="vendor-dashBoard-loading">
                <p>
                    Chargement de votre espace vendeur...
                </p>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="vendor-dashboard-container">
                <div className="vendor-bashboard-card">
                    <div
                        className="vendor-dashboard-error"
                        role="alert"
                    >
                        {error ||
                            "Impossible de charger votre espace venduer."
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="vendor-dashboard-container">
            <div className="vendor-dashboard-card">
                <header classname="vendor-dashboard-header">
                    <div>
                        <p className="dashboard-label">
                            ESPACE VENDEUR
                        </p>

                        <h1>
                            {analytics.shop_name}
                        </h1>

                        <p>
                            Gérez votre activité, vos
                            revenus et vos retraits.
                        </p>
                    </div>
                </header>

                {error && (
                    <div 
                        className="vendor-dashboard-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="vendor-dashboard-success"
                        role="status"
                    >
                        {success}
                    </div>
                )}

                {/* Statistiques principales */}
                <section className="vendor-stats">
                    <div classname="vendor-stat-card">
                        <span className="stat-label">
                            Solde retirable
                        </span>

                        <strong className="stat-value">
                            {formatFCFA(balance)}
                        </strong>
                    </div>

                    <div className="vendor-stat-card">
                        <span className="stat-label">
                            Articles vendus
                        </span>

                        <strong className="stat-value">
                            {
                                analytics.total_items_sold
                            }
                        </strong>
                    </div>
                </section>

                {/* Zone principale */}
                <section className="vendor-dashboard-grid">
                    {/* Retrait */}
                    <div className="vendor-panel">
                        <div className="vendor-panel-header">
                            <h2>
                                Demander un retrait
                            </h2>

                            <p>
                                L'argent sera envoyé vers
                                votre numéro Mobile Money
                                configuré.
                            </p>
                        </div>

                        <form
                            onSubmit={handleWithdraw}
                            className="withdraw-form"
                        >
                            <div className="form-group">
                                <label htmlFor="withdrawAmount">
                                    Montant à retirer
                                </label>

                                <input
                                    id="withdrawAmount"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="EX: 5000"
                                    value={
                                        withdrawAmount
                                    }
                                    onChange={(event) =>
                                        setWithdrawAmount(
                                            event.target 
                                            .value
                                        )
                                    }
                                    disabled={
                                        isWithdrawing
                                    }
                                    required
                                />

                                <small>
                                    Solde disponible :{""}
                                    {formatFCFA(
                                        balance
                                    )}
                                </small>
                            </div>

                            <button
                                type="submit"
                                className="withdraw-button"
                                disabled={
                                    isWithdrawing ||
                                    balance <= 0
                                }
                            >
                                {isWithdrawing
                                    ? "traitement..."
                                    : "Retirer via Mobile Money"}
                            </button>
                        </form>
                    </div>

                    {/* Produits les plus vendus */}
                    <div className="vendor-panel">
                        <div className="vendor-panel-header">
                            <h2>
                                Articles les plus vendus
                            </h2>

                            <p>
                                 Les produits qui génèrent
                                le plus de ventes.
                            </p>
                        </div>

                        { analytics
                            .top_selling_products
                            ?.length === 0 ? (
                                <div className="empty-products">
                                    <p>
                                        Aucune vente enregistrée
                                        pour le moment.
                                    </p>
                                </div>

                            ) : (
                                <ul className="top-products-list">
                                    {analytics.top_selling_products.map(
                                        (product) => (
                                            <li
                                                key={
                                                    product.id
                                                }
                                                className="top-product-item">
                                                    <div>
                                                        <strong>
                                                            {
                                                                product.title
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                product.units_sold
                                                            }{""}
                                                            unités
                                                            vendues
                                                        </span>
                                                    </div>

                                                    <span className="product-rank">
                                                        #
                                                        {analytics.top_selling_products.indexOf(
                                                            product
                                                        ) + 1}
                                                    </span>
                                                </li>
                                        )
                                    )}
                                </ul>
                            )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default VendorDashboard;