import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

const enderecoSchema = z.object({
    nomeDestinatario: z.string().min(3),
    tipoEndereco: z.enum(["Residencial", "Trabalho"]),
    info: z.string().max(255).optional(),
  
    cep: z.string().min(8),
    rua: z.string(),
    numero: z.string().optional(),
    complemento: z.string().max(255).optional(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string(),
  });

router.get("/", verifyToken, async (req, res) => {
    const pessoaFisicaId = req.user?.pessoaFisica?.id;
  
    const enderecos = await prisma.endereco.findMany({
      where: { pessoaFisicaId },
      orderBy: { dataCriacao: "desc" },
    });
  
    res.json(enderecos);
    return
  });

router.post("/", verifyToken, async (req, res) => {
  const pessoaFisicaId = req.body.pessoaFisica?.id;

  const validacao = enderecoSchema.safeParse(req.body);
  if (!validacao.success) {
    res.status(400).json({ erro: "Dados inválidos." });
    return
  }

  const entidadeSalvar = validacao.data
  const endereco = await prisma.endereco.create({
    data: {
        cep: entidadeSalvar.cep,
        bairro: entidadeSalvar.bairro,
        rua: entidadeSalvar.rua,
        complemento: entidadeSalvar.complemento,
        numero: entidadeSalvar.numero,
        cidade: entidadeSalvar.cidade,
        estado: entidadeSalvar.estado,
        pessoaFisicaId: pessoaFisicaId,
        nomeDestinatario: entidadeSalvar.nomeDestinatario,
        info: entidadeSalvar.info,
        tipoEndereco: entidadeSalvar.tipoEndereco
    },
  });

  res.status(201).json({ mensagem: "Endereço criado com sucesso", endereco });
  return
});

router.put("/:id", verifyToken, async (req, res) => {
    const pessoaFisicaId = req.body.pessoaFisica?.id;
    const enderecoId = req.params.id;
  
    //console.log(req.body)
    const validacao = enderecoSchema.safeParse(req.body);
    if (!validacao.success) {
      console.log(validacao.error)
      res.status(400).json({ erro: "Dados inválidos." });
      return
    }
  
    const endereco = await prisma.endereco.findUnique({
      where: { id: enderecoId },
    });
  
    if (!endereco || endereco.pessoaFisicaId !== pessoaFisicaId) {
      res.status(403).json({ erro: "Endereço não encontrado ou acesso negado." });
      return
    }

    const entidadeSalvar = validacao.data
    const atualizado = await prisma.endereco.update({
      where: { id: enderecoId },
      data: {
        cep: entidadeSalvar.cep,
        bairro: entidadeSalvar.bairro,
        rua: entidadeSalvar.rua,
        complemento: entidadeSalvar.complemento,
        numero: entidadeSalvar.numero,
        cidade: entidadeSalvar.cidade,
        estado: entidadeSalvar.estado,
        pessoaFisicaId: pessoaFisicaId,
        nomeDestinatario: entidadeSalvar.nomeDestinatario,
        info: entidadeSalvar.info,
        tipoEndereco: entidadeSalvar.tipoEndereco
      }
    });
  
    res.json({ mensagem: "Endereço atualizado com sucesso", endereco: atualizado });
    return
});

router.delete("/:id", verifyToken, async (req, res) => {
    //const pessoaFisicaId = req.user?.pessoaFisica?.id;
    const enderecoId = req.params.id;

    // Verifica se o endereço pertence ao usuário
    const endereco = await prisma.endereco.findUnique({
        where: { id: enderecoId },
    });

    await prisma.endereco.delete({ where: { id: enderecoId } });

    res.json({ mensagem: "Endereço removido com sucesso." });
    return
});

router.patch("/:id/padrao", verifyToken, async (req, res) => {
    const enderecoId = req.params.id;
  
    const endereco = await prisma.endereco.findUnique({
      where: { id: enderecoId },
    });

    const pessoaFisicaId = endereco.pessoaFisicaId
  
    // Desmarcar todos os outros endereços do usuário
    await prisma.endereco.updateMany({
      where: { pessoaFisicaId },
      data: { padrao: false },
    });
  
    // Marcar o selecionado como principal
    await prisma.endereco.update({
      where: { id: enderecoId },
      data: { padrao: true },
    });
  
    res.json({ mensagem: "Endereço definido como principal." });
    return
});

export default router;
