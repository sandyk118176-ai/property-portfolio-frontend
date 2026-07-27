import { useEffect, useState } from "react";
import type { Unit } from "../types";
import { getAllUnits, createUnit } from "../api/unitApi";
import TenantSection from "./TenantSection";

interface UnitListProps {
    propertyId: number;
}

const UnitList = ({ propertyId }: UnitListProps) => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [unitNumber, setUnitNumber] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const allUnits = await getAllUnits();
                // Only show units belongings to this property
                const filtered = allUnits.filter(
                    (unit) => unit.property?.id === propertyId
                );
                setUnits(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUnits();
    }, [propertyId]);

    const handleAddUnit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const newUnit = await createUnit(propertyId, {
                unitNumber,
                monthlyRent: Number(monthlyRent),
                occupied: false,
            });
            setUnits((prev) => [...prev, newUnit]);
            setUnitNumber("");
            setMonthlyRent("");
        } catch (err) {
            setError("Failed to add unit.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading units...</p>

    return (
        <div style={{marginLeft: "20px", borderLeft: "2px solid #ccc", paddingLeft: "15px"}}>
            <h4>Units</h4>
            
            {units.length === 0 ? (
                <p>No units yet.</p>
            ) : (
                <ul>
                    {units.map((unit) => (
                        <li key={unit.id}>
                            <strong>{unit.unitNumber}</strong> - Rent: $
                            {unit.monthlyRent.toLocaleString()} -{" "}
                            {unit.occupied ? "Occupied" : "Vacant"}
                            <TenantSection unitId={unit.id} occupied={unit.occupied} />
                        </li>
                    ))}
                </ul>
            )}
            
            <form onSubmit={handleAddUnit}>
                <input 
                   type="text"
                   placeholder="Unit number"
                   value={unitNumber}
                   onChange={(e) => setUnitNumber(e.target.value)}
                   required
                />
                
                <input
                  type="number"
                  placeholder="Monthly rent"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  required
                  min = "0"
                />
                
                <button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add Unit"}
                </button>
                {error && <p style={{ color: "red"}}>{error}</p>}
            </form>
        </div>
    );
};

export default UnitList;