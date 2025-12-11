# WhatsApp Bot Admin Interface

## Overview

A WhatsApp bot admin dashboard for managing automated messaging via Twilio integration. The application provides real-time message logging, bot configuration controls, and connection status monitoring. Built as a modern developer dashboard inspired by Linear, Vercel, and GitHub's admin interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state with automatic refetching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with HMR for development

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API with `/api` prefix
- **Request Handling**: Express with JSON body parsing and raw body capture for webhook signature validation

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Current Storage**: In-memory storage implementation (`MemStorage` class) with interface supporting future database migration
- **Tables**: Users, Messages (WhatsApp logs), Bot Configuration

### Key Data Models
- **Messages**: Stores inbound/outbound WhatsApp messages with Twilio metadata
- **BotConfig**: Auto-reply settings including enable/disable toggle, message template, and response delay
- **MessageStats**: Aggregated statistics for dashboard display

### External Service Integration
- **Twilio**: WhatsApp messaging via Replit Twilio Connector
- **Authentication**: Uses Replit's connector system with `REPL_IDENTITY` or `WEB_REPL_RENEWAL` tokens
- **Webhook Handling**: Receives inbound messages at designated endpoint with signature validation

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Vite builds static assets, esbuild bundles server code
- **Output**: `dist/public` for client, `dist/index.cjs` for server

## External Dependencies

### Third-Party Services
- **Twilio**: WhatsApp Business API for sending/receiving messages
- **Replit Connectors**: Secure credential management for Twilio API keys

### Database
- **PostgreSQL**: Required for production (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Schema migrations via `db:push` command

### Key NPM Packages
- `twilio`: Official Twilio SDK for WhatsApp messaging
- `drizzle-orm` / `drizzle-zod`: Database ORM with Zod schema validation
- `@tanstack/react-query`: Async state management
- `@radix-ui/*`: Accessible UI primitives
- `zod`: Runtime type validation for API payloads