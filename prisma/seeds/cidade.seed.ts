import { PrismaClient } from '@prisma/client';
import cidades from './Cidades.json';

export async function seedCidades(prisma: PrismaClient) {
  const data = cidades.map(cidade => ({
    id: Number.parseInt(cidade.ID),
    descricao: cidade.Nome,
    estadoId: Number.parseInt(cidade.Estado)
  }));

  await prisma.cidade.createMany({
    data,
    skipDuplicates: true
  });

  console.log('→ Cidades inseridas com sucesso');
}
