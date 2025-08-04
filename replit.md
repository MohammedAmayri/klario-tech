# Klario - NFC Customer Engagement Platform

## Overview

Klario is a comprehensive NFC-powered customer engagement platform built with modern web technologies. The application combines React frontend with Express.js backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations. The platform enables businesses to collect customer information through NFC tag scanning and manage exclusive deal campaigns with AI-powered features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state, React hooks for local state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Driver**: Neon serverless PostgreSQL connection
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Development**: Full-stack development with Vite middleware integration

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Schema Location**: `shared/schema.ts` using Drizzle ORM schema definitions
- **Migrations**: Managed through `drizzle-kit` with migrations stored in `./migrations`

## Key Components

### Customer Data Collection
- **NFC Integration**: Customer forms optimized for mobile NFC interactions
- **Multi-language Support**: English and Swedish localization
- **GDPR Compliance**: Built-in consent management and privacy policy integration
- **Form Validation**: Real-time validation with visual feedback

### Campaign Management
- **Multi-channel Campaigns**: Support for SMS, email, and phone campaigns
- **AI-Powered Content**: Message generation and enhancement using AI
- **Audience Segmentation**: Customer targeting and filtering capabilities
- **Scheduling**: Campaign timing and automation features

### Dashboard Interface
- **Customer Management**: Comprehensive customer listing and filtering
- **Analytics**: Campaign performance tracking and metrics
- **Real-time Updates**: Live data synchronization using React Query
- **Responsive Design**: Mobile-first approach with desktop optimization

### AI Features
- **Message Assistant**: AI-powered message generation and optimization
- **Chatbot Integration**: Multi-language customer support bot
- **Content Enhancement**: Automated campaign content improvement
- **Intent Detection**: Smart customer interaction analysis

## Data Flow

1. **Customer Interaction**: NFC card tap triggers customer form display
2. **Data Collection**: Customer information captured with consent validation
3. **Storage**: Data persisted to PostgreSQL via Drizzle ORM
4. **Campaign Triggers**: Automated campaign enrollment based on customer actions
5. **AI Processing**: Content generation and optimization for personalized messaging
6. **Multi-channel Delivery**: Campaign execution across SMS, email, and voice channels
7. **Analytics**: Performance tracking and customer behavior analysis

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Session-based authentication with PostgreSQL storage
- **File Storage**: Local development, extensible for cloud storage

### UI and Styling
- **Component Library**: Radix UI for accessible, unstyled components
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with custom design system
- **Typography**: System fonts with fallbacks

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TSC for type checking, ESM module system
- **Development**: Hot module replacement and error overlay
- **Replit Integration**: Cartographer plugin for Replit environment

### Business Logic
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for localized date operations
- **Internationalization**: Custom localization system for multi-language support

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express.js backend
- **Hot Reload**: Full-stack hot module replacement
- **Environment Variables**: DATABASE_URL required for database connection
- **Port Configuration**: Express server with Vite middleware integration

### Production Build
- **Frontend**: Vite build to `dist/public` directory
- **Backend**: ESBuild compilation to `dist/index.js`
- **Static Assets**: Served through Express.js static middleware
- **Database**: Drizzle migrations applied via `db:push` command

## Recent Integration Progress

### January 30, 2025 - Major Backend Integration
- ✅ **Database Integration**: Migrated from memory storage to PostgreSQL with complete schema
- ✅ **Authentication System**: Implemented business signup/signin with session management
- ✅ **Email Service**: Created SMTP-based email service with campaign support
- ✅ **SMS Service**: Integrated HelloSMS API for SMS campaigns with fallback to mock service
- ✅ **Campaign Management**: Full campaign creation, execution, and tracking system
- ✅ **API Architecture**: Complete REST API with proper authentication and error handling

### Integration Status:
1. 🟢 **Database** - PostgreSQL with Drizzle ORM (READY)
2. 🟢 **Authentication** - Session-based business authentication (READY)  
3. 🟢 **Email** - SMTP service ready (needs SMTP credentials)
4. 🟢 **SMS** - HelloSMS integration FULLY WORKING (TESTED - real SMS delivery confirmed)
5. 🟢 **AI Campaign Generation** - OpenAI GPT-4o integration (READY - tested working)
6. 🟢 **Campaign Management** - Complete campaign creation, saving, and SMS sending (READY)
7. 🟡 **WhatsApp** - Not implemented yet
8. 🟢 **Frontend Integration** - Full frontend-backend integration complete

### Latest Achievement (February 3, 2025):
✅ **Complete Swedish Market Ready Implementation**: All 6 prioritized features implemented systematically

