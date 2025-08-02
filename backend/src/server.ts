import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { authRoutes } from "./routes/auth"
import { familyRoutes } from "./routes/family"
import { walletRoutes } from "./routes/wallet"
import { iotRoutes } from "./routes/iot"
import { expenseRoutes } from "./routes/expenses"
import { taskRoutes } from "./routes/tasks"
import { shoppingRoutes } from "./routes/shopping"
import { reportRoutes } from "./routes/reports"
import { errorHandler } from "./middleware/errorHandler"
import { initDatabase } from "./database/init"

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/family", familyRoutes)
app.use("/api/wallet", walletRoutes)
app.use("/api/iot", iotRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/shopping", shoppingRoutes)
app.use("/api/reports", reportRoutes)

// Error handling
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase()
    console.log("Database initialized successfully")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

export default app
