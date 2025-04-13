import { UUID } from "crypto"
import { Usuario } from "./Usuario"
import { ProdutoPedido } from "./ProdutoPedido"

export interface Pedido {
    id: UUID
    total: number
    dataCriacao: Date
    dataAlteracao: Date
    produtos: ProdutoPedido[]
    usuario: Usuario
}