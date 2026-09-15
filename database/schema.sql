CREATE TABLE usuario (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(120) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    senha_hash      VARCHAR(255) NOT NULL,
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('proprietario', 'estudante')),
    telefone        VARCHAR(20),
    media_estrelas  NUMERIC(2,1),
    data_cadastro   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE imovel (
    id                SERIAL PRIMARY KEY,
    proprietario_id   INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    titulo             VARCHAR(150) NOT NULL,
    localizacao       TEXT NOT NULL,
    preco_mensal      NUMERIC(10,2) NOT NULL,
    tipo              VARCHAR(20) NOT NULL CHECK (tipo IN ('kitnet', 'quarto', 'republica', 'apartamento', 'casa')),
    vagas_disponiveis INT NOT NULL DEFAULT 1,
    mobiliado         BOOLEAN NOT NULL DEFAULT FALSE,
    disponivel        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE foto (
    id        SERIAL PRIMARY KEY,
    imovel_id INT NOT NULL REFERENCES imovel(id) ON DELETE CASCADE,
    url       VARCHAR(255) NOT NULL,
    ordem     INT DEFAULT 0
);

CREATE TABLE grupo (
    id           SERIAL PRIMARY KEY,
    nome_grupo   VARCHAR(100) NOT NULL,
    imovel_id    INT REFERENCES imovel(id) ON DELETE SET NULL,
    lider_id     INT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE membro (
    id         SERIAL PRIMARY KEY,
    grupo_id   INT NOT NULL REFERENCES grupo(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    ativo      BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(grupo_id, usuario_id)
);

CREATE TABLE solicitacao (
    id                SERIAL PRIMARY KEY,
    usuario_id        INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    imovel_id         INT NOT NULL REFERENCES imovel(id) ON DELETE CASCADE,
    grupo_id          INT REFERENCES grupo(id) ON DELETE SET NULL,
    tipo_solicitante  VARCHAR(20) NOT NULL CHECK (tipo_solicitante IN ('individual', 'grupo')),
    status            VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada', 'cancelada')),
    mensagem          TEXT,
    data_solicitacao  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE avaliacao (
    id             SERIAL PRIMARY KEY,
    autor_id        INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    alvo_id         INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    nota            INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario      TEXT,
    data_avaliacao  TIMESTAMP NOT NULL DEFAULT NOW(),
    CHECK (autor_id <> alvo_id)
);