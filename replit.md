# YouTube Video Script Generator

## Overview

This is a full-stack web application that generates professional YouTube video scripts using AI. The application features a modern React frontend with a Node.js/Express backend, utilizing OpenAI's GPT-4o for intelligent script generation. Users can input a topic and customize parameters like video length, content style, and target audience to receive comprehensive video production packages including scripts, scene descriptions, voiceover instructions, and music recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **AI Integration**: OpenAI API using GPT-4o model
- **Session Storage**: Currently using in-memory storage (MemStorage class)
- **Build System**: ESBuild for production bundling

### Development Environment
- **Development Server**: Vite dev server with HMR
- **Database Management**: Drizzle Kit for schema migrations
- **Environment**: Configured for Replit with cartographer plugin

## Key Components

### Frontend Components
1. **Home Page (`client/src/pages/home.tsx`)**: Main interface for script generation with form inputs and results display
2. **UI Components**: Comprehensive set of reusable components using Shadcn/ui
3. **Form Validation**: Zod schemas for type-safe form validation
4. **Query Client**: Configured TanStack Query for API communication

### Backend Services
1. **OpenAI Service (`server/services/openai.ts`)**: Handles AI script generation using GPT-4o
2. **Storage Layer (`server/storage.ts`)**: Abstracted storage interface with in-memory implementation
3. **Route Handlers (`server/routes.ts`)**: API endpoints for script generation
4. **Request Logging**: Middleware for API request logging and error handling

### Shared Schema
- **Type Definitions**: Shared TypeScript types between frontend and backend
- **Validation Schemas**: Zod schemas for request/response validation
- **Database Schema**: Drizzle schema definitions for PostgreSQL

## Data Flow

1. **User Input**: User fills out script generation form with topic, length, style, and audience
2. **Form Validation**: Client-side validation using Zod schemas
3. **API Request**: TanStack Query sends validated data to `/api/generate-script` endpoint
4. **AI Processing**: Backend calls OpenAI GPT-4o with structured prompts
5. **Data Storage**: Generated script is stored using the storage interface
6. **Response**: Comprehensive script package returned to frontend
7. **UI Update**: Results displayed with formatted script, scenes, and production notes

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for script generation with JSON response formatting
- **API Key**: Configured via environment variables (OPENAI_API_KEY)

### Database
- **PostgreSQL**: Primary database (via Neon serverless)
- **Connection**: Configured via DATABASE_URL environment variable
- **ORM**: Drizzle ORM with TypeScript support

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation utilities

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESLint**: Code linting and formatting
- **Vite**: Fast build tool and dev server
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend files in production

### Environment Configuration
- **Development**: Uses Vite dev server with API proxy
- **Production**: Single Express server serves both API and static files
- **Database**: PostgreSQL connection via environment variable
- **AI Service**: OpenAI API key configuration required

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `NODE_ENV`: Environment mode (development/production)

### Scaling Considerations
- **Storage**: Currently uses in-memory storage, can be switched to database persistence
- **AI Limits**: OpenAI API rate limiting and cost management
- **Session Management**: Ready for PostgreSQL session storage implementation
- **Caching**: TanStack Query provides client-side caching for API responses