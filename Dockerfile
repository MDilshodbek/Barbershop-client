# Cropper frontend (Next.js 14, standalone output)
# Built in GitHub Actions, never on the server.

# ---------- 1. install dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

# ---------- 2. build ----------
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable

# These are baked into the JS bundle at build time (see next.config.js "env"),
# so they come from GitHub Actions variables as build args, not from a server .env.
ARG REACT_APP_API_URL
ARG REACT_APP_API_GRAPHQL_URL
ARG REACT_APP_API_WS
ENV REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_API_GRAPHQL_URL=$REACT_APP_API_GRAPHQL_URL \
    REACT_APP_API_WS=$REACT_APP_API_WS \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ---------- 3. run ----------
FROM node:22-alpine AS runner
WORKDIR /app

LABEL org.opencontainers.image.source="https://github.com/MDilshodbek/Barbershop-client"

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# standalone server + static files + public assets (incl. locales) + i18n config
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next-i18next.config.js ./next-i18next.config.js

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
