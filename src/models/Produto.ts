import { UUID } from "crypto"
import { ProdutoPedido } from "./ProdutoPedido"

export interface Produto {
    id: UUID
    nome: string
    descricao: String
    preco: Number
    imagem_url: String
    dataCriacao: Date
    dataAlteracao: Date
    produtoPedido: ProdutoPedido[]
}