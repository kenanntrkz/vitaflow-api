# VitaFlow Backend API — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Fastify + TypeScript backend API for VitaFlow CV Builder with auth, resume CRUD, AI features, and template system — deployed on Hetzner Server 2.

**Architecture:** Fastify REST API with JWT auth (access + refresh tokens), PostgreSQL (existing emlak-postgres container), Claude AI integration for content generation/optimization/ATS scoring. Single Docker container on Server 2, SSL via NPM on Server 1.

**Tech Stack:** Fastify 5, TypeScript 5, PostgreSQL 16 (pg), JWT (jsonwebtoken), bcryptjs, Anthropic SDK, Zod validation, Docker (node:20-alpine multi-stage)

---

## Chunk 1: Project Setup + Database + Auth

### Task 1: Initialize Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/config.ts`

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "vitaflow-api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "seed": "tsx src/db/seed.ts"
  },
  "dependencies": {
    "fastify": "^5.3.3",
    "@fastify/cors": "^11.0.1",
    "@fastify/rate-limit": "^10.2.2",
    "pg": "^8.20.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "zod": "^3.25.67",
    "@anthropic-ai/sdk": "^0.52.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "tsx": "^4.19.0",
    "@types/node": "^20",
    "@types/pg": "^8.18.0",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
.env
*.log
```

- [ ] **Step 4: Create .env.example**

```
PORT=3500
DATABASE_URL=postgresql://emlakasistan:password@emlak-postgres:5432/vitaflow
JWT_SECRET=change-me-to-random-64-chars
JWT_REFRESH_SECRET=change-me-to-another-random-64-chars
ANTHROPIC_API_KEY=sk-ant-...
REVENUECAT_WEBHOOK_SECRET=change-me
```

- [ ] **Step 5: Create src/config.ts**

```typescript
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3500),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  REVENUECAT_WEBHOOK_SECRET: z.string().default(''),
});

export const config = envSchema.parse(process.env);
```

- [ ] **Step 6: Install dependencies**

```bash
cd C:\Users\kenan\OneDrive\Desktop\projeler\vitaflow-api && npm install
```

- [ ] **Step 7: Commit**

```bash
git init && git add -A && git commit -m "chore: initialize vitaflow-api project"
```

---

### Task 2: Database Schema

**Files:**
- Create: `src/db/index.ts`
- Create: `src/db/schema.sql`

- [ ] **Step 1: Create src/db/index.ts**

```typescript
import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export default pool;
```

- [ ] **Step 2: Create src/db/schema.sql**

Full schema with users, templates, resumes, ai_usage, refresh_tokens tables.

- [ ] **Step 3: Run schema on Server 2**

```bash
# SSH to Server 2
docker exec emlak-postgres psql -U emlakasistan -c "CREATE DATABASE vitaflow;"
# Then apply schema.sql
```

- [ ] **Step 4: Commit**

---

### Task 3: Auth Utilities

**Files:**
- Create: `src/utils/password.ts`
- Create: `src/utils/jwt.ts`
- Create: `src/utils/validation.ts`
- Create: `src/types/index.ts`

- [ ] **Step 1: Create types**
- [ ] **Step 2: Create password utility (bcryptjs hash/compare)**
- [ ] **Step 3: Create JWT utility (sign/verify access + refresh)**
- [ ] **Step 4: Create validation schemas (Zod)**
- [ ] **Step 5: Commit**

---

### Task 4: Fastify Entry Point + Auth Plugin

**Files:**
- Create: `src/index.ts`
- Create: `src/plugins/auth.ts`

- [ ] **Step 1: Create auth plugin (JWT verification decorator)**
- [ ] **Step 2: Create Fastify entry point with CORS, rate-limit, routes**
- [ ] **Step 3: Commit**

---

### Task 5: Auth Routes

**Files:**
- Create: `src/routes/auth.ts`

- [ ] **Step 1: Implement POST /auth/register**
- [ ] **Step 2: Implement POST /auth/login**
- [ ] **Step 3: Implement POST /auth/refresh**
- [ ] **Step 4: Commit**

---

### Task 6: Resume CRUD Routes

**Files:**
- Create: `src/routes/resumes.ts`

- [ ] **Step 1: Implement GET /resumes (list user's resumes)**
- [ ] **Step 2: Implement GET /resumes/:id**
- [ ] **Step 3: Implement POST /resumes (create)**
- [ ] **Step 4: Implement PUT /resumes/:id (update)**
- [ ] **Step 5: Implement DELETE /resumes/:id**
- [ ] **Step 6: Commit**

---

### Task 7: Template Routes + Seed

**Files:**
- Create: `src/routes/templates.ts`
- Create: `src/db/seed.ts`

- [ ] **Step 1: Implement GET /templates**
- [ ] **Step 2: Create seed script with 10 templates (HTML+CSS)**
- [ ] **Step 3: Commit**

---

## Chunk 2: AI Features + User Routes

### Task 8: Claude AI Service

**Files:**
- Create: `src/services/claude.ts`

- [ ] **Step 1: Implement generateContent (job title + section → AI text)**
- [ ] **Step 2: Implement optimizeContent (existing text → improved text)**
- [ ] **Step 3: Commit**

---

### Task 9: ATS Service

**Files:**
- Create: `src/services/ats.ts`

- [ ] **Step 1: Implement rule-based scoring**
- [ ] **Step 2: Implement AI-enhanced scoring (Claude)**
- [ ] **Step 3: Commit**

---

### Task 10: AI Routes

**Files:**
- Create: `src/routes/ai.ts`

- [ ] **Step 1: Implement POST /ai/generate with rate limiting**
- [ ] **Step 2: Implement POST /ai/optimize**
- [ ] **Step 3: Implement POST /ai/ats-check**
- [ ] **Step 4: Commit**

---

### Task 11: User Routes + Webhook

**Files:**
- Create: `src/routes/users.ts`
- Create: `src/routes/webhooks.ts`

- [ ] **Step 1: Implement GET /users/me**
- [ ] **Step 2: Implement POST /webhooks/revenuecat**
- [ ] **Step 3: Commit**

---

## Chunk 3: Docker + Deploy

### Task 12: Docker Setup

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`

- [ ] **Step 1: Create multi-stage Dockerfile (node:20-alpine)**
- [ ] **Step 2: Create docker-compose.yml (vitaflow-api + network)**
- [ ] **Step 3: Commit**

---

### Task 13: GitHub + Deploy

- [ ] **Step 1: Create GitHub repo kenanntrkz/vitaflow-api**
- [ ] **Step 2: Push to GitHub**
- [ ] **Step 3: Clone on Server 2, create .env, deploy**
- [ ] **Step 4: Setup NPM proxy on Server 1 (vitaflow-api.kenanturkoz.cloud → 10.0.0.3:3500)**
- [ ] **Step 5: Verify all endpoints**

---

### Task 14: GitHub Actions CI/CD

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy workflow (SSH → pull → build → restart)**
- [ ] **Step 2: Commit and push**
