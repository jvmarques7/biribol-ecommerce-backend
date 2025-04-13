import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../../types/jwt-payload"

export function requireRole(rolesPermitidas: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      res.status(401).json({ erro: "Token ausente" })
      return
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      const payload = decoded as JwtPayload

      const possuiPermissao = payload.perfis.some((r) =>
        rolesPermitidas.includes(r)
      )

      if (!possuiPermissao) {
        res.status(403).json({ erro: "Acesso negado para este perfil" })
        return
      }

      req.user = payload
      next()
    } catch (e) {
      res.status(401).json({ erro: "Token inválido" })
      return
    }
  }
}
