package com.example.repository.client;

import com.example.model.client.Emprego;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface EmpregoRepository extends CrudRepository<Emprego, UUID> {
    List<Emprego> findByClientId(UUID clientId);
}
