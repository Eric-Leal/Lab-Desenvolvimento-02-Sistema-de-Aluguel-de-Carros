-- Garante que uuid-ossp está disponível para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Adiciona DEFAULT gen_random_uuid() na coluna id de pedidos
-- para que o banco gere o UUID caso o ORM não envie
ALTER TABLE pedidos ALTER COLUMN id SET DEFAULT gen_random_uuid();
