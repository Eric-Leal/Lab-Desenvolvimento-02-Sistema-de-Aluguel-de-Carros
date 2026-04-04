
CREATE TABLE emprego (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rendimento DECIMAL(19,2),
    client_id UUID NOT NULL REFERENCES client(id),
    empresa_id UUID NOT NULL REFERENCES entidade_empregadora(id)
);
