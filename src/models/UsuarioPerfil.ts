import { UUID } from "crypto"
import { Usuario } from "./Usuario"
import { Perfil } from "./Perfil"

export interface UsuarioPerfil {
    id: UUID
    perfil: Perfil
    usuarios: Usuario
}