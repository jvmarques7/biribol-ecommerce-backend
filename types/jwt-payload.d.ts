import { prisma } from "../lib/prisma";

export interface JwtPayload {
    id: string
    email: string
    perfis: string[]
    pessoaFisica: prisma.pessoaFisica
    pessoaFisicaId: string
    // Adicione os campos que você está incluindo no token
  }
  