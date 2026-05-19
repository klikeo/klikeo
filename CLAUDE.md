# Klikeo

Plataforma SaaS que centraliza el comercio local colombiano: perfil público por negocio + chatbot de WhatsApp personalizado con IA.

## Commands

- `pnpm dev` — Levanta web (3000) + api (3001) simultáneamente con Turborepo
- `pnpm build` — Build de producción de todos los apps
- `pnpm test` — Ejecuta toda la suite de tests (unit + integration)
- `pnpm lint` — ESLint en todo el monorepo
- `docker-compose up -d` — Levanta MongoDB local para desarrollo

## Tech Stack

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Express API + MongoDB (Mongoose) + JWT + DeepSeek API + WhatsApp Business API + Expo (mobile) + Turborepo + pnpm

## Architecture

### Directory Structure

- `apps/web/src/app/(marketing)/` — Páginas públicas con SSR/ISR (landing, listado, perfil de negocio)
- `apps/web/src/app/(app)/` — Dashboard protegido del dueño (requiere auth)
- `apps/api/src/domain/` — Entidades puras TypeScript (sin Mongoose)
- `apps/api/src/use-cases/` — Lógica de negocio, depende solo de interfaces
- `apps/api/src/repositories/` — Implementaciones Mongoose de las interfaces
- `apps/api/src/controllers/` — Express handlers, sin lógica de negocio
- `apps/api/src/services/` — Integraciones externas (DeepSeek, WhatsApp)
- `apps/mobile/src/app/` — Expo Router, file-based routing
- `packages/shared/src/types/` — Tipos compartidos entre web, api y mobile

### Data Flow

Cliente WhatsApp → `POST /api/webhooks/whatsapp` → `ProcessWhatsAppMessageUseCase` → `ChatSessionRepository` + `NegocioRepository` → `DeepSeekService` → `WhatsAppService.sendMessage()`

Next.js page → `api-client.ts` → Express API → Use Case → Repository → MongoDB Atlas

### Key Patterns

- **Clean Architecture**: Controllers no conocen Mongoose. Use Cases no conocen Express. Repositories implementan interfaces.
- **TDD obligatorio**: escribir test (rojo) → implementar (verde) → refactorizar. Nunca al revés.
- **Server Components por defecto** en Next.js. Solo `"use client"` cuando hay interactividad real.
- **Webhook WhatsApp**: responder 200 inmediatamente, procesar el mensaje de forma asíncrona.
- **Prompt de sistema DeepSeek**: "Eres el asistente virtual de [Nombre Negocio]. Responde con la siguiente información: [trainingData]. Si no tienes la respuesta, sugiere contactar al negocio."

## Code Organization Rules

1. **Un archivo por entidad/use case/repository/controller.** Máximo 200 líneas por archivo — si excede, extraer.
2. **Path alias `@/`** para imports dentro de cada app. `@klikeo/shared` para el paquete compartido.
3. **Nunca exponer `passwordHash` ni `refreshToken`** en responses de API. Siempre usar `.select('-passwordHash -refreshToken')`.
4. **Todos los endpoints de negocio** verifican que `req.user.negocioId === params.id` antes de modificar.
5. **TypeScript estricto**: `strict: true` en tsconfig. Cero `any` implícitos.
6. **Commits convencionales**: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`.

## Design System

### Colors
- Primary: `#0F766E` (botones, links, accents — verde Colombia)
- Secondary: `#F59E0B` (CTAs secundarios, badges)
- Background: `#F9FAFB`
- Surface: `#FFFFFF`
- Text: `#111827`
- Muted: `#6B7280`
- Border: `#E5E7EB`
- Destructive: `#EF4444`
- Success: `#10B981`

### Typography
- Headings + Body: Inter (Google Fonts)
- H1: 32px/700, H2: 24px/600, H3: 20px/600, Body: 16px/400, Small: 14px/400

### Style
- Border radius: 8px default, 12px cards
- Spacing base: 4px (escala: 4, 8, 12, 16, 24, 32, 48, 64)
- Touch targets mínimos: 44×44px en mobile
- Estética: limpia, confiable, mobile-first. Sin glassmorphism en MVP.

## Environment Variables

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | Conexión a MongoDB (Atlas en prod, localhost en dev) |
| `JWT_SECRET` | Firmar access tokens (15min) |
| `JWT_REFRESH_SECRET` | Firmar refresh tokens (7 días) |
| `DEEPSEEK_API_KEY` | API de DeepSeek (deepseek-chat) |
| `WHATSAPP_TOKEN` | Token de WhatsApp Business API |
| `WHATSAPP_PHONE_ID` | ID del número de WhatsApp Business |
| `WHATSAPP_VERIFY_TOKEN` | Token para verificación del webhook de Meta |
| `NEXT_PUBLIC_API_URL` | URL base de la Express API |

## Reglas No Negociables

1. **TypeScript estricto en todo el monorepo.** Cero `any` implícitos. Nunca escapar con `as any`.
2. **Cada endpoint tiene al menos un test de integración** antes de hacer merge.
3. **El chatbot siempre se identifica** como asistente virtual del negocio, nunca como una persona real.
4. **La firma HMAC-SHA256 del webhook de WhatsApp se verifica siempre.** Rechazar requests sin firma válida con 403.
5. **Nunca commitear `.env`.** Solo `.env.example` con valores de ejemplo va al repositorio.



mongodb+srv://krrattoss5_db_user:nZXOmMcJ4dsLS7w0@cluster0.nonw1k8.mongodb.net/?appName=Cluster0