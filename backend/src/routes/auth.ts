import { Router } from "express"
import bcrypt from "bcrypt"
import { pool } from "../config/database"
import { config } from "../config/database"
import { generateToken } from "../middleware/auth"
import { createError } from "../middleware/errorHandler"

const router = Router()

// Register family
router.post("/register", async (req, res, next) => {
  try {
    const { familyName, adminEmail, adminPassword, members } = req.body

    if (!familyName || !adminEmail || !adminPassword) {
      throw createError("Family name, admin email and password are required", 400)
    }

    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Check if family already exists
      const existingFamily = await client.query("SELECT id FROM families WHERE admin_email = $1", [adminEmail])

      if (existingFamily.rows.length > 0) {
        throw createError("Family with this email already exists", 409)
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, config.bcrypt.saltRounds)

      // Create family
      const familyResult = await client.query(
        "INSERT INTO families (name, admin_email, admin_password) VALUES ($1, $2, $3) RETURNING id",
        [familyName, adminEmail, hashedPassword],
      )

      const familyId = familyResult.rows[0].id

      // Create family members
      if (members && Array.isArray(members)) {
        for (const member of members) {
          await client.query("INSERT INTO family_members (family_id, name, role) VALUES ($1, $2, $3)", [
            familyId,
            member.name,
            member.role || "member",
          ])
        }
      }

      await client.query("COMMIT")

      const token = generateToken(familyId, adminEmail)

      res.status(201).json({
        message: "Family registered successfully",
        token,
        familyId,
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    next(error)
  }
})

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw createError("Email and password are required", 400)
    }

    const result = await pool.query(
      "SELECT id, name, admin_email, admin_password FROM families WHERE admin_email = $1",
      [email],
    )

    if (result.rows.length === 0) {
      throw createError("Invalid credentials", 401)
    }

    const family = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, family.admin_password)

    if (!isValidPassword) {
      throw createError("Invalid credentials", 401)
    }

    const token = generateToken(family.id, family.admin_email)

    res.json({
      message: "Login successful",
      token,
      familyId: family.id,
      familyName: family.name,
    })
  } catch (error) {
    next(error)
  }
})

export { router as authRoutes }
