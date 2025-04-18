import { prisma } from "../lib/prisma"
import { verifyToken } from "../middleware/verifyToken";
import { isValidCPF } from "../utils/validaCPF";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Router from "express";
import dayjs from "dayjs";

const router = Router()

// REGISTRO DE USUÁRIO COM MÚLTIPLOS PERFIS
router.post("/cadastro", async (req, res) => {
  const { nome, email, senha, perfis, cpf, dataNascimento } = req.body;

  if (!nome || !email || !senha || !cpf || !dataNascimento) {
    res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    return
  }

  // Validar CPF (formato e regra)
  if (!isValidCPF(cpf)) {
    res.status(400).json({ erro: "CPF inválido." });
    return
  }

  // Validar data de nascimento (formato ISO e maior de idade, opcional)
  const dataNasc = dayjs(dataNascimento);
  if (!dataNasc.isValid() || dataNasc.isAfter(dayjs())) {
    res.status(400).json({ erro: "Data de nascimento inválida." });
    return
  }

  const [usuarioExistente, cpfExistente] = await Promise.all([
    prisma.usuario.findUnique({ where: { email } }),
    prisma.pessoaFisica.findUnique({ where: { cpf } }),
  ]);

  if (usuarioExistente) {
    res.status(400).json({ erro: "E-mail já cadastrado." });
    return
  }

  if (cpfExistente) {
    res.status(400).json({ erro: "CPF já cadastrado." });
    return
  }

  const perfisEncontrados = await prisma.perfil.findMany({
    where: {
      nome: {
        in: perfis && perfis.length ? perfis : ["CLIENTE"],
      },
    },
  });

  if (!perfisEncontrados.length) {
    res.status(400).json({ erro: "Nenhum perfil válido foi informado." });
    return
  }

  const senhaHash = await bcrypt.hash(senha, 10);

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
      pessoaFisica: {
        create: {
          nome,
          cpf,
          dataNascimento: new Date(dataNascimento),
        },
      },
    },
    include: {
      perfis: {
        include: { perfil: true },
      },
      pessoaFisica: true
    },
  });

  res.status(201).json({
    id: novoUsuario.id,
    nome: novoUsuario.nome,
    email: novoUsuario.email,
    perfis: novoUsuario.perfis.map((p) => p.perfil.nome),
    dataCriacao: novoUsuario.dataCriacao,
    pessoaFisica: {
      id: novoUsuario.pessoaFisica.id,
      nome: novoUsuario.pessoaFisica.nome,
      cpf: novoUsuario.pessoaFisica.cpf,
      dataNascimento: novoUsuario.pessoaFisica.dataNascimento
    }
  });
  return
});
  

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

router.get("/me", verifyToken, async (req, res) => {
  const usuarioId = req.user?.id;

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      perfis: {
        include: {
          perfil: true,
        },
      },
      pessoaFisica: true
    },
  });

  if (!usuario) {
    res.status(404).json({ erro: "Usuário não encontrado." });
    return
  }

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfis: usuario.perfis.map((p) => p.perfil.nome),
    pessoaFisica: usuario.pessoaFisica
  });
});
  
export default router