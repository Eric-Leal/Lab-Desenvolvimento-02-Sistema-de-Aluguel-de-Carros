package com.example.service;

import com.example.dto.AnalisarContratoRequest;
import com.example.dto.CriarContratoRequest;
import com.example.dto.ContratoResponse;
import com.example.enums.StatusContrato;
import com.example.model.Contrato;
import com.example.repository.ContratoRepository;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Singleton
@RequiredArgsConstructor
public class ContratoService {

    private final ContratoRepository repository;
    
    @Client("http://reservasService:8084")
    private final HttpClient reservasClient;

    public ContratoResponse criarContrato(CriarContratoRequest request) {
        // Calcula valor total
        long diasAluguel = ChronoUnit.DAYS.between(request.getDataInicio(), request.getDataFim());
        BigDecimal valorTotal = request.getValorDiario()
                .multiply(BigDecimal.valueOf(diasAluguel));
        BigDecimal valorRestante = valorTotal.subtract(request.getValorEntrada());

        Contrato contrato = Contrato.builder()
                .clienteId(request.getClienteId())
                .veiculoId(request.getVeiculoId())
                .pedidoId(request.getPedidoId())
                .dataInicio(request.getDataInicio())
                .dataFim(request.getDataFim())
                .valorDiario(request.getValorDiario())
                .valorTotal(valorTotal)
                .valorEntrada(request.getValorEntrada())
                .valorRestante(valorRestante)
                .status(StatusContrato.RASCUNHO)
                .build();

        Contrato saved = repository.save(contrato);
        return toResponse(saved);
    }

    public ContratoResponse submeterParaAnalise(UUID contratoId) {
        Contrato contrato = repository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        if (contrato.getStatus() != StatusContrato.RASCUNHO) {
            throw new RuntimeException("Contrato só pode ser submetido do status RASCUNHO");
        }

        contrato.setStatus(StatusContrato.PENDENTE_ANALISE);
        Contrato updated = repository.update(contrato);
        return toResponse(updated);
    }

    public ContratoResponse analisarContrato(AnalisarContratoRequest request) {
        Contrato contrato = repository.findById(request.getContratoId())
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        if (contrato.getStatus() != StatusContrato.PENDENTE_ANALISE) {
            throw new RuntimeException("Contrato deve estar PENDENTE_ANALISE para ser analisado");
        }

        contrato.setScoreFinanceiro(request.getScoreFinanceiro());
        contrato.setMotivo(request.getMotivo());

        if ("APROVADO".equalsIgnoreCase(request.getScoreFinanceiro())) {
            contrato.setStatus(StatusContrato.APROVADO);
            // Bloquear reserva no MS-E
            tentarBloquearReserva(contrato);
        } else {
            contrato.setStatus(StatusContrato.REJEITADO);
        }

        Contrato updated = repository.update(contrato);
        return toResponse(updated);
    }

    private void tentarBloquearReserva(Contrato contrato) {
        try {
            // Chama endpoint de bloqueio no MS-E
            // TODO: Implementar chamada HTTP para MS-E
            // POST /reservasService/reservas/bloquear
            // {
            //   "veiculoId": 1,
            //   "dataInicio": "2025-01-15",
            //   "dataFim": "2025-01-20",
            //   "pedidoId": UUID
            // }
        } catch (Exception e) {
            // Log error mas não falha
            System.err.println("Erro ao bloquear reserva: " + e.getMessage());
        }
    }

    public ContratoResponse assinarContrato(UUID contratoId) {
        Contrato contrato = repository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        if (contrato.getStatus() != StatusContrato.APROVADO) {
            throw new RuntimeException("Apenas contratos APROVADOS podem ser assinados");
        }

        contrato.setStatus(StatusContrato.ASSINADO);
        Contrato updated = repository.update(contrato);
        return toResponse(updated);
    }

    public ContratoResponse ativarContrato(UUID contratoId) {
        Contrato contrato = repository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        if (contrato.getStatus() != StatusContrato.ASSINADO) {
            throw new RuntimeException("Apenas contratos ASSINADOS podem ser ativados");
        }

        if (LocalDate.now().isBefore(contrato.getDataInicio())) {
            throw new RuntimeException("Contrato não pode ser ativado antes de sua data de início");
        }

        contrato.setStatus(StatusContrato.ATIVO);
        Contrato updated = repository.update(contrato);
        return toResponse(updated);
    }

    public ContratoResponse encerrarContrato(UUID contratoId) {
        Contrato contrato = repository.findById(contratoId)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        if (contrato.getStatus() != StatusContrato.ATIVO) {
            throw new RuntimeException("Apenas contratos ATIVOS podem ser encerrados");
        }

        contrato.setStatus(StatusContrato.ENCERRADO);
        Contrato updated = repository.update(contrato);
        return toResponse(updated);
    }

    public List<ContratoResponse> listarPendentes() {
        return repository.queryByStatusOrderByAtualizadoEmAsc(StatusContrato.PENDENTE_ANALISE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContratoResponse> listarPorCliente(Long clienteId) {
        return repository.findByClienteId(clienteId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ContratoResponse> listarTodos() {
        return repository.findAll().stream().toList()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ContratoResponse toResponse(Contrato contrato) {
        return ContratoResponse.builder()
                .id(contrato.getId())
                .clienteId(contrato.getClienteId())
                .veiculoId(contrato.getVeiculoId())
                .pedidoId(contrato.getPedidoId())
                .dataInicio(contrato.getDataInicio())
                .dataFim(contrato.getDataFim())
                .valorDiario(contrato.getValorDiario())
                .valorTotal(contrato.getValorTotal())
                .valorEntrada(contrato.getValorEntrada())
                .valorRestante(contrato.getValorRestante())
                .status(contrato.getStatus())
                .scoreFinanceiro(contrato.getScoreFinanceiro())
                .motivo(contrato.getMotivo())
                .reservaId(contrato.getReservaId())
                .criadoEm(contrato.getCriadoEm())
                .atualizadoEm(contrato.getAtualizadoEm())
                .build();
    }
}
