import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Router } from "express";

const router = Router()

// REGISTRO DE USUÁRIO COM MÚLTIPLOS PERFIS
router.post("/register", async (req, res) => {
  const { nome, email, senha, perfis } = req.body

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Campos obrigatórios ausentes." })
    return
  }

  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } })
  if (usuarioExistente) {
    res.status(400).json({ erro: "E-mail já cadastrado." })
    return
  }

  // Buscar os perfis pelo nome no banco
  const perfisEncontrados = await prisma.perfil.findMany({
    where: {
      nome: {
        in: perfis && perfis.length ? perfis : ["CLIENTE"],
      },
    },
  })

  if (!perfisEncontrados.length) {
    res.status(400).json({ erro: "Nenhuma role válida foi informada." })
    return
  }

  const senhaHash = await bcrypt.hash(senha, 10)

  const novoUsuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
      perfis: {
        create: perfisEncontrados.map((perfil) => ({
          perfil: { connect: { id: perfil.id } },
        })),
      },
    },
    include: {
      perfis: {
        include: {
          perfil: true,
        },
      },
    },
  })

  res.status(201).json({
    id: novoUsuario.id,
    nome: novoUsuario.nome,
    email: novoUsuario.email,
    perfis: novoUsuario.perfis.map((p) => p.perfil.nome),
    dataCriacao: novoUsuario.data_criacao,
  })
  return
})
  

// Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: {
      perfis: {
        include: {
          perfil: true,
        },
      },
    },
  })

  if (!usuario) {
    res.status(401).json({ erro: "Usuário não encontrado" })
    return
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
  if (!senhaCorreta) {
    res.status(401).json({ erro: "Senha incorreta" })
    return
  }

  const perfis = usuario.perfis.map((p) => p.perfil.nome)

  const token = jwt.sign(
    {
      id: usuario.id,
      perfis: perfis,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  )

  res.json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfis,
    },
  })
  return
})
  
export default router