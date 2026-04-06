-- V1: Criação da tabela de reservas
-- Colunas veiculo_id e pedido_id são referências lógicas a outros microsserviços.
-- Não há FK constraint por ser arquitetura de microsserviços.

CREATE TABLE reservas (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id      BIGINT          NOT NULL,           -- Referência lógica para MS-B (vehiclesService)
    pedido_id       UUID            NOT NULL,           -- Referência lógica para MS-C (rentalsService)
    data_inicio     DATE            NOT NULL,
    data_fim        DATE            NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'DISPONIVEL',  -- DISPONIVEL|BLOQUEADO|ATIVO|ENCERRADO
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Index para query crítica de overlap (performance)
CREATE INDEX idx_reservas_overlap 
    ON reservas(veiculo_id, data_inicio, data_fim) 
    WHERE status != 'ENCERRADO';

-- Index para busca por pedido_id
CREATE INDEX idx_reservas_pedido 
    ON reservas(pedido_id);

-- Index para busca por status
CREATE INDEX idx_reservas_status 
    ON reservas(status);
