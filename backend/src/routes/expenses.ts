import { Router } from "express"
import { pool } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { createError } from "../middleware/errorHandler"

const router = Router()

// Get expenses
router.get("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId
    const { page = 1, limit = 10, category, memberId, startDate, endDate } = req.query

    let query = `
      SELECT e.*, fm.name as member_name
      FROM expenses e
      LEFT JOIN family_members fm ON e.member_id = fm.id
      WHERE e.family_id = $1
    `

    const params: any[] = [familyId]
    let paramCount = 1

    if (category) {
      paramCount++
      query += ` AND e.category = $${paramCount}`
      params.push(category)
    }

    if (memberId) {
      paramCount++
      query += ` AND e.member_id = $${paramCount}`
      params.push(memberId)
    }

    if (startDate) {
      paramCount++
      query += ` AND e.date >= $${paramCount}`
      params.push(startDate)
    }

    if (endDate) {
      paramCount++
      query += ` AND e.date <= $${paramCount}`
      params.push(endDate)
    }

    query += ` ORDER BY e.date DESC, e.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, (Number(page) - 1) * Number(limit))

    const result = await pool.query(query, params)

    // Get total count
    let countQuery = "SELECT COUNT(*) FROM expenses WHERE family_id = $1"
    const countParams = [familyId]

    if (category) {
      countQuery += " AND category = $2"
      countParams.push(category)
    }

    const countResult = await pool.query(countQuery, countParams)
    const total = Number.parseInt(countResult.rows[0].count)

    res.json({
      expenses: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
})

// Add expense
router.post("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { memberId, amount, category, description, date } = req.body
    const familyId = req.familyId

    if (!memberId || !amount || !category || !date) {
      throw createError("Member ID, amount, category and date are required", 400)
    }

    if (amount <= 0) {
      throw createError("Amount must be greater than 0", 400)
    }

    const result = await pool.query(
      "INSERT INTO expenses (family_id, member_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [familyId, memberId, amount, category, description, date],
    )

    // Get member name for response
    const memberResult = await pool.query("SELECT name FROM family_members WHERE id = $1", [memberId])

    res.status(201).json({
      message: "Expense added successfully",
      expense: {
        ...result.rows[0],
        member_name: memberResult.rows[0]?.name,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update expense
router.put("/:expenseId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { expenseId } = req.params
    const { amount, category, description, date } = req.body
    const familyId = req.familyId

    const result = await pool.query(
      `UPDATE expenses SET 
        amount = COALESCE($1, amount),
        category = COALESCE($2, category),
        description = COALESCE($3, description),
        date = COALESCE($4, date)
      WHERE id = $5 AND family_id = $6 RETURNING *`,
      [amount, category, description, date, expenseId, familyId],
    )

    if (result.rows.length === 0) {
      throw createError("Expense not found", 404)
    }

    res.json({
      message: "Expense updated successfully",
      expense: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Delete expense
router.delete("/:expenseId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { expenseId } = req.params
    const familyId = req.familyId

    const result = await pool.query("DELETE FROM expenses WHERE id = $1 AND family_id = $2 RETURNING *", [
      expenseId,
      familyId,
    ])

    if (result.rows.length === 0) {
      throw createError("Expense not found", 404)
    }

    res.json({
      message: "Expense deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

// Get expense statistics
router.get("/stats", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId
    const { period = "month" } = req.query

    let dateFilter = ""
    if (period === "week") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '7 days'"
    } else if (period === "month") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '30 days'"
    } else if (period === "year") {
      dateFilter = "AND date >= CURRENT_DATE - INTERVAL '365 days'"
    }

    const totalResult = await pool.query(
      `
      SELECT 
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) as total_count
      FROM expenses 
      WHERE family_id = $1 ${dateFilter}
    `,
      [familyId],
    )

    const categoryResult = await pool.query(
      `
      SELECT 
        category,
        SUM(amount) as total_amount,
        COUNT(*) as count
      FROM expenses 
      WHERE family_id = $1 ${dateFilter}
      GROUP BY category 
      ORDER BY total_amount DESC
    `,
      [familyId],
    )

    const memberResult = await pool.query(
      `
      SELECT 
        fm.name,
        SUM(e.amount) as total_amount,
        COUNT(e.*) as count
      FROM expenses e
      LEFT JOIN family_members fm ON e.member_id = fm.id
      WHERE e.family_id = $1 ${dateFilter}
      GROUP BY fm.id, fm.name 
      ORDER BY total_amount DESC
    `,
      [familyId],
    )

    res.json({
      total: totalResult.rows[0],
      byCategory: categoryResult.rows,
      byMember: memberResult.rows,
    })
  } catch (error) {
    next(error)
  }
})

export { router as expenseRoutes }
