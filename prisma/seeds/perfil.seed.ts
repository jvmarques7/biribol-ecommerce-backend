import { PrismaClient } from "@prisma/client";

// PERFIS
export async function seedPerfil(prisma: PrismaClient){
    await prisma.perfil.createMany({
        data: [
        { id: 1n, descricao: 'ADMIN' },
        { id: 2n, descricao: 'CLIENTE' },
        { id: 3n, descricao: 'DEV' }
        ],
        skipDuplicates: true // Não cria se já existir
    })
}