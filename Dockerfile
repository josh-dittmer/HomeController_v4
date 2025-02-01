FROM node:18-alpine as base

FROM base as deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN mkdir hc_api
RUN mkdir web
RUN mkdir hc_models

COPY hc_api/package.json hc_api/package-lock.json* ./hc_api/
COPY web/package.json web/package-lock.json* ./web/
COPY hc_models/package.json hc_models/package-lock.json* ./hc_models/

RUN cd hc_api && npm ci
RUN cd web && npm ci
RUN cd hc_models && ci

FROM base as builder
WORKDIR /app

COPY --from=deps /app/hc_api/node_modules ./hc_api/node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules
COPY --from=deps /app/hc_models/node_modules ./hc_models/node_modules

COPY ./hc_api ./hc_api
COPY ./web ./web
COPY ./hc_models ./hc_models

# Build hc_models
RUN cd hc_models \
    && npm run build \
    && npm link

# Build hc_api
RUN cd hc_api \
    && npm link hc_models \
    && npm run build

# Build web
RUN cd web \
    && npm link hc_models \
    && npm run build

FROM base as runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

RUN mkdir hc_api
RUN mkdir web

COPY --from=builder --chown=nodejs:nodejs /app/web/.next/standalone ./web/
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./web/.next/static

USER nodejs

EXPOSE 42069
EXPOSE 3000