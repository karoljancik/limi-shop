FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install backend dependencies in an isolated app root to avoid workspace resolution issues.
COPY apps/backend/package.json ./
COPY apps/backend/package-lock.json ./
COPY apps/backend/.npmrc ./
RUN npm install

# Copy the backend source after dependencies are installed for better layer caching.
COPY apps/backend/ ./

ENV NODE_ENV=production
ENV MEDUSA_ADMIN_ONBOARDING_TYPE=none
ENV DISABLE_MEDUSA_ADMIN=false
ENV MEDUSA_BACKEND_URL=http://localhost:9000
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa?sslmode=disable
ENV REDIS_URL=redis://localhost:6379
ENV JWT_SECRET=temp_secret
ENV COOKIE_SECRET=temp_secret

RUN npx medusa build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa
RUN chown -R medusa:nodejs /app
RUN chmod +x ./entrypoint.sh

USER medusa
EXPOSE 9000

CMD ["./entrypoint.sh"]
