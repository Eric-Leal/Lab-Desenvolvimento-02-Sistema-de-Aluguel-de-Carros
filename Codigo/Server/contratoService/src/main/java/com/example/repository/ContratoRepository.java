package com.example.repository;

import com.example.enums.StatusContrato;
import com.example.model.Contrato;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface ContratoRepository extends CrudRepository<Contrato, UUID> {

    /**
     * Lista contratos de um cliente
     */
    List<Contrato> findByClienteId(Long clienteId);

    /**
     * Lista contratos de um veículo
     */
    List<Contrato> findByVeiculoId(Long veiculoId);

    /**
     * Busca contrato por pedido ID
     */
    Optional<Contrato> findByPedidoId(UUID pedidoId);

    /**
     * Lista contratos por status
     */
    List<Contrato> findByStatus(StatusContrato status);

    /**
     * Lista contratos pendentes de análise
     */
    List<Contrato> queryByStatusOrderByAtualizadoEmAsc(StatusContrato status);
}
