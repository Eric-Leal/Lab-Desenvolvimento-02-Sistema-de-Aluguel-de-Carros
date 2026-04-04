package com.example.repository.client;

import com.example.model.client.Client;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import java.util.Optional;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface ClientRepository extends CrudRepository<Client, UUID> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByDocumento(String documento);
}