import UnitList from "./UnitList";
import { useEffect, useState } from "react";
import type { Property } from "../types";
import { getAllProperties, deleteProperty, updateProperty } from "../api/propertyApi";
import AddPropertyForm from "./AddPropertyForm";


const PropertyList = () => { 
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editAddress, setEditAddress] = useState("");
    const [editPurchasePrice, setEditPurchasePrice] = useState("");
    const [editMonthlyExpenses, setEditMonthlyExpenses] = useState("");
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await getAllProperties();
                setProperties(data);
            } catch (err) {
                setError("Failed to laod properties. Is the backend running?");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handlePropertyAdded = (newProperty: Property) => {
        setProperties((prevProperties) => [...prevProperties, newProperty]);
    };

    const handleDeleteProperty = async (id: number) => {
        if (!window.confirm("Delete this property and all its units/tenant?")) {
            return;
        }

        try {
            await deleteProperty(id);
            setProperties((prev) => prev.filter((property) => property.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete property.");
        }
    };

    const startEditing = (property: Property) => {
        setEditingId(property.id);
        setEditAddress(property.address);
        setEditPurchasePrice(String(property.purchasePrice));
        setEditMonthlyExpenses(String(property.monthlyExpenses));
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const saveEdit = async (id: number) => {
        try {
            const updated = await updateProperty(id, {
                address: editAddress,
                purchasePrice: Number(editPurchasePrice),
                monthlyExpenses: Number(editMonthlyExpenses),
            });
            setProperties((prev) => 
               prev.map((property) => (property.id === id ? updated : property))
            );
            setEditingId(null);
        } catch (err) {
            console.error(err);
                alert("Failed to update property.");

            }
        };
    

    if (loading) 
        return (
           <p>Loading properties... (if this is your first visit in a while, the
            server may take up to a minute to wake up)
           </p>

    ); 
    return (
        <div>
            <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
            
            <h2>Properties</h2>
            {error && <p style={{ color: "red"}}>{error}</p>}
            {properties.length === 0 ? (
                <p>No Properties yet.</p>
            ) : (
                <ul>
                    {properties.map((property) => (
                        <li key={property.id}>
                            {editingId === property.id ? (
                                <div>
                                    <input 
                                       type= "text"
                                       value={editAddress}
                                       onChange={(e) => setEditAddress(e.target.value)}
                                    />
                                    <input 
                                       type="number"
                                       value={editPurchasePrice}
                                       onChange={(e) => setEditPurchasePrice(e.target.value)}
                                    />
                                    <input
                                       type="number"
                                       value={editMonthlyExpenses}
                                       onChange={(e) => setEditMonthlyExpenses(e.target.value)}
                                    />
                                    <button onClick={() => saveEdit(property.id)}>Save</button>
                                    <button onClick={cancelEditing}>Cancel</button>
                                </div>
                            ) : (
                                <div style={{display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <span>
                                        <strong>{property.address}</strong> - Purchase Price: $
                                        {property.purchasePrice.toLocaleString()} - Monthly Expenses: $
                                        {property.monthlyExpenses.toLocaleString()}
                                    </span>
                                    <div>
                                        <button onClick={() => startEditing(property)}>Edit</button>
                                        <button onClick={() => handleDeleteProperty(property.id)}>Delete</button>
                                    </div>
                                </div>
                            )}
                            <UnitList propertyId={property.id} />
                        </li>
                    ))}
                </ul>    
            )}
        </div>
    );
};

export default PropertyList;