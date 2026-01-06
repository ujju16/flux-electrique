# syntax=docker/dockerfile:1.7

# Install dependencies in a clean layer
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build Next.js in standalone mode
FROM node:20-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# Minimal runtime image (non-root)
FROM gcr.io/distroless/nodejs20-debian12 AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
USER nonroot
EXPOSE 3000
CMD ["server.js"]
