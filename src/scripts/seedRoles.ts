import { prisma } from "../lib/prisma"

async function main() {
  const perfis = ["CLIENTE", "ADMIN", "DEV"]

  for (const nome of perfis) {
    await prisma.perfil.upsert({
      where: { nome: nome as any },
      update: {},
      create: { nome: nome as any },
    })
  }

  console.log("Perfis cadastrados com sucesso!")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
