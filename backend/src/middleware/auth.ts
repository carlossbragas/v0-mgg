import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/database"

export interface AuthRequest extends Request {
  familyId?: string
  userEmail?: string
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, config.jwt.secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }

    req.familyId = decoded.familyId
    req.userEmail = decoded.email
    next()
  })
}

export const generateToken = (familyId: string, email: string): string => {
  return jwt.sign({ familyId, email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
}
