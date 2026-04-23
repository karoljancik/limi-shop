const { spawn } = require("node:child_process")
const path = require("node:path")

const backendRoot = path.resolve(__dirname, "..")
const workspaceRoot = path.resolve(backendRoot, "..", "..")

const env = {
  ...process.env,
  DISABLE_MEDUSA_ADMIN: process.env.DISABLE_MEDUSA_ADMIN || "true",
  XDG_CONFIG_HOME:
    process.env.XDG_CONFIG_HOME || path.join(workspaceRoot, ".localconfig"),
  NODE_PATH: [
    path.join(backendRoot, "node_modules"),
    path.join(workspaceRoot, "node_modules"),
    process.env.NODE_PATH,
  ]
    .filter(Boolean)
    .join(path.delimiter),
}

const cliCandidates = [
  path.join(backendRoot, "node_modules", "@medusajs", "cli", "dist", "index.js"),
  path.join(workspaceRoot, "node_modules", "@medusajs", "cli", "dist", "index.js"),
]

const cliPath = cliCandidates.find((candidate) => require("node:fs").existsSync(candidate))

if (!cliPath) {
  console.error("Unable to locate the Medusa CLI in workspace or app node_modules.")
  process.exit(1)
}

const child = spawn(process.execPath, [cliPath, "build"], {
  cwd: backendRoot,
  env,
  stdio: "inherit",
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
