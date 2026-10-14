import { useEffect, useState } from "react";

const STATUS_CONFIG = {
    pending: {
        label: "En attente de traitement",
    },
    preparing: {
        label: "En cours de préparation",
    },
    ready: {
        label: "Prêt chez le vendeur",
    },
    delivered: {
        label: "Colis livré",
    };

    const MOCK_ORDERS = [
        {
            id: 1001,
            createdAt: "2026-09-20T10:30:00",
            payment_status: "paid",
            delivery_address: "Yantala, Niamey - Face pharmacie",
            total_amount: 32500,
            delivery_fee: 1000,
            items: [
                {
                    id: 1,
                    title: "Adaptateur intelligent 140W",
                    quantity: 1,
                    item_status: "preparing",
                },
                {
                    id: 2,
                    title: "Câble USB-C",
                    quantity: 2,
                    item_status: "ready",
                },
            ],
        },
        {
            id: 1002,
            createdAt: "2026-09-18T14:15:00",
            payment_status: "pending",
            delivery_address: "Plateau, Niamey",
            total_amount: 18500,
            delivery_fee: 1500,
            items: [
                {
                    id: 3,
                    title: "Écouteurs Bluetooth",
                    quantity: 1,
                    item_status: "delivered",
                },
            ],
        },
    ];

    const formatFCFA = (amount) => {
        return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(date));
    };

    function OrderTracking() {
        const [orders, setOrders] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            // Simulation du chargement des commandes.
        // L'API sera connectée pendant la phase backend.
        const loadOrders = async () => {
            await new Promise((resolve) =>
            setTimeout(resolve, 800)
        );

        setOrders(MOCK_ORDERS);
        setLoading(false);
        };
        
        loadOrders();
        }, []);

        if(loading) {
            return (
                <div className="order-tracking-container">
                    <div className="order-tracking-card">
                        <h1>Mes achats & suivi</h1>

                        <p className="order-tracking-subtitle">
                            Consultez vos commands et leur état de livraison.
                        </p>

                        {orders.length === 0 ? (
                            <div className="empty-orders">
                                <h2> Aucune commande</h2>

                                <p>
                                    Vous n'avez pas encore passé de commande
                                    sur Niger Marketplace.
                                </p>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div 
                                        className="order-card"
                                        key={order.id}
                                    >
                                        {/* Order header */}
                                        <div className="order-header">
                                            <div>
                                                <h2>
                                                     Commande N°
                                                     {order.id}
                                                </h2>

                                                <p>
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </p>
                                            </div>

                                            <span
                                                className={`payment-status ${
                                                    order.payment_status ===
                                                    "paid"
                                                        ? "paid"
                                                        : "pending"
                                                }`}
                                            >
                                                {order.payment_status ===}
                                            </span>
                                        </div>
                                )}
                        )}
                    </div>
                </div>
            )
        }
    }
}