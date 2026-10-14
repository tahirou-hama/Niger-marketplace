import { useState } from "react";

const NIAMEY_DELIVERY_FEES = {
    Yantala: 1000,
    Plateau: 1500,
    Koubia: 1200,
    "Grand Marche": 1000,
    "Bord de Eau": 1500,
};

const formatFCFA = (amount) => {
    return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
};

function Cart({ cartItems = [], onClearCart }) {
    const [neighborhood, setNeighborhood] = useState("Yantala");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] =
        useState("cash_on_delivery");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Calculate products total
    const productsTotal = cartItems.reduce(
        (total, item) =>
            total + Number(item.price_fcfa) * Number(item.quantity),
        0
    );

    // Calculate delivery fee
    const deliveryFee =
        cartItems.length > 0
            ? NIAMEY_DELIVERY_FEES[neighborhood] || 1000
            : 0;

    // Calculate final total
    const grandTotal = productsTotal + deliveryFee;

    const handleCheckout = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (cartItems.length === 0) {
            setError("Votre panier est vide.");
            return;
        }

        if (!deliveryAddress.trim()) {
            setError("Veuillez préciser votre adresse de livraison.");
            return;
        }

        try {
            setLoading(true);

            // Frontend simulation for now.
            // Backend/API integration will be added later.

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            setSuccess(
                "Votre commande a été préparée avec succès !"
            );

            onClearCart();
            setDeliveryAddress("");
        } catch (error) {
            console.error("Checkout error:", error);

            setError(
                "Une erreur est survenue lors de la validation de votre commande."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cart-container">
            <div className="cart-card">

                <h1>Mon panier</h1>

                <p className="cart-subtitle">
                    Vérifiez vos articles avant de passer la commande.
                </p>

                {/* Messages */}
                {error && (
                    <div className="cart-error" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="cart-success" role="status">
                        {success}
                    </div>
                )}

                {/* Empty cart */}
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Votre panier est vide</h2>

                        <p>
                            Ajoutez des produits à votre panier
                            pour commencer vos achats.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Cart items */}
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div
                                    className="cart-item"
                                    key={item.id}
                                >
                                    <div className="cart-item-info">
                                        <h3>{item.title}</h3>

                                        <p>
                                            Prix unitaire :{" "}
                                            {formatFCFA(
                                                item.price_fcfa
                                            )}
                                        </p>
                                    </div>

                                    <div className="cart-item-quantity">
                                        <span>
                                            Quantité :{" "}
                                            {item.quantity}
                                        </span>
                                    </div>

                                    <strong>
                                        {formatFCFA(
                                            item.price_fcfa *
                                                item.quantity
                                        )}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        {/* Checkout */}
                        <form
                            onSubmit={handleCheckout}
                            className="checkout-form"
                        >
                            {/* Neighborhood */}
                            <div className="form-group">
                                <label htmlFor="neighborhood">
                                    Quartier de livraison
                                </label>

                                <select
                                    id="neighborhood"
                                    value={neighborhood}
                                    onChange={(event) =>
                                        setNeighborhood(
                                            event.target.value
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {Object.keys(
                                        NIAMEY_DELIVERY_FEES
                                    ).map((neighborhoodName) => (
                                        <option
                                            key={neighborhoodName}
                                            value={neighborhoodName}
                                        >
                                            {neighborhoodName} (
                                            +
                                            {formatFCFA(
                                                NIAMEY_DELIVERY_FEES[
                                                    neighborhoodName
                                                ]
                                            )}
                                            )
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Delivery address */}
                            <div className="form-group">
                                <label htmlFor="deliveryAddress">
                                    Précisions pour la livraison
                                </label>

                                <input
                                    id="deliveryAddress"
                                    type="text"
                                    placeholder="Ex : Face pharmacie, portail bleu"
                                    value={deliveryAddress}
                                    onChange={(event) =>
                                        setDeliveryAddress(
                                            event.target.value
                                        )
                                    }
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Payment method */}
                            <div className="form-group">
                                <label htmlFor="paymentMethod">
                                    Mode de paiement
                                </label>

                                <select
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                    disabled={loading}
                                >
                                    <option value="cash_on_delivery">
                                        Paiement à la livraison
                                        (Cash)
                                    </option>

                                    <option value="mobile_money">
                                        Mobile Money
                                    </option>
                                </select>
                            </div>

                            {/* Order summary */}
                            <div className="cart-summary">
                                <div>
                                    <span>
                                        Sous-total articles
                                    </span>

                                    <strong>
                                        {formatFCFA(
                                            productsTotal
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Frais de livraison
                                    </span>

                                    <strong>
                                        {formatFCFA(
                                            deliveryFee
                                        )}
                                    </strong>
                                </div>

                                <div className="cart-total">
                                    <span>Total</span>

                                    <strong>
                                        {formatFCFA(
                                            grandTotal
                                        )}
                                    </strong>
                                </div>
                            </div>

                            {/* Checkout button */}
                            <button
                                type="submit"
                                className="checkout-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Traitement..."
                                    : "Confirmer la commande"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;