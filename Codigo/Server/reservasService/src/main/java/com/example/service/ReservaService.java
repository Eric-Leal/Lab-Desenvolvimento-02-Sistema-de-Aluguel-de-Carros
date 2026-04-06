package com.example.service;

import com.example.exception.BusinessException;
import com.example.exception.ResourceNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.example.dto.ReservaResponse;
import com.example.mapper.ReservaMapper;

import com.example.enums.StatusReserva;
import com.example.model.Reserva;
import com.example.repository.ReservaRepository;

import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository repository;
    private final ReservaMapper mapper;

    /**
     * Verifica se um veículo está disponível em um período.
     * Retorna false se há sobreposição com reservas ativas/bloqueadas.
     */
    public boolean verificarDisponibilidade(Long veiculoId, LocalDate dataInicio, LocalDate dataFim) {
        List<Reserva> sobrepostas = repository.queryByVeiculoIdAndDataInicioLessThanAndDataFimGreaterThanAndStatusNot(
                veiculoId,
                dataFim,
                dataInicio,
                StatusReserva.ENCERRADO
        );
        return sobrepostas.isEmpty();
    }

    /**
     * Bloqueia um período de reserva (novo estado: BLOQUEADO).
     * Usado quando MS-D aprova um contrato.
     */
    public ReservaResponse bloquearReserva(Long veiculoId, UUID pedidoId, LocalDate dataInicio, LocalDate dataFim) {
        if (!verificarDisponibilidade(veiculoId, dataInicio, dataFim)) {
            throw new BusinessException("Período ocupado ou em sobreposição para o veículo ID: " + veiculoId);
        }

        Reserva reserva = new Reserva();
        reserva.setVeiculoId(veiculoId);
        reserva.setPedidoId(pedidoId);
        reserva.setDataInicio(dataInicio);
        reserva.setDataFim(dataFim);
        reserva.setStatus(StatusReserva.BLOQUEADO);

        return mapper.toResponse(repository.save(reserva));
    }

    /**
     * Muda uma reserva BLOQUEADO → ATIVO (aluguel iniciado).
     */
    public ReservaResponse ativarReserva(UUID reservaId) {
        Reserva reserva = repository.findById(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", reservaId.toString()));

        if (reserva.getStatus() != StatusReserva.BLOQUEADO) {
            throw new BusinessException("Reserva deve estar em status BLOQUEADO para ativar");
        }

        reserva.setStatus(StatusReserva.ATIVO);
        return mapper.toResponse(repository.update(reserva));
    }

    /**
     * Muda uma reserva ATIVO → ENCERRADO (aluguel finalizado).
     */
    public ReservaResponse encerrarReserva(UUID reservaId) {
        Reserva reserva = repository.findById(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", reservaId.toString()));

        if (reserva.getStatus() != StatusReserva.ATIVO) {
            throw new BusinessException("Reserva deve estar em status ATIVO para encerrar");
        }

        reserva.setStatus(StatusReserva.ENCERRADO);
        return mapper.toResponse(repository.update(reserva));
    }

    /**
     * Remove um bloqueio (cancela a reserva se ainda estiver BLOQUEADO).
     */
    public void cancelarReserva(UUID reservaId) {
        Reserva reserva = repository.findById(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", reservaId.toString()));

        if (reserva.getStatus() != StatusReserva.BLOQUEADO) {
            throw new BusinessException("Só é possível cancelar reservas com status BLOQUEADO");
        }

        repository.deleteById(reservaId);
    }

    /**
     * Retorna o agenda completa de um veículo.
     */
    public List<ReservaResponse> obterAgendaVeiculo(Long veiculoId) {
        return mapper.toResponseList(repository.findByVeiculoIdOrderByDataInicioAsc(veiculoId));
    }

    /**
     * Busca por ID.
     */
    public Optional<ReservaResponse> obterReserva(UUID reservaId) {
        return repository.findById(reservaId).map(mapper::toResponse);
    }

    /**
     * Lista todas as reservas.
     */
    public List<ReservaResponse> listarTodas() {
        return mapper.toResponseList(repository.findAll().stream().toList());
    }
}
