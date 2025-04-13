import { Router } from "express"
import { prisma } from "../lib/prisma"
import { verifyToken } from "../middleware/verifyToken"
import { requireRole } from "../middleware/requireRole"

const router = Router()

// GET público
router.get("/", async (_req, res) => {
  const produtos = await prisma.produto.findMany({
    orderBy: { dataCriacao: "desc" },
  })
  res.json(produtos)
})

// POST (ADMIN ou DEV)
router.post(
  "/",
  verifyToken,
  requireRole(["ADMIN", "DEV"]),
  async (req, res) => {
    const { nome, descricao, preco, imagemUrl, estoque } = req.body

    if (!nome || !descricao || !preco || !imagemUrl || estoque == null) {
      res.status(400).json({ erro: "Todos os campos são obrigatórios." })
      return
    }

    const novoProduto = await prisma.produto.create({
      data: { nome, descricao, preco, imagemUrl, estoque },
    })

    res.status(201).json(novoProduto)
  }
)

// PUT (ADMIN ou DEV)
router.put(
  "/:id",
  verifyToken,
  requireRole(["ADMIN", "DEV"]),
  async (req, res) => {
    const { id } = req.params
    const { nome, descricao, preco, imagemUrl, estoque } = req.body

    const produtoExistente = await prisma.produto.findUnique({ where: { id } })
    if (!produtoExistente) {
      res.status(404).json({ erro: "Produto não encontrado." })
      return
    }

    const atualizado = await prisma.produto.update({
      where: { id },
      data: { nome, descricao, preco, imagemUrl, estoque },
    })

    res.json(atualizado)
  }
)

// DELETE (ADMIN ou DEV)
router.delete(
  "/:id",
  verifyToken,
  requireRole(["ADMIN", "DEV"]),
  async (req, res) => {
    const { id } = req.params

    const produto = await prisma.produto.findUnique({ where: { id } })
    if (!produto){
      res.status(404).json({ erro: "Produto não encontrado." })
      return
    }

    await prisma.produto.delete({ where: { id } })
    res.status(204).send()
  }
)

export default router
