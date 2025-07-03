import { PrismaClient } from '@prisma/client';
import { seedEstados } from './seeds/estado.seed';
import { seedCidades } from './seeds/cidade.seed';
import { seedPerfil } from './seeds/perfil.seed';
import * as fs from "fs"
import * as path from "path"

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...')
  await seedEstados(prisma)
  await seedCidades(prisma)
  await seedPerfil(prisma)
  
  // CRIAR ÍNDICES (ler arquivo indices.sql)
  const indicesSqlPath = path.join(__dirname, '..', 'src', 'scripts', 'indices.sql')
  const indicesSql = fs.readFileSync(indicesSqlPath, 'utf-8')

  // Divide o SQL em comandos separados
  const comandos = indicesSql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0)

  console.log('🛠️ Aplicando índices manualmente...')
  for (const comando of comandos) {
    await prisma.$executeRawUnsafe(comando)
  }
  console.log('✅ Índices aplicados com sucesso!')

}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
