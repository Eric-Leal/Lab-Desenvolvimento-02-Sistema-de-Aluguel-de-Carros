package com.example.repository;

import com.example.model.AutomovelImagem;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface AutomovelImagemRepository extends CrudRepository<AutomovelImagem, UUID> {

    List<AutomovelImagem> findByAutomovelMatricula(Long automovelMatricula);

    long countByAutomovelMatricula(Long automovelMatricula);
}
