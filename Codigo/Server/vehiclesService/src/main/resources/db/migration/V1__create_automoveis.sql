-- V1: Criação da tabela de automóveis
-- Colunas locador_original_id e proprietario_atual_id são referências lógicas ao agente.id
-- no userService. Não há FK constraint por ser arquitetura de microsserviços.

CREATE TABLE automoveis (
    matricula         BIGSERIAL       PRIMARY KEY,
    placa             VARCHAR(10)     NOT NULL UNIQUE,
    ano               INT             NOT NULL,
    marca             VARCHAR(60)     NOT NULL,
    modelo            VARCHAR(60)     NOT NULL,
    locador_original_id    UUID       NOT NULL,
    proprietario_atual_id  UUID       NOT NULL,
    disponivel        BOOLEAN         NOT NULL DEFAULT TRUE,
    criado_em         TIMESTAMP       NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP       NOT NULL DEFAULT NOW()
);
