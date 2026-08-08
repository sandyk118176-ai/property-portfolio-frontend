import { useEffect, useState } from "react";
import type { PortfolioSummary } from "../types";
import { getPortfolioSummary } from "../api/summaryApi";
import { Building2, DoorOpen, TrendingUp, DollarSign } from "lucide-react";

const PortfolioSummaryCards = () => {
    const [summary, setSummary] = useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getPortfolioSummary();
                setSummary(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading || !summary) return null;

    const cards = [
        {
            label: "Properties",
            value: summary.totalProperties,
            icon: <Building2 size={20} />,
        },
        {
            label: "Units",
            value: summary.totalUnits,
            icon: <DoorOpen size={20} />,
        },
        {
            label: "Occupancy Rate",
            value: `${summary.occupancyRate.toFixed(1)}%`,
            icon: <TrendingUp size={20} />,
        },
        {
            label: "Monthly Revenue",
            value: `$${summary.totalMonthlyRent.toLocaleString()}`,
            icon: <DollarSign size={20} />,
        },
    ];
    return (
        <div className="summary-cards">
            {cards.map((card) => (
                <div className="summary-card" key={card.label}>
                    <div className="summary-card-icon">{card.icon}</div>
                    <div>
                        <p className="summary-card-value">{card.value}</p>
                        <p className="summary-card-label">{card.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PortfolioSummaryCards;