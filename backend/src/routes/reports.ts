import { Router } from "express"
import { pool } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"

const router = Router()

// Get financial report
router.get("/financial", authenticateToken, async (req: AuthRequest, res, next) => {
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

    // Get expenses by category
    const expensesByCategory = await pool.query(
      `
      SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM expenses 
      WHERE family_id = $1 ${dateFilter}
      GROUP BY category 
      ORDER BY total DESC
    `,
      [familyId],
    )

    // Get expenses by member
    const expensesByMember = await pool.query(
      `
      SELECT 
        fm.name,
        SUM(e.amount) as total,
        COUNT(e.*) as count
      FROM expenses e
      LEFT JOIN family_members fm ON e.member_id = fm.id
      WHERE e.family_id = $1 ${dateFilter}
      GROUP BY fm.id, fm.name 
      ORDER BY total DESC
    `,
      [familyId],
    )

    // Get daily expenses for chart
    const dailyExpenses = await pool.query(
      `
      SELECT 
        date,
        SUM(amount) as total
      FROM expenses 
      WHERE family_id = $1 ${dateFilter}
      GROUP BY date 
      ORDER BY date
    `,
      [familyId],
    )

    // Get wallet transactions summary
    const walletSummary = await pool.query(
      `
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM wallet_transactions 
      WHERE family_id = $1 ${dateFilter.replace("date", "created_at::date")}
      GROUP BY type
    `,
      [familyId],
    )

    // Get current balances
    const memberBalances = await pool.query(
      `
      SELECT name, balance
      FROM family_members 
      WHERE family_id = $1
      ORDER BY balance DESC
    `,
      [familyId],
    )

    res.json({
      expensesByCategory: expensesByCategory.rows,
      expensesByMember: expensesByMember.rows,
      dailyExpenses: dailyExpenses.rows,
      walletSummary: walletSummary.rows,
      memberBalances: memberBalances.rows,
    })
  } catch (error) {
    next(error)
  }
})

// Get activity report
router.get("/activity", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId

    // Recent activities (last 30 days)
    const recentExpenses = await pool.query(
      `
      SELECT 'expense' as type, e.amount, e.category, e.description, e.created_at, fm.name as member_name
      FROM expenses e
      LEFT JOIN family_members fm ON e.member_id = fm.id
      WHERE e.family_id = $1 AND e.created_at >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY e.created_at DESC
      LIMIT 10
    `,
      [familyId],
    )

    const recentTransactions = await pool.query(
      `
      SELECT 'transaction' as type, wt.amount, wt.type as transaction_type, wt.description, wt.created_at, fm.name as member_name
      FROM wallet_transactions wt
      LEFT JOIN family_members fm ON wt.member_id = fm.id
      WHERE wt.family_id = $1 AND wt.created_at >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY wt.created_at DESC
      LIMIT 10
    `,
      [familyId],
    )

    const recentTasks = await pool.query(
      `
      SELECT 'task' as type, t.title, t.category, t.completed, t.reward, t.created_at, fm.name as member_name
      FROM tasks t
      LEFT JOIN family_members fm ON t.assigned_to = fm.id
      WHERE t.family_id = $1 AND t.created_at >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY t.created_at DESC
      LIMIT 10
    `,
      [familyId],
    )

    // Combine and sort all activities
    const allActivities = [...recentExpenses.rows, ...recentTransactions.rows, ...recentTasks.rows].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    res.json({
      recentActivities: allActivities.slice(0, 20),
    })
  } catch (error) {
    next(error)
  }
})

// Get summary report
router.get("/summary", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId

    // Get family budget
    const familyResult = await pool.query("SELECT budget_monthly FROM families WHERE id = $1", [familyId])

    const monthlyBudget = Number.parseFloat(familyResult.rows[0]?.budget_monthly || 0)

    // Current month expenses
    const monthlyExpenses = await pool.query(
      `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expenses 
      WHERE family_id = $1 
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
    `,
      [familyId],
    )

    const totalExpenses = Number.parseFloat(monthlyExpenses.rows[0].total)

    // Member statistics
    const memberStats = await pool.query(
      `
      SELECT 
        COUNT(*) as total_members,
        COALESCE(SUM(balance), 0) as total_balance
      FROM family_members 
      WHERE family_id = $1
    `,
      [familyId],
    )

    // Task statistics
    const taskStats = await pool.query(
      `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks
      FROM tasks 
      WHERE family_id = $1
    `,
      [familyId],
    )

    // IoT device statistics
    const iotStats = await pool.query(
      `
      SELECT 
        COUNT(*) as total_devices,
        COUNT(CASE WHEN status = true THEN 1 END) as active_devices
      FROM iot_devices 
      WHERE family_id = $1
    `,
      [familyId],
    )

    // Shopping statistics
    const shoppingStats = await pool.query(
      `
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN purchased = true THEN 1 END) as purchased_items
      FROM shopping_items 
      WHERE family_id = $1
    `,
      [familyId],
    )

    res.json({
      budget: {
        monthly: monthlyBudget,
        spent: totalExpenses,
        remaining: monthlyBudget - totalExpenses,
        percentage: monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0,
      },
      members: memberStats.rows[0],
      tasks: taskStats.rows[0],
      iot: iotStats.rows[0],
      shopping: shoppingStats.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

export { router as reportRoutes }
