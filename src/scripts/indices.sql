
-- Criação dos índices nas tabelas
CREATE UNIQUE INDEX idx_usuario_id ON biribol_ecommerce.usuario(id);
CREATE UNIQUE INDEX idx_perfil_id ON biribol_ecommerce.perfil(id);
CREATE UNIQUE INDEX idx_usuario_perfil_id ON biribol_ecommerce.usuario_perfil(id);
CREATE UNIQUE INDEX idx_pessoa_id ON biribol_ecommerce.pessoa(id);
CREATE UNIQUE INDEX idx_produto_id ON biribol_ecommerce.produto(id);
CREATE UNIQUE INDEX idx_pedido_id ON biribol_ecommerce.pedido(id);
CREATE UNIQUE INDEX idx_produto_pedido_id ON biribol_ecommerce.produto_pedido(id);
CREATE UNIQUE INDEX idx_endereco_id ON biribol_ecommerce.endereco(id);
CREATE UNIQUE INDEX idx_estado_id ON biribol_ecommerce.estado(id);
CREATE UNIQUE INDEX idx_cidade_id ON biribol_ecommerce.cidade(id);
CREATE UNIQUE INDEX idx_contato_pessoa_id ON biribol_ecommerce.contato_pessoa(id);
CREATE UNIQUE INDEX idx_tipo_contato_id ON biribol_ecommerce.tipo_contato(id);
CREATE UNIQUE INDEX idx_imagens_produto_id ON biribol_ecommerce.imagens_produto(id);
CREATE UNIQUE INDEX idx_infos_produto_id ON biribol_ecommerce.infos_produto(id);

-- Índices extras para melhorar JOINs
CREATE INDEX idx_usuario_pessoa_id ON biribol_ecommerce.usuario(pessoa_id);
CREATE INDEX idx_usuario_perfil_usuario_id ON biribol_ecommerce.usuario_perfil(usuario_id);
CREATE INDEX idx_usuario_perfil_perfil_id ON biribol_ecommerce.usuario_perfil(perfil_id);
CREATE INDEX idx_produto_criacao_usuario_id ON biribol_ecommerce.produto(criacao_usuario_id);
CREATE INDEX idx_produto_atualizacao_usuario_id ON biribol_ecommerce.produto(atualizacao_usuario_id);
CREATE INDEX idx_produto_exclusao_usuario_id ON biribol_ecommerce.produto(exclusao_usuario_id);
CREATE INDEX idx_pedido_usuario_id ON biribol_ecommerce.pedido(usuario_id);
CREATE INDEX idx_produto_pedido_produto_id ON biribol_ecommerce.produto_pedido(produto_id);
CREATE INDEX idx_produto_pedido_pedido_id ON biribol_ecommerce.produto_pedido(pedido_id);
CREATE INDEX idx_endereco_pessoa_id ON biribol_ecommerce.endereco(pessoa_id);
CREATE INDEX idx_cidade_estado_id ON biribol_ecommerce.cidade(estado_id);
CREATE INDEX idx_contato_pessoa_pessoa_id ON biribol_ecommerce.contato_pessoa(pessoa_id);
CREATE INDEX idx_contato_pessoa_tipo_contato_id ON biribol_ecommerce.contato_pessoa(tipo_contato_id);
CREATE INDEX idx_imagens_produto_produto_id ON biribol_ecommerce.imagens_produto(produto_id);
CREATE INDEX idx_infos_produto_produto_id ON biribol_ecommerce.infos_produto(produto_id);
