import { useEffect, useState } from "react";
import type { Tenant } from "../types";
import { getAllTenants, createTenant, deleteTenant } from "../api/tenantApi";

interface TenantSectionProps {
    unitId: number;
    occupied: boolean;
}

const TenantSection = ({ unitId, occupied }: TenantSectionProps) => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [leaseStart, setLeaseStart] = useState("");
    const [leaseEnd, setLeaseEnd] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const allTenants = await getAllTenants();
                const match = allTenants.find((t) => t.unit?.id === unitId);
                setTenant(match ?? null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTenant();
    }, [unitId]);

    const handleAddTenant = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const newTenant = await createTenant(unitId, {
              name,
              leaseStart,
              leaseEnd,
            });
            setTenant(newTenant);
            setName("");
            setLeaseStart("");
            setLeaseEnd("");
        } catch (err) {
            setError("Failed to add Tenant.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTenant = async () => {
        if (!tenant) return;

        if(!window.confirm(`Move out ${tenant.name}?`)) {
            return;
        }

        try {
            await deleteTenant(tenant.id);
            setTenant(null);
        } catch (err) {
            console.error(err);
            alert("Failed to remove tenant.");
            }
    };


    if (loading) return <p>Loading Tenant info...</p>

    return (
        <div style={{ marginLeft: "20px", marginTop: "5px" }}>
            {tenant ? (
                <p>
                    Tenant: <strong>{tenant.name}</strong> ({tenant.leaseStart} to{" "}
                    {tenant.leaseEnd}) {" "}
                    <button onClick={handleDeleteTenant}>Move Out</button>
                </p>    
            ) : occupied ? (
                <p>Marked occupied, but no tenant record found.</p>
            ) : (
                <form onSubmit={handleAddTenant}>
                    <input
                      type="text"
                      placeholder="Tenant name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      type="date"
                      value={leaseStart}
                      onChange={(e) => setLeaseStart(e.target.value)}
                      required
                    />
                    <input
                       type="date"
                       value={leaseEnd}
                       onChange={(e) => setLeaseEnd(e.target.value)}
                       required
                    />
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Adding..." : "Move In Tenant"}
                    </button>
                    {error && <p style={{ color: "red"}}>{error}</p>}
                </form>
            )}
        </div>
    );
};

export default TenantSection;