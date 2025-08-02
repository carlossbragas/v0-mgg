import { Router } from "express"
import { pool } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { createError } from "../middleware/errorHandler"

const router = Router()

// Get family data
router.get("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId

    // Get family info
    const familyResult = await pool.query("SELECT id, name, budget_monthly, created_at FROM families WHERE id = $1", [
      familyId,
    ])

    if (familyResult.rows.length === 0) {
      throw createError("Family not found", 404)
    }

    // Get family members
    const membersResult = await pool.query(
      "SELECT id, name, email, role, avatar_url, balance FROM family_members WHERE family_id = $1 ORDER BY created_at",
      [familyId],
    )

    const family = familyResult.rows[0]
    const members = membersResult.rows

    res.json({
      id: family.id,
      name: family.name,
      budget: {
        monthly: Number.parseFloat(family.budget_monthly),
      },
      members,
      createdAt: family.created_at,
    })
  } catch (error) {
    next(error)
  }
})

// Add family member
router.post("/members", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, email, role = "member" } = req.body
    const familyId = req.familyId

    if (!name) {
      throw createError("Member name is required", 400)
    }

    const result = await pool.query(
      "INSERT INTO family_members (family_id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [familyId, name, email, role],
    )

    res.status(201).json({
      message: "Member added successfully",
      member: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Update family member
router.put("/members/:memberId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { memberId } = req.params
    const { name, email, role } = req.body
    const familyId = req.familyId

    const result = await pool.query(
      "UPDATE family_members SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role) WHERE id = $4 AND family_id = $5 RETURNING *",
      [name, email, role, memberId, familyId],
    )

    if (result.rows.length === 0) {
      throw createError("Member not found", 404)
    }

    res.json({
      message: "Member updated successfully",
      member: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Delete family member
router.delete("/members/:memberId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { memberId } = req.params
    const familyId = req.familyId

    const result = await pool.query("DELETE FROM family_members WHERE id = $1 AND family_id = $2 RETURNING *", [
      memberId,
      familyId,
    ])

    if (result.rows.length === 0) {
      throw createError("Member not found", 404)
    }

    res.json({
      message: "Member deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

// Update family budget
router.put("/budget", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { monthly } = req.body
    const familyId = req.familyId

    if (!monthly || monthly <= 0) {
      throw createError("Valid monthly budget is required", 400)
    }

    await pool.query("UPDATE families SET budget_monthly = $1 WHERE id = $2", [monthly, familyId])

    res.json({
      message: "Budget updated successfully",
      budget: { monthly: Number.parseFloat(monthly) },
    })
  } catch (error) {
    next(error)
  }
})

export { router as familyRoutes }
