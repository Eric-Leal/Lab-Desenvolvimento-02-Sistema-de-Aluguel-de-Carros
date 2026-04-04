package com.example.repository.agent;
import com.example.model.agent.Agent;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;
import java.util.Optional;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface AgentRepository extends CrudRepository<Agent, UUID> {
    Optional<Agent> findByEmail(String email);
    Optional<Agent> findByDocumento(String documento);
}
