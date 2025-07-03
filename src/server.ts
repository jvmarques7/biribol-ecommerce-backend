// src/server.ts
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import produtosRoutes from "./routes/produtos"
import pedidosRoutes from "./routes/pedidos"
import estoqueRoutes from "./routes/estoque"
import usuarioRoutes from "./routes/usuario"
import enderecoRoutes from "./routes/endereco"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/produtos", produtosRoutes)
app.use("/pedidos", pedidosRoutes)
app.use("/estoque", estoqueRoutes)
app.use("/usuario", usuarioRoutes)
app.use("/enderecos", enderecoRoutes)
app.use("/admin/produtos", produtosRoutes)

app.get("/", (_req, res) => {
  res.send("Servidor Biribol Brasil 🏐 rodando!")
})

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`)
})