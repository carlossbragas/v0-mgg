import { Router } from "express"
import { pool } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { createError } from "../middleware/errorHandler"

const router = Router()

// Get shopping items
router.get("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId
    const { purchased, category } = req.query

    let query = `
      SELECT si.*, fm.name as purchased_by_name
      FROM shopping_items si
      LEFT JOIN family_members fm ON si.purchased_by = fm.id
      WHERE si.family_id = $1
    `

    const params: any[] = [familyId]
    let paramCount = 1

    if (purchased !== undefined) {
      paramCount++
      query += ` AND si.purchased = $${paramCount}`
      params.push(purchased === "true")
    }

    if (category) {
      paramCount++
      query += ` AND si.category = $${paramCount}`
      params.push(category)
    }

    query += " ORDER BY si.purchased ASC, si.created_at DESC"

    const result = await pool.query(query, params)

    res.json({
      items: result.rows,
    })
  } catch (error) {
    next(error)
  }
})

// Add shopping item
router.post("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, category, quantity = 1, estimatedPrice } = req.body
    const familyId = req.familyId

    if (!name) {
      throw createError("Item name is required", 400)
    }

    const result = await pool.query(
      "INSERT INTO shopping_items (family_id, name, category, quantity, estimated_price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [familyId, name, category, quantity, estimatedPrice],
    )

    res.status(201).json({
      message: "Item added successfully",
      item: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Update shopping item
router.put("/:itemId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { itemId } = req.params
    const { name, category, quantity, estimatedPrice, purchased, purchasedBy } = req.body
    const familyId = req.familyId

    const result = await pool.query(
      `UPDATE shopping_items SET 
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        quantity = COALESCE($3, quantity),
        estimated_price = COALESCE($4, estimated_price),
        purchased = COALESCE($5, purchased),
        purchased_by = COALESCE($6, purchased_by),
        purchased_at = CASE WHEN $5 = true AND purchased = false THEN CURRENT_TIMESTAMP ELSE purchased_at END
      WHERE id = $7 AND family_id = $8 RETURNING *`,
      [name, category, quantity, estimatedPrice, purchased, purchasedBy, itemId, familyId],
    )

    if (result.rows.length === 0) {
      throw createError("Item not found", 404)
    }

    res.json({
      message: "Item updated successfully",
      item: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Delete shopping item
router.delete("/:itemId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { itemId } = req.params
    const familyId = req.familyId

    const result = await pool.query("DELETE FROM shopping_items WHERE id = $1 AND family_id = $2 RETURNING *", [
      itemId,
      familyId,
    ])

    if (result.rows.length === 0) {
      throw createError("Item not found", 404)
    }

    res.json({
      message: "Item deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

// Get shopping statistics
router.get("/stats", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId

    const result = await pool.query(
      `
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN purchased = true THEN 1 END) as purchased_items,
        COUNT(CASE WHEN purchased = false THEN 1 END) as pending_items,
        COALESCE(SUM(CASE WHEN purchased = false THEN estimated_price * quantity ELSE 0 END), 0) as estimated_total
      FROM shopping_items 
      WHERE family_id = $1
    `,
      [familyId],
    )

    const categoryStats = await pool.query(
      `
      SELECT 
        category,
        COUNT(*) as total_items,
        COUNT(CASE WHEN purchased = true THEN 1 END) as purchased_items,
        COALESCE(SUM(estimated_price * quantity), 0) as estimated_total
      FROM shopping_items 
      WHERE family_id = $1 AND category IS NOT NULL
      GROUP BY category 
      ORDER BY total_items DESC
    `,
      [familyId],
    )

    res.json({
      overview: result.rows[0],
      categoryStats: categoryStats.rows,
    })
  } catch (error) {
    next(error)
  }
})

export { router as shoppingRoutes }
