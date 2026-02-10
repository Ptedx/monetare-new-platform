# S.I.G.A - Sistema Integrado de Gestão Amazônica

## Overview
S.I.G.A is a full-stack web application for credit analysis, guarantee monitoring, and management of rural and corporate projects for a Brazilian bank. Built with Express + Vite + React with PostgreSQL database persistence and real-time WebSocket chat.

## Recent Changes
- 2026-02-10: WebSocket server implemented (server/websocket.ts) for real-time chat with session-based authentication
- 2026-02-10: Chat system with conversations, messages, and real-time delivery via WebSocket
- 2026-02-10: Audit trail tracking (GET /api/audit-trail) with time-based filtering
- 2026-02-10: CEP lookup via ViaCEP API in registration - auto-fills address fields
- 2026-02-10: CadastroProposta uses real API for document upload (POST /api/proposals/:id/documents)
- 2026-02-10: Histórico page fetches real audit trail data with search, date filters, pagination
- 2026-02-10: Documentação page shows flat list of documents across user's proposals from API
- 2026-02-10: Role-based sidebar navigation (cliente/projetista vs gerente/analista menus)
- 2026-02-10: Full database schema (11 tables including conversations, conversation_participants, messages)
- 2026-02-10: Authentication system with Passport.js, bcrypt password hashing, session management
- 2026-02-10: All frontend components migrated from localStorage/mock data to real API calls

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
- **Real-time**: WebSocket (ws library) with session authentication
- **Routing**: wouter (frontend), Express (backend)
- **State Management**: TanStack React Query v5
- **Styling**: TailwindCSS + shadcn/ui
- **Additional Libraries**: Leaflet (maps), Recharts (charts), Framer Motion (animations), react-hook-form, @hello-pangea/dnd (drag-drop)

### Directory Structure
- `client/src/pages/` - Application pages (Login, Registro, Dashboard, Pipeline, Propostas, Chat, Historico, Documentacao, CadastroProposta, etc.)
- `client/src/components/` - Reusable UI components (layout/, dashboard/, pipeline/, proposals/)
- `server/` - Express backend
  - `auth.ts` - Passport.js authentication setup, exports sessionMiddleware
  - `routes.ts` - All API routes including chat and audit trail
  - `storage.ts` - Database CRUD operations (IStorage interface)
  - `websocket.ts` - WebSocket server for real-time chat
  - `xcurve.ts` - XCurve credit decisioning integration
  - `db.ts` - Drizzle database connection
  - `index.ts` - Server entry point, integrates WebSocket with HTTP server
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
- `conversations` - Chat conversations
- `conversation_participants` - Many-to-many link between users and conversations
- `messages` - Chat messages with read status

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
- `GET /api/audit-trail` - Audit trail logs (supports ?days=30/90/365)
- `GET /api/chat/users` - Get available chat users
- `GET/POST /api/chat/conversations` - List/create conversations
- `GET /api/chat/conversations/:id/messages` - Get conversation messages
- WebSocket `/ws` - Real-time chat messages and read receipts

### Key Commands
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)
- `XCURVE_API_URL` - XCurve API base URL (optional, for credit scoring)
- `XCURVE_API_KEY` - XCurve API key (optional)
- `XCURVE_TIMEOUT` - XCurve request timeout in ms (default: 30000)

### User Roles & Sidebar Navigation
- `cliente` / `projetista` - See: Propostas, Cadastro de Proposta, Simulador, Documentação, Histórico
- `analista` - See: Dashboard, Pipeline, Simulador, Análise de Perfil, Documentação, Histórico
- `gerente` - See: Dashboard, Pipeline, Simulador, Análise de Perfil, Documentação, Histórico (manager dashboard)
