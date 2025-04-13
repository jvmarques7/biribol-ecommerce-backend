import { Router } from "express"
import { prisma } from "../lib/prisma"
import { verifyToken } from "../middleware/verifyToken"
import { requireRole } from "../middleware/requireRole"
import { ProdutoPedido } from "@prisma/client"

const router = Router()

// Cliente faz pedido
router.post("/", verifyToken, requireRole(["CLIENTE", "ADMIN", "DEV"]), async (req, res) => {
  const { itens } = req.body
  const usuarioId = req.user?.id

  if (!Array.isArray(itens) || !itens.length) {
    res.status(400).json({ erro: "Itens do pedido são obrigatórios." })
    return
  }

  const produtos = await prisma.produto.findMany({
    where: { id: { in: itens.map((i) => i.produtoId) } },
  })

  const itensPedido = itens.map((item) => {
    const produto = produtos.find((p) => p.id === item.produtoId)
    if (!produto) throw new Error("Produto inválido")

    var produtoPedido

    produtoPedido.produtoId = produto.id
    produtoPedido.quantidade = item.quantidade
    produtoPedido.preco = produto.preco

    return produtoPedido
  })

  const total = itensPedido.reduce(
    (acc, item) => acc + item.quantidade * item.preco,
    0
  )

  // Verifica se há estoque suficiente
for (const item of itensPedido) {
    const produto = produtos.find((p) => p.id === item.produtoId)
    if (produto!.estoque < item.quantidade) {
      res.status(400).json({
        erro: `Estoque insuficiente para o produto: ${produto!.nome}`,
      })
      return
    }
  }
  
  // Atualiza estoque
  /*for (const item of itensPedido) {
    await prisma.produto.update({
      where: { id: item.produtoId },
      data: {
        estoque: {
          decrement: item.quantidade,
        },
      },
    })
  }*/

  var produtosPedido: ProdutoPedido[]
  itensPedido.forEach((item)=>{
    var produtoPedido: ProdutoPedido
    produtoPedido.produtoId = item.produtoId
    produtosPedido.push(produtoPedido)
  })

  const pedido = await prisma.pedido.create({
    data: {
      usuarioId: usuarioId!,
      total,
      produtos: {
        create: produtosPedido,
      },
    },
    include: {
      produtos: true,
    },
  })

  res.status(201).json(pedido)
  return
})

// Admin/Dev: ver todos os pedidos
router.get("/", verifyToken, requireRole(["ADMIN", "DEV"]), async (_req, res) => {
  const pedidos = await prisma.pedido.findMany({
    include: {
      usuario: true,
      produtos: {
        include: {
          produto: true,
        },
      },
    },
    orderBy: { dataCriacao: "desc" },
  })

  res.json(pedidos)
  return
})

// Cliente: ver seus próprios pedidos
router.get("/meus", verifyToken, requireRole(["CLIENTE", "ADMIN", "DEV"]), async (req, res) => {
  const userId = req.user?.id

  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: userId },
    include: {
      produtos: {
        include: {
          produto: true,
        },
      },
    },
    orderBy: { dataCriacao: "desc" },
  })

  res.json(pedidos)
  return
})

export default router
