import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { paginacao } from '../middleware/paginacao'
import { z } from "zod"
import { verifyToken } from '../middleware/verifyToken'

const router = Router()
const prisma = new PrismaClient()
const produtoSchema = z.object({
  nome: z.string().min(2, "Nome inválido"),
  descricao: z.string().min(5, "Descrição inválida"),
  preco: z.number().nonnegative("Preço não pode ser negativo"),
  marca: z.string().min(2, "Marca inválida"),
  estoque: z.number().int().nonnegative("Estoque não pode ser negativo"),
  modelo: z.string().optional(),
  cor: z.string().optional(),
})

router.post("/", verifyToken, async (req, res) => {
  const usuarioId = req.user?.id

  const bodyValidation = produtoSchema.safeParse(req.body)

  if (!bodyValidation.success) {
    res.status(400).json({ erro: "Dados inválidos", detalhes: bodyValidation.error.errors })
    return
  }

  const { nome, descricao, preco, marca, estoque, modelo, cor } = bodyValidation.data

  try {
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        marca,
        estoque,
        modelo,
        cor,
        criacaoUsuarioId: usuarioId,
      },
    })

    res.status(201).json(produto)
    return
  } catch {
    res.status(500).json({ erro: "Erro ao cadastrar produto." })
    return
  }
})

router.get('/', paginacao, async (req, res) => {
  const { nome, marca, semEstoque, incluirExcluidos } = req.query
  const { skip, take } = res.locals.paginacao

  const filtros: any = {}

  if (nome) {
    filtros.nome = { contains: nome, mode: 'insensitive' }
  }

  if (marca) {
    filtros.marca = { contains: marca, mode: 'insensitive' }
  }

  if (semEstoque === 'true') {
    filtros.estoque = 0
  }

  if (incluirExcluidos !== 'true') {
    filtros.excluido = false
  }

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where: filtros,
      skip,
      take,
      orderBy: { dataCriacao: 'desc' },
    }),
    prisma.produto.count({ where: filtros })
  ])

  res.json({
    dados: produtos,
    total,
    paginaAtual: Math.floor(skip / take) + 1,
    totalPaginas: Math.ceil(total / take)
  })
})

export default router