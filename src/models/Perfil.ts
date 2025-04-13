import { UUID } from "crypto"
import { Usuario } from "./Usuario"

export interface Perfil {
    id: UUID
    nome: string
    usuarios: Usuario[]
}