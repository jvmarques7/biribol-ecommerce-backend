import { Router } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../middleware/verifyToken";
import { atualizarEmailSchema } from "../validators/validadorUsuario";

const router = Router();

// GET /usuario → Retorna dados completos do usuário logado
router.get("/", verifyToken, async (req, res) => {
    const usuarioId = req.user?.id;
  
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: {
          perfis: {
            include: { perfil: true },
          },
          pessoaFisica: {
            include: {
              enderecos: {
                orderBy: [
                  {padrao: 'desc'},
                  {id: 'desc'}
              ],
              },
              contatos: {
                include: {
                  tipoContato: true,
                },
              },
            }
          }
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
        perfis: usuario.perfis.map(p => p.perfil.nome),
        pessoaFisica: {
          id: usuario.pessoaFisicaId,
          nome: usuario.pessoaFisica?.nome,
          cpf: usuario.pessoaFisica?.cpf,
          dataNascimento: usuario.pessoaFisica?.dataNascimento,
          enderecos: usuario.pessoaFisica.enderecos.map(end => ({
            id: end.id,
            rua: end.rua,
            numero: end.numero,
            bairro: end.bairro,
            complemento: end.complemento,
            cep: end.cep,
            cidade: end.cidade,
            estado: end.estado,
            nomeDestinatario: end.nomeDestinatario,
            tipoEndereco: end.tipoEndereco,
            info: end.info,
            padrao: end.padrao
          })),
          contatos: usuario.pessoaFisica.contatos.map(c => ({
            tipo: c.tipoContato.nome,
            valor: c.valor,
          })),
        },
        
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao carregar dados do perfil." });
    }
  });
  

// PUT /usuario → Atualiza nome
router.put("/", verifyToken, async (req, res) => {
  const usuarioId = req.user?.id;
  const { nome } = req.body;

  if (!nome) {
    res.status(400).json({ erro: "Nome obrigatório." });
    return
  }

  const atualizado = await prisma.usuario.update({
    where: { id: usuarioId },
    data: { 
        nome,
        pessoaFisica: nome ? { update: { nome: nome } }
        : undefined
     },
     include: {pessoaFisica: true}
  });

  res.json({ mensagem: "Nome atualizado.", nome: atualizado.nome });
});

// PUT /usuario/email → Atualiza e-mail
router.put("/email", verifyToken, async (req, res) => {
  const usuarioId = req.user?.id;

  const resultado = atualizarEmailSchema.safeParse(req.body);

  if (!resultado.success) {
    const erro = resultado.error.format().email?._errors[0] || "Erro de validação.";
    res.status(400).json({ erro });
    return
  }

  const { email } = resultado.data;

  const emailExistente = await prisma.usuario.findUnique({ where: { email } });
  if (emailExistente && emailExistente.id !== usuarioId) {
    res.status(400).json({ erro: "Este e-mail já está em uso." });
    return
  }

  const atualizado = await prisma.usuario.update({
    where: { id: usuarioId },
    data: { email },
  });

  res.json({ mensagem: "E-mail atualizado.", email: atualizado.email });
});

export default router;
