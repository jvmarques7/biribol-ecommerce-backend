import { UUID } from "crypto"
import { Perfil } from "./Perfil"
import { Pedido } from "./Pedido"

export interface Usuario {
    id: UUID
    nome: string
    email: String
    senha: String
    dataCriacao: Date
    perfis: Perfil[]
    pedidos: Pedido[]
}