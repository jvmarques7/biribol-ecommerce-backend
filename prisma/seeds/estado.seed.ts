import { PrismaClient } from '@prisma/client';
import estados from './Estados.json';

export async function seedEstados(prisma: PrismaClient) {
  const data = estados.map(estado => ({
    id: Number.parseInt(estado.ID),
    nome: estado.Nome,
    sigla: estado.Sigla
  }));

  await prisma.estado.createMany({
    data,
    skipDuplicates: true
  });

  console.log('→ Unidades Federativas inseridas com sucesso');
}
