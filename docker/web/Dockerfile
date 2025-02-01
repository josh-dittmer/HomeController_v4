FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN mkdir web
RUN mkdir hc_models

COPY web/package.json web/package-lock.json* ./web/
COPY hc_models/package.json hc_models/package-lock.json* ./hc_models/

RUN cd web && npm ci
RUN cd hc_models && npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/web/node_modules ./web/node_modules
COPY --from=deps /app/hc_models/node_modules ./hc_models/node_modules

COPY ./web ./web
COPY ./hc_models ./hc_models

# Build hc_models
RUN cd hc_models \
    && npm run build \
    && npm link

# Build web
RUN cd web \
    && npm link hc_models \
    && npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

#COPY --from=builder /app/web/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
#CMD [ "tail", "-F", "VqKVJUkBQKmcNkfC" ]