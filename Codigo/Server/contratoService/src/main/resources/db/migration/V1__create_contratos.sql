CREATE TABLE contratos (
  id UUID PRIMARY KEY,
  cliente_id BIGINT NOT NULL,
  veiculo_id BIGINT NOT NULL,
  pedido_id UUID NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  valor_diario DECIMAL(10, 2) NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  valor_entrada DECIMAL(10, 2) NOT NULL,
  valor_restante DECIMAL(10, 2),
  status VARCHAR(50) NOT NULL,
  score_financeiro VARCHAR(50),
  motivo TEXT,
  reserva_id UUID,
  criado_em TIMESTAMP NOT NULL,
  atualizado_em TIMESTAMP NOT NULL
);

CREATE INDEX idx_contrato_cliente ON contratos(cliente_id);
CREATE INDEX idx_contrato_veiculo ON contratos(veiculo_id);
CREATE INDEX idx_contrato_pedido ON contratos(pedido_id);
CREATE INDEX idx_contrato_status ON contratos(status);
