# Deployment Configuration

## Required Environment Variables

Set these environment variables in your deployment platform (Vercel, Railway, etc.):

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database_name"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key-here"
```

## Build Configuration

The build process includes:
1. `prisma generate` - Generates Prisma client
2. `next build` - Builds the Next.js application

## Database Setup

Make sure to run database migrations on first deployment:
```bash
npx prisma migrate deploy
```

## Prisma Configuration

The Prisma client is automatically generated during the build process via the `postinstall` script.
