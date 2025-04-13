import { Router } from "express"
import { prisma } from "../lib/prisma"
import { verifyToken } from "../middleware/verifyToken"
import { requireRole } from "../middleware/requireRole"

const router = Router()

// Lista todos os estoques (ADMIN/DEV)
router.get("/", verifyToken, requireRole(["ADMIN", "DEV"]), async (_req, res) => {
  const produtos = await prisma.produto.findMany({
    select: {
      id: true,
      nome: true,
      estoque: true,
    },
    orderBy: { nome: "asc" },
  })
  res.json(produtos)
})

// Ajuste manual de estoque (ADMIN/DEV)
router.patch("/:id", verifyToken, requireRole(["ADMIN", "DEV"]), async (req, res) => {
  const { id } = req.params
  const { ajuste } = req.body

  if (typeof ajuste !== "number") {
    res.status(400).json({ erro: "Campo 'ajuste' deve ser numérico." })
    return
  }

  const produto = await prisma.produto.update({
    where: { id },
    data: {
      estoque: {
        increment: ajuste,
      },
    },
    select: {
      id: true,
      nome: true,
      estoque: true,
    },
  })

  res.json(produto)
})

export default router
