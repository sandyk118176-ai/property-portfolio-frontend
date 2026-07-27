import UnitList from "./UnitList";
import { useEffect, useState } from "react";
import type { Property } from "../types";
import { getAllProperties } from "../api/propertyApi";
import AddPropertyForm from "./AddPropertyForm";

const PropertyList = () => { 
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <p>Loading properties...</p>

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
                            <strong>{property.address}</strong> - Purchase Price: $
                            {property.purchasePrice.toLocaleString()} - Monthly Expenses: $
                            {property.monthlyExpenses.toLocaleString()}
                            <UnitList propertyId={property.id} />
                        </li>
                    ))}
                </ul>    
            )}
        </div>
    );
};

export default PropertyList;