# BENCLO Warehouse System

Production-ready full-stack warehouse system for fashion operations.

## Stack
- Next.js 14 (App Router)
- Prisma ORM
- Vercel Postgres
- JWT auth via httpOnly cookie
- Tailwind CSS (mobile-first + dark/light)

## Rules Implemented
- Roles: `ADMIN`, `OPERATOR`, `RESELLER`
- Admin-only data management APIs (`/api/admin/*`)
- Operator scan-only workflow (barcode/QR input only)
- Multi-warehouse stock model with non-negative stock enforcement
- Atomic transfer using Prisma transaction (`TRANSFER_OUT` + `TRANSFER_IN`)
- Opname recording `systemQty` and `actualQty`
- Immutable stock movements (insert-only model)
- Route middleware for API and page role protection
- Duplicate scan submission prevention in operator UI (client lock)

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run:
   ```bash
   npm run dev
   ```

## Deploy on Vercel Free Tier
- Set `POSTGRES_URL` from Vercel Postgres integration.
- Set `JWT_SECRET` in project env vars.
- Build command: `npm run build`.
