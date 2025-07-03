import { PrismaClient } from '@prisma/client';
import estados from './Estados.json';

export async function seedEstados(prisma: PrismaClient) {
  const data = estados.map(estado => ({
    id: Number.parseInt(estado.ID),
    sigla: estado.Sigla,
    descricao: estado.Nome
  }));

  await prisma.estado.createMany({
    data,
    skipDuplicates: true
  });

  console.log('→ Estados inseridas com sucesso');
}
