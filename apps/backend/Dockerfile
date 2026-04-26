FROM node:20-alpine

RUN apk add --no-cache libc6-compat

# Create user and group early
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusa

WORKDIR /app

# Ensure /app is owned by medusa before we start copying
RUN chown medusa:nodejs /app

USER medusa

# Install backend dependencies as 'medusa' user
COPY --chown=medusa:nodejs apps/backend/package.json ./
COPY --chown=medusa:nodejs apps/backend/package-lock.json ./
COPY --chown=medusa:nodejs apps/backend/.npmrc ./
RUN npm install

# Copy the backend source as 'medusa' user
COPY --chown=medusa:nodejs apps/backend/ ./

ENV NODE_ENV=production
ENV MEDUSA_ADMIN_ONBOARDING_TYPE=none
ENV DISABLE_MEDUSA_ADMIN=false
ENV ADMIN_AUTH_TYPE=jwt
ENV ADMIN_JWT_TOKEN_STORAGE_KEY=medusa_admin_auth_token
ENV MEDUSA_BACKEND_URL=/
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa?sslmode=disable
ENV REDIS_URL=redis://localhost:6379
ENV JWT_SECRET=temp_secret
ENV COOKIE_SECRET=temp_secret

# Build as 'medusa' user - no chown needed afterward
RUN rm -rf ./public/admin \
  && npx medusa build \
  && mkdir -p ./public \
  && cp -R ./.medusa/server/public/admin ./public/admin

RUN chmod +x ./entrypoint.sh

EXPOSE 9000

CMD ["./entrypoint.sh"]
