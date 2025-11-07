# Hitori Mahjong - Project Architecture & Documentation

This document provides a comprehensive analysis of the Hitori Mahjong web application, detailing its architecture, technology choices, and development practices.

## Project Overview

Hitori Mahjong is a modern web application that implements a single-player version of Mahjong. The project demonstrates a full-stack approach using cutting-edge web technologies with a focus on performance, developer experience, and scalability.

## Architecture Philosophy

The application follows a **full-stack React** approach, leveraging React Router v7's capabilities for both client-side and server-side rendering. This unified approach provides:

- **Code sharing** between client and server
- **Type safety** throughout the entire stack
- **Performance optimization** through SSR and edge deployment
- **Developer experience** with hot reloading and modern tooling

## Technology Stack

### Core Framework
- **React Router v7**: Serves as both the frontend framework and backend runtime
- **Vite**: Build tool and development server
- **TypeScript**: Primary language for type safety and developer experience

### Runtime & Deployment
- **Cloudflare Workers**: Edge runtime for serverless deployment
- **Bun**: Package manager and JavaScript runtime for development

### Data Layer
- **Drizzle ORM**: Type-safe database interactions
- **Better Auth**: Authentication and session management
- **Redis**: Caching and session storage

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **daisyUI**: Component library built on Tailwind

### Development Tools
- **Biome**: Fast linter and formatter
- **Lefthook**: Git hooks for code quality
- **Docker Compose**: Local development environment

## Directory Structure Analysis

### `/app` - Application Core
The heart of the application, following React Router v7 conventions:

```
app/
├── root.tsx              # Root application component
├── entry.server.tsx      # SSR entry point
├── routes/               # File-based routing
│   ├── _index.tsx       # Home page
│   ├── learn.tsx        # Tutorial/learning interface
│   └── api.auth.$.ts    # Authentication API endpoints
└── lib/                 # Core business logic
    ├── auth.ts          # Server-side auth logic
    ├── auth-client.ts   # Client-side auth utilities
    ├── hai.ts           # Mahjong tile logic (牌)
    ├── redis.ts         # Cache layer
    ├── db/              # Database layer
    └── components/      # Reusable UI components
```

### `/public` - Static Assets
Organized by feature with Mahjong-specific assets:

```
public/
├── hai/                 # Mahjong tile images (牌)
├── tutorial/            # Educational content assets
├── background/          # UI background images
├── favicon.ico          # Browser icon
└── logo.svg            # Application branding
```

### `/workers` - Edge Runtime
Contains the Cloudflare Worker that serves the application at the edge.

## Key Design Decisions

### 1. Full-Stack React Architecture
- **Rationale**: Unified development experience with shared code between client and server
- **Benefits**: Type safety, reduced context switching, better performance through SSR
- **Trade-offs**: Learning curve for developers new to full-stack React

### 2. Edge-First Deployment
- **Rationale**: Global performance and reduced latency
- **Benefits**: Fast response times worldwide, automatic scaling
- **Trade-offs**: Runtime limitations of edge environments

### 3. File-Based Routing
- **Rationale**: Convention over configuration, reduced boilerplate
- **Benefits**: Intuitive project structure, automatic route generation
- **Trade-offs**: Less flexibility for complex routing patterns

### 4. Type-Safe Database Layer
- **Rationale**: Prevent runtime errors, improve developer experience
- **Benefits**: Compile-time checks, better refactoring support, IntelliSense
- **Trade-offs**: Additional build-time complexity

## Development Workflow

### Local Development
1. **Environment Setup**: Docker Compose provides local services (likely database/Redis)
2. **Development Server**: Vite provides fast HMR and development experience
3. **Code Quality**: Biome handles linting and formatting
4. **Git Hooks**: Lefthook ensures code quality before commits

### Deployment Pipeline
1. **CI/CD**: GitHub Actions handle automated testing and deployment
2. **Edge Deployment**: Wrangler deploys to Cloudflare Workers
3. **Database Migrations**: Drizzle handles schema changes

## Performance Considerations

### Client-Side Optimizations
- **Code Splitting**: Route-based chunking through React Router
- **Asset Optimization**: Vite handles bundling and minification
- **Caching**: Strategic use of Redis for frequently accessed data

### Server-Side Optimizations
- **SSR**: Faster initial page loads and better SEO
- **Edge Deployment**: Reduced latency through global distribution
- **Database Queries**: Type-safe, optimized queries through Drizzle

## Security Features

### Authentication
- **Better Auth**: Modern, secure authentication system
- **Session Management**: Secure session handling with Redis backing
- **API Protection**: Authentication middleware for protected routes

### Data Security
- **Type Safety**: Prevents many classes of runtime errors
- **Input Validation**: Handled through TypeScript interfaces and runtime checks
- **Environment Variables**: Secure configuration management

## Mahjong-Specific Implementation

### Tile System (`hai.ts`)
The core game logic is encapsulated in the `hai.ts` module, handling:
- Tile representation and validation
- Game state management
- Scoring algorithms
- Rule enforcement

### Visual Assets
- **Tile Images**: Complete set of Mahjong tile graphics in `/public/hai/`
- **Tutorial Graphics**: Educational materials in `/public/tutorial/`
- **Responsive Design**: Tailwind CSS ensures mobile-friendly gameplay

## Future Considerations

### Scalability
- **Database**: Current setup supports horizontal scaling through Cloudflare D1
- **Caching**: Redis layer can be expanded for complex caching strategies
- **CDN**: Static assets benefit from Cloudflare's global CDN

### Feature Expansion
- **Multiplayer Support**: Architecture supports WebSocket integration for real-time gameplay
- **Analytics**: Event tracking can be added through the existing API layer
- **Internationalization**: React Router v7 supports i18n out of the box

## Maintenance & Operations

### Monitoring
- **Error Tracking**: Can be integrated through Cloudflare Workers analytics
- **Performance Monitoring**: Built-in metrics through Cloudflare dashboard
- **Uptime**: Edge deployment provides inherent high availability

### Updates & Maintenance
- **Dependency Management**: Bun provides fast, reliable package management
- **Database Migrations**: Drizzle provides safe, versioned schema changes
- **Rollback Strategy**: Cloudflare Workers support instant rollbacks

## Conclusion

This project represents a modern, well-architected web application that leverages the latest in web development practices. The choice of React Router v7 as a full-stack framework, combined with edge deployment through Cloudflare Workers, provides an excellent foundation for a performant, scalable Mahjong game.

The clean separation of concerns, type safety throughout the stack, and thoughtful tooling choices create a maintainable codebase that can evolve with changing requirements while providing an excellent user experience.