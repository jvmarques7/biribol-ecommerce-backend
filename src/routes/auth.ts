import { prisma } from "../lib/prisma"
import { verifyToken } from "../middleware/verifyToken";
import { isValidCNPJ, isValidCPF } from "../utils/validador";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Router from "express";
import dayjs from "dayjs";

const router = Router()

// REGISTRO DE USUÁRIO COM MÚLTIPLOS PERFIS
router.post("/cadastro", async (req, res) => {
  const {
    nome,
    email,
    senha,
    perfis,
    pessoaJuridica = false,
    cpf,
    dataNascimento,
    cnpj,
    razaoSocial
  } = req.body

  // 🔒 Validação condicional
  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Campos obrigatórios ausentes." })
    return
  }

  if (pessoaJuridica) {
    if (!cnpj || !razaoSocial) {
      res.status(400).json({ erro: "CNPJ e razão social são obrigatórios para pessoa jurídica." })
      return
    }
    if (!isValidCNPJ(cnpj)) {
      res.status(400).json({ erro: "CNPJ inválido." })
      return
    }
  } else {
    if (!cpf || !dataNascimento) {
      res.status(400).json({ erro: "CPF e data de nascimento são obrigatórios para pessoa física." })
      return
    }

    if (!isValidCPF(cpf)) {
      res.status(400).json({ erro: "CPF inválido." })
      return
    }

    const dataNasc = dayjs(dataNascimento)
    if (!dataNasc.isValid() || dataNasc.isAfter(dayjs())) {
      res.status(400).json({ erro: "Data de nascimento inválida." })
      return
    }
  }

  // 🔍 Checa duplicidade de email/cpf/cnpj
  const [usuarioExistente, pessoaExistente] = await Promise.all([
    prisma.usuario.findUnique({ where: { email } }),
    prisma.pessoa.findFirst({
      where: pessoaJuridica
        ? { cnpj }
        : { cpf },
    }),
  ])

  if (usuarioExistente) {
    res.status(400).json({ erro: "E-mail já cadastrado." })
    return
  }

  if (pessoaExistente) {
    res.status(400).json({
      erro: pessoaJuridica ? "CNPJ já cadastrado." : "CPF já cadastrado.",
    })
    return
  }

  const perfisEncontrados = await prisma.perfil.findMany({
    where: {
      descricao: {
        in: perfis && perfis.length ? perfis : ["CLIENTE"],
      },
    },
  })

  if (!perfisEncontrados.length) {
    res.status(400).json({ erro: "Nenhum perfil válido foi informado." })
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
      pessoa: {
        create: {
          nome,
          pessoaJuridica,
          cpf: !pessoaJuridica ? cpf : null,
          dataNascimento: !pessoaJuridica ? new Date(dataNascimento) : null,
          cnpj: pessoaJuridica ? cnpj : null,
          razaoSocial: pessoaJuridica ? razaoSocial : null,
        },
      },
    },
    include: {
      perfis: {
        include: { perfil: true },
      },
      pessoa: true,
    },
  })

  const response = {
    id: novoUsuario.id,
    nome: novoUsuario.nome,
    email: novoUsuario.email,
    perfis: novoUsuario.perfis.map((p) => p.perfil.descricao),
    dataCriacao: novoUsuario.dataCriacao,
    pessoa: {
      id: novoUsuario.pessoa?.id,
      nome: novoUsuario.pessoa?.nome,
      cpf: novoUsuario.pessoa?.cpf,
      cnpj: novoUsuario.pessoa?.cnpj,
      dataNascimento: novoUsuario.pessoa?.dataNascimento,
      razaoSocial: novoUsuario.pessoa?.razaoSocial,
      pessoaJuridica: novoUsuario.pessoa?.pessoaJuridica,
    },
  }

  res.status(201).json(response)
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

  const perfis = usuario.perfis.map((p) => p.perfil.descricao)

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