import { Router } from "express"
import { pool } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { createError } from "../middleware/errorHandler"

const router = Router()

// Get all IoT devices
router.get("/devices", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId
    const { room, type } = req.query

    let query = "SELECT * FROM iot_devices WHERE family_id = $1"
    const params: any[] = [familyId]
    let paramCount = 1

    if (room) {
      paramCount++
      query += ` AND room = $${paramCount}`
      params.push(room)
    }

    if (type) {
      paramCount++
      query += ` AND type = $${paramCount}`
      params.push(type)
    }

    query += " ORDER BY created_at DESC"

    const result = await pool.query(query, params)

    res.json({
      devices: result.rows,
    })
  } catch (error) {
    next(error)
  }
})

// Add new IoT device
router.post("/devices", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, type, room, brightness = 100, temperature = 22 } = req.body
    const familyId = req.familyId

    if (!name || !type || !room) {
      throw createError("Device name, type and room are required", 400)
    }

    const result = await pool.query(
      "INSERT INTO iot_devices (family_id, name, type, room, brightness, temperature) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [familyId, name, type, room, brightness, temperature],
    )

    res.status(201).json({
      message: "Device added successfully",
      device: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Update IoT device
router.put("/devices/:deviceId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { deviceId } = req.params
    const { name, status, brightness, temperature, is_online } = req.body
    const familyId = req.familyId

    const result = await pool.query(
      `UPDATE iot_devices SET 
        name = COALESCE($1, name),
        status = COALESCE($2, status),
        brightness = COALESCE($3, brightness),
        temperature = COALESCE($4, temperature),
        is_online = COALESCE($5, is_online)
      WHERE id = $6 AND family_id = $7 RETURNING *`,
      [name, status, brightness, temperature, is_online, deviceId, familyId],
    )

    if (result.rows.length === 0) {
      throw createError("Device not found", 404)
    }

    res.json({
      message: "Device updated successfully",
      device: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
})

// Delete IoT device
router.delete("/devices/:deviceId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { deviceId } = req.params
    const familyId = req.familyId

    const result = await pool.query("DELETE FROM iot_devices WHERE id = $1 AND family_id = $2 RETURNING *", [
      deviceId,
      familyId,
    ])

    if (result.rows.length === 0) {
      throw createError("Device not found", 404)
    }

    res.json({
      message: "Device deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

// Get device statistics
router.get("/stats", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const familyId = req.familyId

    const result = await pool.query(
      `
      SELECT 
        COUNT(*) as total_devices,
        COUNT(CASE WHEN status = true THEN 1 END) as active_devices,
        COUNT(CASE WHEN is_online = true THEN 1 END) as online_devices,
        COUNT(DISTINCT room) as rooms_count,
        COUNT(DISTINCT type) as device_types
      FROM iot_devices 
      WHERE family_id = $1
    `,
      [familyId],
    )

    const roomStats = await pool.query(
      `
      SELECT room, COUNT(*) as count
      FROM iot_devices 
      WHERE family_id = $1 
      GROUP BY room 
      ORDER BY count DESC
    `,
      [familyId],
    )

    const typeStats = await pool.query(
      `
      SELECT type, COUNT(*) as count
      FROM iot_devices 
      WHERE family_id = $1 
      GROUP BY type 
      ORDER BY count DESC
    `,
      [familyId],
    )

    res.json({
      overview: result.rows[0],
      roomStats: roomStats.rows,
      typeStats: typeStats.rows,
    })
  } catch (error) {
    next(error)
  }
})

export { router as iotRoutes }
