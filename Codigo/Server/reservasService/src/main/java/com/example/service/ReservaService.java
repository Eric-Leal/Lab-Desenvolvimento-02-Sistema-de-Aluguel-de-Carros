package com.example.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.example.enums.StatusReserva;
import com.example.model.Reserva;
import com.example.repository.ReservaRepository;

import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository repository;

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
    public Reserva bloquearReserva(Long veiculoId, UUID pedidoId, LocalDate dataInicio, LocalDate dataFim) {
        if (!verificarDisponibilidade(veiculoId, dataInicio, dataFim)) {
            throw new IllegalStateException("Período ocupado ou em sobreposição para o veículo ID: " + veiculoId);
        }

        Reserva reserva = new Reserva();
        reserva.setVeiculoId(veiculoId);
        reserva.setPedidoId(pedidoId);
        reserva.setDataInicio(dataInicio);
        reserva.setDataFim(dataFim);
        reserva.setStatus(StatusReserva.BLOQUEADO);

        return repository.save(reserva);
    }

    /**
     * Muda uma reserva BLOQUEADO → ATIVO (aluguel iniciado).
     */
    public Reserva ativarReserva(UUID reservaId) {
        Reserva reserva = repository.findById(reservaId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada: " + reservaId));

        if (reserva.getStatus() != StatusReserva.BLOQUEADO) {
            throw new IllegalStateException("Reserva deve estar em status BLOQUEADO para ativar");
        }

        reserva.setStatus(StatusReserva.ATIVO);
        return repository.update(reserva);
    }

    /**
     * Muda uma reserva ATIVO → ENCERRADO (aluguel finalizado).
     */
    public Reserva encerrarReserva(UUID reservaId) {
        Reserva reserva = repository.findById(reservaId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada: " + reservaId));

        if (reserva.getStatus() != StatusReserva.ATIVO) {
            throw new IllegalStateException("Reserva deve estar em status ATIVO para encerrar");
        }

        reserva.setStatus(StatusReserva.ENCERRADO);
        return repository.update(reserva);
    }

    /**
     * Remove um bloqueio (cancela a reserva se ainda estiver BLOQUEADO).
     */
    public void cancelarReserva(UUID reservaId) {
        Reserva reserva = repository.findById(reservaId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada: " + reservaId));

        if (reserva.getStatus() != StatusReserva.BLOQUEADO) {
            throw new IllegalStateException("Só é possível cancelar reservas com status BLOQUEADO");
        }

        repository.deleteById(reservaId);
    }

    /**
     * Retorna o agenda completa de um veículo.
     */
    public List<Reserva> obterAgendaVeiculo(Long veiculoId) {
        return repository.findByVeiculoIdOrderByDataInicioAsc(veiculoId);
    }

    /**
     * Busca por ID.
     */
    public Optional<Reserva> obterReserva(UUID reservaId) {
        return repository.findById(reservaId);
    }

    /**
     * Lista todas as reservas.
     */
    public List<Reserva> listarTodas() {
        return repository.findAll().stream().toList();
    }
}