#### **Static Pages & Legal Compliance**
- ✅ Contact page with Swedish business information and multi-language forms
- ✅ Terms of Service with GDPR compliance and Swedish consumer protection
- ✅ Privacy Policy aligned with Swedish data protection laws
- ✅ EU Cookie Consent system with granular permission management

#### **Swedish Internationalization** 
- ✅ Comprehensive i18n system with Swedish as primary language
- ✅ Language toggle component (SV/EN) integrated across all pages
- ✅ Complete translations for Dashboard, campaigns, forms, and navigation
- ✅ Swedish-focused content and messaging throughout platform

#### **Super Admin Platform Management**
- ✅ Role-based authentication system with secure admin access
- ✅ Business oversight dashboard with platform statistics
- ✅ Complete audit logging for all administrative actions
- ✅ User management and business suspension capabilities

#### **Swedish Payment Integration**
- ✅ **Klarna API integration** with BankID support for Swedish market
- ✅ **Swish mobile payments** with QR code generation and app-to-app flow
- ✅ Swedish company data schema (org numbers, VAT, postal codes)
- ✅ Multi-provider payment service with proper error handling
- ✅ Swedish pricing structure (299/699/1499 SEK monthly plans)

#### **Production Deployment Infrastructure**
- ✅ **Docker containerization** with multi-stage builds and health checks
- ✅ **GitHub Actions CI/CD** with automated testing and Digital Ocean deployment  
- ✅ **Complete docker-compose** with PostgreSQL, Redis, Traefik SSL proxy
- ✅ **Backup/restore scripts** with automated daily database backups
- ✅ **Security scanning** and production-ready configuration management

### Latest Achievement (February 3, 2025):
✅ **Complete Production Deployment Infrastructure**: Enterprise-grade Docker deployment system implemented

#### **Production Deployment System**
- ✅ **Multi-stage Docker build** with security best practices and health checks
- ✅ **Docker Compose orchestration** with PostgreSQL, Redis, Caddy reverse proxy
- ✅ **Caddy SSL/TLS** with automatic Let's Encrypt certificates and security headers
- ✅ **GitHub Actions CI/CD** with automated testing, building, and deployment
- ✅ **Database backup system** with automated daily backups and retention policies
- ✅ **Production monitoring** with health checks, logging, and error handling

#### **Infrastructure Components**
- ✅ **Containerized Application** (Node.js 18 Alpine, non-root user, health checks)
- ✅ **PostgreSQL Database** (v15 with persistent volumes and connection pooling)
- ✅ **Redis Session Store** (v7 with password authentication and persistence)
- ✅ **Caddy Reverse Proxy** (HTTP/2, compression, rate limiting, SSL termination)
- ✅ **Automated Backups** (daily PostgreSQL dumps with configurable retention)

#### **Deployment Features**
- ✅ **Zero-downtime deployments** with rolling updates and health checks
- ✅ **Environment-based configuration** with secure secret management
- ✅ **Migration scripts** for moving from development to production database
- ✅ **Production setup automation** with server configuration scripts
- ✅ **Comprehensive monitoring** with application and infrastructure health checks

#### **Security & Performance**
- ✅ **Production security headers** (HSTS, CSP, X-Frame-Options, etc.)
- ✅ **Rate limiting** with different policies for API and static content
- ✅ **SSL/TLS encryption** with automatic certificate renewal
- ✅ **Non-root containers** with minimal attack surface
- ✅ **Secret management** with environment variables and templates

### Next Steps:
- Deploy to Digital Ocean droplet using the complete infrastructure
- Configure production environment variables and domain name
- Set up GitHub Actions secrets for automated deployment pipeline
- Configure Swedish payment provider credentials (Klarna + Swish)
- Launch Swedish market beta testing program
- Implement WhatsApp Business API integration for additional channels
- Add comprehensive campaign analytics and delivery tracking

### Architecture Decisions

1. **Monorepo Structure**: Single repository with shared types and utilities for consistency
2. **TypeScript Throughout**: Full type safety across frontend, backend, and shared code
3. **Serverless Database**: Neon PostgreSQL for scalability and reduced operational overhead
4. **Component-First UI**: Modular, reusable components with consistent design system
5. **AI Integration Ready**: Structured for OpenAI integration with mock implementations
6. **Mobile-First Design**: NFC interaction optimized for mobile devices
7. **GDPR Compliance**: Built-in privacy controls and consent management
8. **Multi-language Support**: Internationalization architecture for global markets

The application follows modern web development best practices with a focus on developer experience, user accessibility, and business scalability. The architecture supports both rapid development and production deployment while maintaining code quality and type safety throughout the stack.