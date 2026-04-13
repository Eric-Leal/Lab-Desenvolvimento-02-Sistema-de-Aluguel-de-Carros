CREATE TABLE automovel_imagens (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    automovel_matricula BIGINT      NOT NULL REFERENCES automoveis(matricula) ON DELETE CASCADE,
    image_url           VARCHAR(512) NOT NULL,
    image_public_id     VARCHAR(255) NOT NULL,
    ordem               INT         NOT NULL DEFAULT 0,
    criado_em           TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automovel_imagens_matricula ON automovel_imagens(automovel_matricula);
