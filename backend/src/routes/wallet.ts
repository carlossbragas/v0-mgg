import { Router } from "express"
import { pool } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { createError } from "../middleware/errorHandler"

const router = Router()

// Get wallet transactions
router.get("/transactions", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId
    const { page = 1, limit = 10, memberId, type } = req.query

    let query = `
      SELECT 
        wt.*,
        fm.name as member_name,
        fm_from.name as from_member_name,
        fm_to.name as to_member_name
      FROM wallet_transactions wt
      LEFT JOIN family_members fm ON wt.member_id = fm.id
      LEFT JOIN family_members fm_from ON wt.from_member_id = fm_from.id
      LEFT JOIN family_members fm_to ON wt.to_member_id = fm_to.id
      WHERE wt.family_id = $1
    `

    const params: any[] = [familyId]
    let paramCount = 1

    if (memberId) {
      paramCount++
      query += ` AND wt.member_id = $${paramCount}`
      params.push(memberId)
    }

    if (type) {
      paramCount++
      query += ` AND wt.type = $${paramCount}`
      params.push(type)
    }

    query += ` ORDER BY wt.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, (Number(page) - 1) * Number(limit))

    const result = await pool.query(query, params)

    // Get total count
    let countQuery = "SELECT COUNT(*) FROM wallet_transactions WHERE family_id = $1"
    const countParams = [familyId]

    if (memberId) {
      countQuery += " AND member_id = $2"
      countParams.push(memberId)
    }

    const countResult = await pool.query(countQuery, countParams)
    const total = Number.parseInt(countResult.rows[0].count)

    res.json({
      transactions: result.rows,
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

// Add money to member
router.post("/add", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { memberId, amount, category, description } = req.body
    const familyId = req.familyId

    if (!memberId || !amount || amount <= 0) {
      throw createError("Member ID and valid amount are required", 400)
    }

    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Update member balance
      const memberResult = await client.query(
        "UPDATE family_members SET balance = balance + $1 WHERE id = $2 AND family_id = $3 RETURNING *",
        [amount, memberId, familyId],
      )

      if (memberResult.rows.length === 0) {
        throw createError("Member not found", 404)
      }

      // Record transaction
      await client.query(
        "INSERT INTO wallet_transactions (family_id, member_id, type, amount, category, description) VALUES ($1, $2, $3, $4, $5, $6)",
        [familyId, memberId, "add", amount, category, description],
      )

      await client.query("COMMIT")

      res.json({
        message: "Money added successfully",
        member: memberResult.rows[0],
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

// Remove money from member
router.post("/remove", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { memberId, amount, category, description } = req.body
    const familyId = req.familyId

    if (!memberId || !amount || amount <= 0) {
      throw createError("Member ID and valid amount are required", 400)
    }

    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Check current balance
      const balanceResult = await client.query("SELECT balance FROM family_members WHERE id = $1 AND family_id = $2", [
        memberId,
        familyId,
      ])

      if (balanceResult.rows.length === 0) {
        throw createError("Member not found", 404)
      }

      const currentBalance = Number.parseFloat(balanceResult.rows[0].balance)
      if (currentBalance < amount) {
        throw createError("Insufficient balance", 400)
      }

      // Update member balance
      const memberResult = await client.query(
        "UPDATE family_members SET balance = balance - $1 WHERE id = $2 AND family_id = $3 RETURNING *",
        [amount, memberId, familyId],
      )

      // Record transaction
      await client.query(
        "INSERT INTO wallet_transactions (family_id, member_id, type, amount, category, description) VALUES ($1, $2, $3, $4, $5, $6)",
        [familyId, memberId, "remove", amount, category, description],
      )

      await client.query("COMMIT")

      res.json({
        message: "Money removed successfully",
        member: memberResult.rows[0],
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

// Transfer money between members
router.post("/transfer", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { fromMemberId, toMemberId, amount, description } = req.body
    const familyId = req.familyId

    if (!fromMemberId || !toMemberId || !amount || amount <= 0) {
      throw createError("From member, to member and valid amount are required", 400)
    }

    if (fromMemberId === toMemberId) {
      throw createError("Cannot transfer to the same member", 400)
    }

    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Check sender balance
      const senderResult = await client.query(
        "SELECT balance, name FROM family_members WHERE id = $1 AND family_id = $2",
        [fromMemberId, familyId],
      )

      if (senderResult.rows.length === 0) {
        throw createError("Sender not found", 404)
      }

      const senderBalance = Number.parseFloat(senderResult.rows[0].balance)
      if (senderBalance < amount) {
        throw createError("Insufficient balance", 400)
      }

      // Check receiver exists
      const receiverResult = await client.query(
        "SELECT id, name FROM family_members WHERE id = $1 AND family_id = $2",
        [toMemberId, familyId],
      )

      if (receiverResult.rows.length === 0) {
        throw createError("Receiver not found", 404)
      }

      // Update balances
      await client.query("UPDATE family_members SET balance = balance - $1 WHERE id = $2 AND family_id = $3", [
        amount,
        fromMemberId,
        familyId,
      ])

      await client.query("UPDATE family_members SET balance = balance + $1 WHERE id = $2 AND family_id = $3", [
        amount,
        toMemberId,
        familyId,
      ])

      // Record transaction
      await client.query(
        "INSERT INTO wallet_transactions (family_id, member_id, type, amount, description, from_member_id, to_member_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [familyId, fromMemberId, "transfer", amount, description, fromMemberId, toMemberId],
      )

      await client.query("COMMIT")

      res.json({
        message: "Transfer completed successfully",
        from: senderResult.rows[0].name,
        to: receiverResult.rows[0].name,
        amount,
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

export { router as walletRoutes }
