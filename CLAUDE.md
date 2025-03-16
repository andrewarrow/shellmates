# CLAUDE.md - SpecialContributions Project Guide

## Project Commands
- Install all dependencies: `npm run install:all`
- Start development (client + server): `npm run dev`
- Client only: `npm run client` or `cd client && npm run dev`
- Server only: `npm run server` or `cd server && npm run dev`
- Lint client: `cd client && npm run lint`
- Build client: `npm run build:client` or `npm run build`
- Run server with file watching: `cd server && npm run watch`

## Code Style & Patterns
- **Frontend**: React 19 with Vite, TailwindCSS, React Router v7
- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **JavaScript**: Use plain JavaScript only never typescript
- **Auth**: JWT-based authentication pattern with context API
- **Error handling**: Try/catch with specific error messages
- **Component structure**: Functional components with hooks
- **Module imports**: Import order - React, libraries, local modules
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Code organization**: Separate concerns into context/hooks/pages/components

## Other Guidelines
- Fully type all props, state, and function parameters
- Robust error handling with user-friendly messages
- Consistent use of async/await for API calls
- Use custom hooks for shared logic
