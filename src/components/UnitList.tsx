import { useEffect, useState } from "react";
import type { Unit } from "../types";
import { getAllUnits, createUnit, deleteUnit, updateUnit } from "../api/unitApi";
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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editUnitNumber, setEditUnitNumber] = useState("");
    const [editMonthlyRent, setEditMonthlyRent] = useState("");

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

    const handleDeleteUnit = async (id: number) => {
        if (!window.confirm("Delete this unit and its tenant record?")) {
            return;
        }

        try {
            await deleteUnit(id);
            setUnits((prev) => prev.filter((unit) => unit.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete unit.");
        }
    };
    
    const startEditing = (unit : Unit) => {
        setEditingId(unit.id);
        setEditUnitNumber(unit.unitNumber);
        setEditMonthlyRent(String(unit.monthlyRent));
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const saveEdit = async (id: number, occupied: boolean) => {
        try {
            const updated = await updateUnit(id, {
                unitNumber: editUnitNumber, 
                monthlyRent: Number (editMonthlyRent),
                occupied,
            });
            setUnits((prev) => prev.map((unit) => (unit.id === id ? updated : unit)));
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update unit.");
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
                            {editingId === unit.id ? (
                                <div>
                                    <input 
                                       type="text"
                                       value={editUnitNumber}
                                       onChange={(e) => setEditUnitNumber(e.target.value)}
                                    />
                                    <input 
                                      type="number"
                                      value={editMonthlyRent}
                                      onChange={(e) => setEditMonthlyRent(e.target.value)}
                                    />
                                    <button onClick={() => saveEdit(unit.id, unit.occupied)}>Save</button>
                                    <button onClick={cancelEditing}>Cancel</button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <span>
                                    <strong>{unit.unitNumber}</strong> - Rent: $
                                    {unit.monthlyRent.toLocaleString()} - {" "}
                                    {unit.occupied ? "Occupied" : "Vacant"}                                
                                </span>
                                <div>
                                    <button onClick={() => startEditing(unit)}>Edit</button>
                                    <button onClick={() => handleDeleteUnit(unit.id)}>Delete</button>
                                </div>
                               </div>
                            )}
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