FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @klikeo/api --filter @klikeo/shared

# Copy source
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Build
WORKDIR /app/apps/api
RUN pnpm --filter @klikeo/shared build
RUN pnpm build

# Expose port
EXPOSE 3001

# Start
CMD ["node", "dist/server.js"]