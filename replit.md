# S.I.G.A - Sistema Integrado de Gestão Amazônica

## Overview
S.I.G.A is a full-stack web application for credit analysis, guarantee monitoring, and management of rural and corporate projects for a Brazilian bank. Built with Express + Vite + React with PostgreSQL database persistence.

## Recent Changes
- 2026-02-10: Full database schema implemented (8 tables: users, pfDetails, pjDetails, proposals, proposalDocuments, creditAnalysis, auditTrail, guarantees)
- 2026-02-10: Authentication system with Passport.js, bcrypt password hashing, session management via connect-pg-simple
- 2026-02-10: Multi-step registration page with CPF (Pessoa Física) and CNPJ (Pessoa Jurídica) flows
- 2026-02-10: All frontend components migrated from localStorage/mock data to real API calls via @tanstack/react-query
- 2026-02-10: XCurve integration structure prepared (server/xcurve.ts) - requires XCURVE_API_URL and XCURVE_API_KEY env vars
- 2026-02-10: Removed all references to LexisNexis, Neurotech, Prognum integrations
- 2026-02-10: Guarantees marked as optional throughout the UI

## User Preferences
- Language: Portuguese (Brazil) - all UI text in Portuguese
- No emojis in the UI - use lucide-react icons instead
- Guarantees (Prognum) are optional - only displayed when data exists
- Only XCurve integration for credit decisioning
- Future migration to Oracle OCI planned (Drizzle ORM facilitates this)

## Project Architecture

### Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon-backed via Replit)
- **ORM**: Drizzle ORM with drizzle-zod for validation
- **Auth**: Passport.js local strategy, session-based (connect-pg-simple)
- **Routing**: wouter (frontend), Express (backend)
- **State Management**: TanStack React Query v5
- **Styling**: TailwindCSS + shadcn/ui
- **Additional Libraries**: Leaflet (maps), Recharts (charts), Framer Motion (animations), react-hook-form, @hello-pangea/dnd (drag-drop)

### Directory Structure
- `client/src/pages/` - Application pages (Login, Registro, Dashboard, Pipeline, Propostas, etc.)
- `client/src/components/` - Reusable UI components (layout/, dashboard/, pipeline/, proposals/)
- `server/` - Express backend
  - `auth.ts` - Passport.js authentication setup
  - `routes.ts` - All API routes
  - `storage.ts` - Database CRUD operations (IStorage interface)
  - `xcurve.ts` - XCurve credit decisioning integration
  - `db.ts` - Drizzle database connection
- `shared/schema.ts` - Drizzle schema definitions and Zod validation schemas

### Database Schema
- `users` - User accounts with email, password, personType (PF/PJ), document, role
- `pf_details` - Pessoa Física details (CPF, RG, birthDate, income, etc.)
- `pj_details` - Pessoa Jurídica details (CNPJ, companyName, industry, revenue, etc.)
- `proposals` - Credit proposals with stage pipeline tracking
- `proposal_documents` - Documents attached to proposals
- `credit_analysis` - Credit analysis results (XCurve scores, risk levels)
- `audit_trail` - Action logging for compliance
- `guarantees` - Optional guarantee records

### API Endpoints
- `POST /api/auth/register` - Register new user (PF or PJ)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET/POST/PATCH /api/proposals` - CRUD for proposals
- `GET/POST /api/proposals/:id/documents` - Proposal documents
- `GET/POST /api/proposals/:id/credit-analysis` - Credit analysis
- `GET/POST /api/proposals/:id/guarantees` - Guarantees (optional)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/pipeline` - Pipeline data
- `POST /api/xcurve/score` - Request XCurve credit score
- `GET /api/xcurve/status` - Check XCurve configuration status

### Key Commands
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
- `XCURVE_API_URL` - XCurve API base URL (optional, for credit scoring)
- `XCURVE_API_KEY` - XCurve API key (optional)
- `XCURVE_TIMEOUT` - XCurve request timeout in ms (default: 30000)

### User Roles
- `cliente` - Can view own proposals
- `projetista` - Can view own proposals
- `analista` - Can view assigned proposals
- `gerente` - Can view all proposals (manager dashboard)
