-- =============================================================================
-- SEED: Dados de desenvolvimento
-- Executar manualmente no banco postgres (porta 5433 no host, ou via pgweb em :8090)
-- Banco: aluguel-carro
-- =============================================================================

-- -----------------------------------------------------------------------------
-- LIMPEZA (opcional — descomente se quiser resetar os dados)
-- -----------------------------------------------------------------------------
-- DELETE FROM emprego;
-- DELETE FROM entidade_empregadora;
-- DELETE FROM automovel_imagens;
-- DELETE FROM automoveis;
-- DELETE FROM client;
-- DELETE FROM agent;

-- -----------------------------------------------------------------------------
-- AGENTES (locadores que cadastram veículos)
-- -----------------------------------------------------------------------------
INSERT INTO agent (id, nome, email, password_hash, documento, tipo,
    address_logradouro, address_numero, address_complemento,
    address_bairro, address_cidade, address_estado, address_cep)
VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'AutoLocadora Elite',
    'elite@autolocadora.com',
    -- senha: Senha@123
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    '12345678000195',
    'EMPRESA',
    'Av. Paulista', '1000', 'Conj. 51',
    'Bela Vista', 'São Paulo', 'SP', '01310100'
),
(
    'a1000000-0000-0000-0000-000000000002',
    'João Locador',
    'joao@locador.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    '98765432100',
    'LOCADOR',
    'Rua das Flores', '42', NULL,
    'Centro', 'Campinas', 'SP', '13010100'
),
(
    'a1000000-0000-0000-0000-000000000003',
    'Banco Financiamento S.A.',
    'financiamento@banco.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    '11222333000181',
    'BANCO',
    'Rua Quinze de Novembro', '200', NULL,
    'Centro', 'São Paulo', 'SP', '01013001'
);

-- -----------------------------------------------------------------------------
-- CLIENTES
-- -----------------------------------------------------------------------------
INSERT INTO client (id, nome, email, password_hash, documento, rg, profissao,
    rendimento_total,
    address_logradouro, address_numero, address_complemento,
    address_bairro, address_cidade, address_estado, address_cep)
VALUES
(
    'c1000000-0000-0000-0000-000000000001',
    'Maria Silva',
    'maria@email.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    '11122233344', '12345678X',
    'Engenheira', 8500.00,
    'Rua Vergueiro', '500', 'Apto 12',
    'Liberdade', 'São Paulo', 'SP', '01504000'
),
(
    'c1000000-0000-0000-0000-000000000002',
    'Carlos Pereira',
    'carlos@email.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    '55566677788', '98765432Y',
    'Analista de Sistemas', 6000.00,
    'Av. Brasil', '1200', NULL,
    'Jardim América', 'Rio de Janeiro', 'RJ', '20040020'
),
(
    'c1000000-0000-0000-0000-000000000003',
    'Ana Oliveira',
    'ana@email.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    '99988877766', '11223344Z',
    'Médica', 15000.00,
    'Rua Oscar Freire', '800', 'Casa',
    'Jardins', 'São Paulo', 'SP', '01426001'
);

-- -----------------------------------------------------------------------------
-- ENTIDADES EMPREGADORAS
-- -----------------------------------------------------------------------------
INSERT INTO entidade_empregadora (id, nome, cnpj) VALUES
('e1000000-0000-0000-0000-000000000001', 'TechCorp LTDA',     '11222333000100'),
('e1000000-0000-0000-0000-000000000002', 'MedGroup S.A.',     '44555666000177'),
('e1000000-0000-0000-0000-000000000003', 'DataSoft Sistemas', '77888999000155');

-- -----------------------------------------------------------------------------
-- EMPREGOS (vinculados aos clientes)
-- -----------------------------------------------------------------------------
INSERT INTO emprego (id, rendimento, client_id, empresa_id) VALUES
(gen_random_uuid(), 8500.00, 'c1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001'),
(gen_random_uuid(), 6000.00, 'c1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000003'),
(gen_random_uuid(), 15000.00, 'c1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000002');

-- -----------------------------------------------------------------------------
-- VEÍCULOS (com locador = AutoLocadora Elite)
-- -----------------------------------------------------------------------------
INSERT INTO automoveis (placa, ano, marca, modelo, locador_original_id, proprietario_atual_id, disponivel) VALUES
('ABC1D23', 2022, 'Toyota',     'Corolla',    'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', true),
('DEF4E56', 2023, 'Honda',      'Civic',      'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', true),
('GHI7J89', 2021, 'Volkswagen', 'Golf',       'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', false),
('JKL0M12', 2024, 'BMW',        'Série 3',    'a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', true),
('MNO3P45', 2020, 'Ford',       'Ka Sedan',   'a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', true);

-- -----------------------------------------------------------------------------
-- IMAGENS DOS VEÍCULOS (placeholder URLs do Cloudinary / picsum para seed)
-- Nota: Em produção estas serão URLs reais do Cloudinary.
-- -----------------------------------------------------------------------------
INSERT INTO automovel_imagens (id, automovel_matricula, image_url, image_public_id, ordem)
SELECT
    gen_random_uuid(),
    matricula,
    'https://picsum.photos/seed/car' || matricula || '/800/600',
    'seed-vehicle-' || matricula || '-0',
    0
FROM automoveis;

-- Segunda imagem para alguns veículos
INSERT INTO automovel_imagens (id, automovel_matricula, image_url, image_public_id, ordem)
SELECT
    gen_random_uuid(),
    matricula,
    'https://picsum.photos/seed/car' || matricula || 'b/800/600',
    'seed-vehicle-' || matricula || '-1',
    1
FROM automoveis
WHERE marca IN ('BMW', 'Toyota', 'Honda');

-- -----------------------------------------------------------------------------
-- PEDIDOS DE ALUGUEL
-- -----------------------------------------------------------------------------
INSERT INTO pedidos (id, cliente_id, automovel_matricula, data_inicio, data_fim, valor_total,
    requer_financiamento, banco_id, status_locador, status_geral)
SELECT
    gen_random_uuid(),
    'c1000000-0000-0000-0000-000000000001',
    matricula,
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '14 days',
    750.00,
    false, NULL, 'PENDENTE', 'RASCUNHO'
FROM automoveis WHERE placa = 'ABC1D23';

INSERT INTO pedidos (id, cliente_id, automovel_matricula, data_inicio, data_fim, valor_total,
    requer_financiamento, banco_id, status_locador, status_geral)
SELECT
    gen_random_uuid(),
    'c1000000-0000-0000-0000-000000000002',
    matricula,
    CURRENT_DATE + INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '10 days',
    1200.00,
    false, NULL, 'PENDENTE', 'SUBMETIDO'
FROM automoveis WHERE placa = 'DEF4E56';

INSERT INTO pedidos (id, cliente_id, automovel_matricula, data_inicio, data_fim, valor_total,
    requer_financiamento, banco_id, status_locador, status_geral)
SELECT
    gen_random_uuid(),
    'c1000000-0000-0000-0000-000000000003',
    matricula,
    CURRENT_DATE + INTERVAL '1 days',
    CURRENT_DATE + INTERVAL '30 days',
    4500.00,
    true, NULL, 'APROVADO', 'EM_ANALISE_BANCO'
FROM automoveis WHERE placa = 'JKL0M12';
