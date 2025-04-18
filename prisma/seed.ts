import { PrismaClient } from '@prisma/client';
import { seedEstados } from './seeds/estado.seed';
import { seedCidades } from './seeds/cidade.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');
  await seedEstados(prisma);
  await seedCidades(prisma);
  console.log('Seed finalizado com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
