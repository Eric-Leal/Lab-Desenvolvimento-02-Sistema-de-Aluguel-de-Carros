CREATE TABLE IF NOT EXISTS pedidos (
    id              UUID        PRIMARY KEY,
    cliente_id      UUID        NOT NULL,
    automovel_matricula BIGINT  NOT NULL,
    data_inicio     DATE        NOT NULL,
    data_fim        DATE        NOT NULL,
    valor_total     NUMERIC(12,2) NOT NULL,
    requer_financiamento BOOLEAN NOT NULL DEFAULT FALSE,
    banco_id        UUID,
    status_locador  VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    status_geral    VARCHAR(30) NOT NULL DEFAULT 'RASCUNHO',
    criado_em       TIMESTAMP   NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMP   NOT NULL DEFAULT NOW()
);
