-- =========================
-- TABELA: usuario
-- =========================
COMMENT ON TABLE biribol_ecommerce.usuario IS 'Tabela que armazena informações dos usuários do sistema';

COMMENT ON COLUMN biribol_ecommerce.usuario.id IS 'Identificador único do usuário';
COMMENT ON COLUMN biribol_ecommerce.usuario.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN biribol_ecommerce.usuario.email IS 'Endereço de e-mail do usuário (único)';
COMMENT ON COLUMN biribol_ecommerce.usuario.senha IS 'Senha criptografada do usuário';
COMMENT ON COLUMN biribol_ecommerce.usuario.data_criacao IS 'Data de criação do registro de usuário';

-- =========================
-- TABELA: perfil
-- =========================
COMMENT ON TABLE biribol_ecommerce.perfil IS 'Tabela que define os perfis disponíveis no sistema (ex: cliente, admin, desenvolvedor)';

COMMENT ON COLUMN biribol_ecommerce.perfil.id IS 'Identificador único do perfil';
COMMENT ON COLUMN biribol_ecommerce.perfil.nome IS 'Nome/tipo do perfil (enum TipoPerfil)';

-- =========================
-- TABELA: usuario_perfil
-- =========================
COMMENT ON TABLE biribol_ecommerce.usuario_perfil IS 'Tabela associativa entre usuários e perfis (n:n)';

COMMENT ON COLUMN biribol_ecommerce.usuario_perfil.id IS 'Identificador único da associação entre usuário e perfil';
COMMENT ON COLUMN biribol_ecommerce.usuario_perfil.usuario_id IS 'Chave estrangeira para o usuário';
COMMENT ON COLUMN biribol_ecommerce.usuario_perfil.perfil_id IS 'Chave estrangeira para o perfil';

-- =========================
-- TABELA: produto
-- =========================
COMMENT ON TABLE biribol_ecommerce.produto IS 'Tabela que armazena os produtos disponíveis para venda';

COMMENT ON COLUMN biribol_ecommerce.produto.id IS 'Identificador único do produto';
COMMENT ON COLUMN biribol_ecommerce.produto.nome IS 'Nome do produto';
COMMENT ON COLUMN biribol_ecommerce.produto.descricao IS 'Descrição detalhada do produto';
COMMENT ON COLUMN biribol_ecommerce.produto.preco IS 'Preço do produto em reais (R$)';
COMMENT ON COLUMN biribol_ecommerce.produto.imagem_url IS 'URL da imagem do produto';
COMMENT ON COLUMN biribol_ecommerce.produto.estoque IS 'Quantidade disponível em estoque';
COMMENT ON COLUMN biribol_ecommerce.produto.data_criacao IS 'Data de criação do produto';
COMMENT ON COLUMN biribol_ecommerce.produto.data_alteracao IS 'Data da última atualização do produto';

-- =========================
-- TABELA: pedido
-- =========================
COMMENT ON TABLE biribol_ecommerce.pedido IS 'Tabela que registra os pedidos realizados pelos usuários';

COMMENT ON COLUMN biribol_ecommerce.pedido.id IS 'Identificador único do pedido';
COMMENT ON COLUMN biribol_ecommerce.pedido.usuario_id IS 'Chave estrangeira para o usuário';
COMMENT ON COLUMN biribol_ecommerce.pedido.total IS 'Valor total do pedido';
COMMENT ON COLUMN biribol_ecommerce.pedido.data_criacao IS 'Data de criação do pedido';

-- =========================
-- TABELA: produto_pedido
-- =========================
COMMENT ON TABLE biribol_ecommerce.produto_pedido IS 'Tabela associativa entre produtos e pedidos (n:n) com quantidade';

COMMENT ON COLUMN biribol_ecommerce.produto_pedido.id IS 'Identificador único da associação entre produto e pedido';
COMMENT ON COLUMN biribol_ecommerce.produto_pedido.produto_id IS 'Chave estrangeira para o produto';
COMMENT ON COLUMN biribol_ecommerce.produto_pedido.pedido_id IS 'Chave estrangeira para o pedido';
COMMENT ON COLUMN biribol_ecommerce.produto_pedido.quantidade IS 'Quantidade do produto neste pedido';
