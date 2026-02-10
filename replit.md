# S.I.G.A - Sistema Integrado de Gestão Amazônica

## Overview
S.I.G.A is a full-stack web application for credit analysis, guarantee monitoring, and management of rural and corporate projects. Built with Express + Vite + React.

## Recent Changes
- 2026-02-10: Project imported into Replit environment, dependencies installed, workflow configured.

## User Preferences
- Language: Portuguese (Brazil)

## Project Architecture

### Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Routing**: wouter (frontend), Express (backend)
- **State Management**: TanStack React Query v5
- **Styling**: TailwindCSS + shadcn/ui
- **Additional Libraries**: Leaflet (maps), Recharts (charts), Framer Motion (animations), react-hook-form

### Directory Structure
- `client/src/pages/` - Application pages (Login, Dashboard, Pipeline, Proposals, etc.)
- `client/src/components/` - Reusable UI components
- `server/` - Express backend (index.ts, app.ts, routes.ts, storage.ts, vite.ts)
- `shared/` - Shared schema definitions (schema.ts)

### Key Commands
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes

### Notes
- No database is currently provisioned (storage is in-memory)
- The app uses Passport.js for authentication
- Frontend pages are in JSX format
