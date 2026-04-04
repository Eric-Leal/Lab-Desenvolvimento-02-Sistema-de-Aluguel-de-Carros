
CREATE TABLE agent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    documento VARCHAR(14) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL,
    address_logradouro VARCHAR(255) NOT NULL,
    address_numero VARCHAR(20) NOT NULL,
    address_complemento VARCHAR(255),
    address_bairro VARCHAR(100) NOT NULL,
    address_cidade VARCHAR(100) NOT NULL,
    address_estado VARCHAR(50) NOT NULL,
    address_cep VARCHAR(8) NOT NULL
);
