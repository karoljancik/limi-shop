const { defineConfig } = require("@medusajs/framework/utils")

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || "postgres://localhost:5432/medusa",
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      cookieSecure: false,
      cookieSameSite: "lax",
    },
    trustProxy: true,
    driverConfig: {
      connection: {
        ssl: false,
      },
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  }
})
