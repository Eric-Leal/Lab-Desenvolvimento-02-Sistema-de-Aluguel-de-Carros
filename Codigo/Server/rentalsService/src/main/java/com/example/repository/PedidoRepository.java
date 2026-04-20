package com.example.repository;

import com.example.model.Pedido;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface PedidoRepository extends CrudRepository<Pedido, UUID> {

    List<Pedido> findByClienteId(UUID clienteId);

    List<Pedido> findByAutomovelMatricula(Long automovelMatricula);

    List<Pedido> findByAutomovelMatriculaIn(List<Long> matriculas);

    List<Pedido> findByStatusGeral(String statusGeral);

    List<Pedido> findByStatusLocadorAndAutomovelMatriculaIn(String statusLocador, List<Long> matriculas);

    List<Pedido> findByStatusGeralAndAutomovelMatriculaIn(String statusGeral, List<Long> matriculas);

    List<Pedido> findByStatusGeralAndBancoIdIsNull(String statusGeral);
}
