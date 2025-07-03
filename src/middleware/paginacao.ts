import { NextFunction, Request, Response } from "express"

export function paginacao(req: Request, res: Response, next: NextFunction) {
    const pagina = parseInt(req.query.page as string) || 1
    const limite = parseInt(req.query.limit as string) || 10
  
    res.locals.paginacao = {
      skip: (pagina - 1) * limite,
      take: limite,
    }
  
    next()
  }
  