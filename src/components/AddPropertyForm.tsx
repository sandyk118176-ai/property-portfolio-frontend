import { useState } from "react";
import type { FormEvent } from "react";
import { createProperty } from "../api/propertyApi";
import type { Property } from "../types";

interface AddPropertyFormProps {
    onPropertyAdded: (property: Property) => void;
}

const AddPropertyForm = ({ onPropertyAdded }: AddPropertyFormProps) => {
    const [address, setAddress] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [monthlyExpenses, setMonthlyExpenses] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const newProperty = await createProperty({
                address,
                purchasePrice: Number(purchasePrice),
                monthlyExpenses: Number(monthlyExpenses),
            });

            onPropertyAdded(newProperty);

            // Reset the form
            setAddress("");
            setPurchasePrice("");
            setMonthlyExpenses("");
        } catch (err) {
            setError("Failed to create property. Please check your inputs.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit = {handleSubmit}>
            <h3>Add a Property</h3>
            <div>
                <label htmlFor="address">Address</label>
                <input
                  id = "address"
                  type = "text"
                  value = {address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
            </div>

            <div>
                <label htmlFor="purchasePrice">Purchase Price</label>
                <input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                  min="0"
                />
            </div>

            <div>
                <label htmlFor="monthlyExpenses">Monthly Expenses</label>
                <input
                  id = "monthlyExpenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  required
                  min="0"
                />
            </div>

            {error && <p style={{ color: "red"}}>{error}</p>}

            <button type= "submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Property"}
            </button>
        </form>    
    );
};

export default AddPropertyForm;