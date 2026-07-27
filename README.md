# Property Portfolio Tracker — Frontend

A React + TypeScript frontend for tracking rental properties, units, and tenants — built to consume the [Property Portfolio Tracker API](https://github.com/sandyk118176-ai/property-portfolio-api), a Spring Boot backend.

## Overview

This app lets a landlord manage a property portfolio: add properties, add units under each property, and move tenants into units. It mirrors the backend's data model exactly, with nested UI components reflecting the same relationships enforced in the Spring Boot API.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool and dev server)
- **Axios** (HTTP client)
- **Lucide React** (icons)
- **CSS custom properties** for theming (light/dark mode)

## Features

- View all properties, with nested units and tenants
- Add a new property
- Add a new unit under a specific property
- Move a tenant into a vacant unit (automatically reflects the backend's occupancy business logic)
- Light/dark mode toggle

## Project Structure
## Data Flow
Each component fetches and manages only the data relevant to it, receiving the parent's ID as a prop (e.g., `UnitList` receives `propertyId`, `TenantSection` receives `unitId`) — mirroring the nested REST endpoints on the backend (`/api/properties/{propertyId}/units`, `/api/units/{unitId}/tenants`).

## Running Locally

**Prerequisites:**
- Node.js
- The [backend API](https://github.com/sandyk118176-ai/property-portfolio-api) running locally on `http://localhost:8080`

```bash
# Clone the repo
git clone https://github.com/sandyk118176-ai/property-portfolio-frontend.git
cd property-portfolio-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Known Limitations / Future Improvements

- Units are fetched for all properties and filtered client-side; a backend endpoint like `GET /api/properties/{id}/units` would scale better with a large number of units.
- No edit/delete UI yet — only create and view are implemented.
- No client-side routing; everything renders on a single page.