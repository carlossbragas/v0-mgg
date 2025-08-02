import { Router } from "express"
import { pool } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { createError } from "../middleware/errorHandler"

const router = Router()

// Get tasks
router.get("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId
    const { completed, assignedTo, category } = req.query

    let query = `
      SELECT t.*, fm.name as assigned_to_name
      FROM tasks t
      LEFT JOIN family_members fm ON t.assigned_to = fm.id
      WHERE t.family_id = $1
    `

    const params: any[] = [familyId]
    let paramCount = 1

    if (completed !== undefined) {
      paramCount++
      query += ` AND t.completed = $${paramCount}`
      params.push(completed === "true")
    }

    if (assignedTo) {
      paramCount++
      query += ` AND t.assigned_to = $${paramCount}`
      params.push(assignedTo)
    }

    if (category) {
      paramCount++
      query += ` AND t.category = $${paramCount}`
      params.push(category)
    }

    query += " ORDER BY t.completed ASC, t.due_date ASC, t.created_at DESC"

    const result = await pool.query(query, params)

    res.json({
      tasks: result.rows,
    })
  } catch (error) {
    next(error)
  }
})

// Add task
router.post("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { title, description, category, assignedTo, reward, dueDate } = req.body
    const familyId = req.familyId

    if (!title) {
      throw createError("Task title is required", 400)
    }

    const result = await pool.query(
      "INSERT INTO tasks (family_id, title, description, category, assigned_to, reward, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [familyId, title, description, category, assignedTo, reward || 0, dueDate],
    )

    // Get assigned member name
    let assignedToName = null
    if (assignedTo) {
      const memberResult = await pool.query("SELECT name FROM family_members WHERE id = $1", [assignedTo])
      assignedToName = memberResult.rows[0]?.name
    }

    res.status(201).json({
      message: "Task added successfully",
      task: {
        ...result.rows[0],
        assigned_to_name: assignedToName,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Update task
router.put("/:taskId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { taskId } = req.params
    const { title, description, category, assignedTo, reward, dueDate, completed } = req.body
    const familyId = req.familyId

    const result = await pool.query(
      `UPDATE tasks SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        assigned_to = COALESCE($4, assigned_to),
        reward = COALESCE($5, reward),
        due_date = COALESCE($6, due_date),
        completed = COALESCE($7, completed),
        completed_at = CASE WHEN $7 = true AND completed = false THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = $8 AND family_id = $9 RETURNING *`,
      [title, description, category, assignedTo, reward, dueDate, completed, taskId, familyId],
    )

    if (result.rows.length === 0) {
      throw createError("Task not found", 404)
    }

    // If task was completed and has reward, add to member balance
    if (completed === true && result.rows[0].reward > 0 && assignedTo) {
      await pool.query("UPDATE family_members SET balance = balance + $1 WHERE id = $2 AND family_id = $3", [
        result.rows[0].reward,
        assignedTo,
        familyId,
      ])

      // Record wallet transaction
      await pool.query(
        "INSERT INTO wallet_transactions (family_id, member_id, type, amount, category, description) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          familyId,
          assignedTo,
          "add",
          result.rows[0].reward,
          "Recompensa",
          `Recompensa por completar: ${result.rows[0].title}`,
        ],
      )
    }

    res.json({
      message: "Task updated successfully",
      task: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Delete task
router.delete("/:taskId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { taskId } = req.params
    const familyId = req.familyId

    const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND family_id = $2 RETURNING *", [
      taskId,
      familyId,
    ])

    if (result.rows.length === 0) {
      throw createError("Task not found", 404)
    }

    res.json({
      message: "Task deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

// Get task statistics
router.get("/stats", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId

    const result = await pool.query(
      `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN completed = false THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND completed = false THEN 1 END) as overdue_tasks,
        COALESCE(SUM(CASE WHEN completed = true THEN reward ELSE 0 END), 0) as total_rewards_earned
      FROM tasks 
      WHERE family_id = $1
    `,
      [familyId],
    )

    const memberStats = await pool.query(
      `
      SELECT 
        fm.name,
        COUNT(t.*) as total_tasks,
        COUNT(CASE WHEN t.completed = true THEN 1 END) as completed_tasks,
        COALESCE(SUM(CASE WHEN t.completed = true THEN t.reward ELSE 0 END), 0) as rewards_earned
      FROM family_members fm
      LEFT JOIN tasks t ON fm.id = t.assigned_to AND t.family_id = $1
      WHERE fm.family_id = $1
      GROUP BY fm.id, fm.name
      ORDER BY completed_tasks DESC
    `,
      [familyId],
    )

    res.json({
      overview: result.rows[0],
      memberStats: memberStats.rows,
    })
  } catch (error) {
    next(error)
  }
})

export { router as taskRoutes }
