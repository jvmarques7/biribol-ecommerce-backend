import { UUID } from "crypto"
import { Produto } from "./Produto"
import { Pedido } from "./Pedido"

export interface ProdutoPedido {
    id: UUID
    quantidade: number
    produto: Produto
    pedido: Pedido
}