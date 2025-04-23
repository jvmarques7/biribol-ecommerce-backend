import { prisma } from "../lib/prisma";

export interface JwtPayload {
    id: string
    email: string
    perfis: string[]
    pessoa: prisma.Pessoa
    pessoaId: string
    // Adicione os campos que você está incluindo no token
  }
  