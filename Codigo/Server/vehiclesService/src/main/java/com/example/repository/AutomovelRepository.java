package com.example.repository;

import com.example.model.Automovel;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface AutomovelRepository extends CrudRepository<Automovel, Long> {

    List<Automovel> findByLocadorOriginalId(UUID locadorOriginalId);

    List<Automovel> findByDisponivel(Boolean disponivel);

    Optional<Automovel> findByPlaca(String placa);
}
