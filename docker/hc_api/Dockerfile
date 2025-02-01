FROM node:22-alpine AS base
WORKDIR /app

RUN mkdir hc_api
RUN mkdir hc_models

COPY ./hc_api ./hc_api
COPY ./hc_models ./hc_models

# Build hc_models
RUN cd hc_models \
    && npm ci \
    && npm run build \
    && npm link

# Build hc_api
RUN cd hc_api \
    && npm ci \
    && npm link hc_models \
    && npm run build

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hc

USER hc

EXPOSE 42069

ENV API_PORT=42069
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/hc_api

CMD ["npm", "run", "start:prod"]
#CMD [ "tail", "-F", "VqKVJUkBQKmcNkfC" ]

#FROM base AS deps
#WORKDIR /app

#RUN apk add --no-cache libc6-compat

#RUN mkdir hc_api
#RUN mkdir hc_models

#COPY hc_api/package.json hc_api/package-lock.json* ./hc_api/
#COPY hc_models/package.json hc_models/package-lock.json* ./hc_models/

#RUN cd hc_api && npm ci
#RUN cd hc_models && npm ci

#FROM base AS builder
#WORKDIR /app

#COPY --from=deps /app/hc_api/node_modules ./hc_api/node_modules
#COPY --from=deps /app/hc_models/node_modules ./hc_models/node_modules

#COPY ./hc_api ./hc_api
#COPY ./hc_models ./hc_models

# Build hc_models
#RUN cd hc_models \
#    && npm run build \
#    && npm link

# Build hc_api
#RUN cd hc_api \
#    && npm link hc_models \
#    && npm run build

#FROM base AS runner
#WORKDIR /app

#ENV NODE_ENV=production

#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 hc

#RUN mkdir hc_api

#COPY --from=builder --chown=hc:nodejs /app/hc_api/dist ./

#USER hc

#EXPOSE 42069

#ENV PORT=42069
#ENV HOSTNAME="0.0.0.0"

#CMD ["node", "src/main.js"]
#CMD [ "tail", "-F", "VqKVJUkBQKmcNkfC" ]