export interface Property {
    id: number;
    address: string;
    purchasePrice: number;
    monthlyExpenses: number;
}

export interface Unit {
    id: number;
    unitNumber: string;
    monthlyRent: number;
    occupied: boolean;
    property?: Property;
}

export interface Tenant {
    id: number;
    name: string;
    leaseStart: string;
    leaseEnd: string;
    unit?: Unit;
}

export interface PortfolioSummary {
    totalProperties: number;
    totalUnits: number;
    occupiedUnits: number;
    occupancyRate: number;
    totalMonthlyRent: number;
}