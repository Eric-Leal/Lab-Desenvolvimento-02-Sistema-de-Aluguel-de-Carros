
CREATE TABLE entidade_empregadora (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE
);
