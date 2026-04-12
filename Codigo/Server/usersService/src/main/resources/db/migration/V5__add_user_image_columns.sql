ALTER TABLE client
    ADD COLUMN image_url VARCHAR(512),
    ADD COLUMN image_public_id VARCHAR(255);

ALTER TABLE agent
    ADD COLUMN image_url VARCHAR(512),
    ADD COLUMN image_public_id VARCHAR(255);
