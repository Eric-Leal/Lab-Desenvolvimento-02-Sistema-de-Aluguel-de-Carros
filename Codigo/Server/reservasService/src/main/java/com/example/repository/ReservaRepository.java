package com.example.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.example.enums.StatusReserva;
import com.example.model.Reserva;

import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface ReservaRepository extends CrudRepository<Reserva, UUID> {

    /**
     * Busca reservas de um veículo que se sobrepõem com o período solicitado.
     * Query de overlap: data_inicio < :fim AND data_fim > :inicio
     */
    List<Reserva> queryByVeiculoIdAndDataInicioLessThanAndDataFimGreaterThanAndStatusNot(
            Long veiculoId, 
            LocalDate dataFim, 
            LocalDate dataInicio, 
            StatusReserva statusExcluido
    );

    /**
     * Lista todas as reservas de um veículo (agenda completa)
     */
    List<Reserva> findByVeiculoIdOrderByDataInicioAsc(Long veiculoId);

    /**
     * Busca reservas por pedido_id
     */
    Optional<Reserva> findByPedidoId(UUID pedidoId);

    /**
     * Busca reservas por status
     */
    List<Reserva> findByStatus(StatusReserva status);

    /**
     * Busca reservas de um veículo em um status específico
     */
    List<Reserva> findByVeiculoIdAndStatus(Long veiculoId, StatusReserva status);
}
