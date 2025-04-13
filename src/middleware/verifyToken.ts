import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../../types/jwt-payload"


export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    res.status(401).json({ erro: "Token ausente" })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.user = decoded // vamos tipar isso depois
    next()
  } catch {
    res.status(401).json({ erro: "Token inválido" })
    return
  }
}
