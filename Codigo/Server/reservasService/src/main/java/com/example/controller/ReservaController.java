package com.example.controller;

import com.example.dto.BloquearReservaRequest;
import com.example.dto.DisponibilidadeResponse;
import com.example.dto.ReservaResponse;
import com.example.dto.VerificacaoDisponibilidadeRequest;
import com.example.model.Reserva;
import com.example.service.ReservaService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class ReservaController {

    @Inject
    private ReservaService service;

    // ============ HEALTH CHECK ============

    @Get("/")
    public String index() {
        return "reservasService online";
    }

    @Get("/ping")
    public String ping() {
        return "ok";
    }

    // ============ VERIFICAÇÃO DE DISPONIBILIDADE (MS-C) ============

    /**
     * Endpoint para MS-C verificar se um veículo está disponível em um período.
     * GET /reservas/disponibilidade?veiculo_id=1&data_inicio=2025-01-15&data_fim=2025-01-20
     */
    @Get("/reservas/disponibilidade")
    public HttpResponse<DisponibilidadeResponse> verificarDisponibilidade(
            @QueryValue("veiculo_id") Long veiculoId,
            @QueryValue("data_inicio") String dataInicioStr,
            @QueryValue("data_fim") String dataFimStr) {
        try {
            java.time.LocalDate dataInicio = java.time.LocalDate.parse(dataInicioStr);
            java.time.LocalDate dataFim = java.time.LocalDate.parse(dataFimStr);

            boolean disponivel = service.verificarDisponibilidade(veiculoId, dataInicio, dataFim);
            
            DisponibilidadeResponse response = new DisponibilidadeResponse(
                    disponivel,
                    disponivel ? null : "Período ocupado ou em sobreposição"
            );
            
            return HttpResponse.ok(response);
        } catch (Exception e) {
            return HttpResponse.badRequest(new DisponibilidadeResponse(false, "Erro ao verificar disponibilidade: " + e.getMessage()));
        }
    }

    // ============ BLOQUEIO DE RESERVA (MS-D) ============

    /**
     * Bloqueia um período de reserva (novo estado: BLOQUEADO).
     * Usado quando MS-D aprova um contrato.
     * POST /reservas/bloquear
     */
    @Post("/reservas/bloquear")
    public HttpResponse<ReservaResponse> bloquearReserva(@Body BloquearReservaRequest request) {
        try {
            UUID pedidoId = UUID.fromString(request.getPedidoId());
            Reserva reserva = service.bloquearReserva(
                    request.getVeiculoId(),
                    pedidoId,
                    request.getDataInicio(),
                    request.getDataFim()
            );
            
            return HttpResponse
                    .created(mapToResponse(reserva))
                    .header("Location", "/reservas/" + reserva.getId());
        } catch (IllegalStateException e) {
            return HttpResponse.badRequest(null);
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }

    // ============ MUDANÇA DE STATUS ============

    /**
     * Ativa uma reserva (BLOQUEADO → ATIVO).
     * PUT /reservas/{id}/ativar
     */
    @Put("/reservas/{id}/ativar")
    public HttpResponse<ReservaResponse> ativarReserva(@PathVariable UUID id) {
        try {
            Reserva reserva = service.ativarReserva(id);
            return HttpResponse.ok(mapToResponse(reserva));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return HttpResponse.badRequest(null);
        }
    }

    /**
     * Encerra uma reserva (ATIVO → ENCERRADO).
     * PUT /reservas/{id}/encerrar
     */
    @Put("/reservas/{id}/encerrar")
    public HttpResponse<ReservaResponse> encerrarReserva(@PathVariable UUID id) {
        try {
            Reserva reserva = service.encerrarReserva(id);
            return HttpResponse.ok(mapToResponse(reserva));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return HttpResponse.badRequest(null);
        }
    }

    /**
     * Cancela uma reserva (remove se BLOQUEADO).
     * DELETE /reservas/{id}
     */
    @Delete("/reservas/{id}")
    public HttpResponse<Void> cancelarReserva(@PathVariable UUID id) {
        try {
            service.cancelarReserva(id);
            return HttpResponse.noContent();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return HttpResponse.badRequest(null);
        }
    }

    // ============ CONSULTA E LISTAGEM ============

    /**
     * Retorna a agenda completa de um veículo.
     * GET /reservas/agenda/{veiculo_id}
     */
    @Get("/reservas/agenda/{veiculoId}")
    public HttpResponse<List<ReservaResponse>> obterAgendaVeiculo(@PathVariable Long veiculoId) {
        List<Reserva> reservas = service.obterAgendaVeiculo(veiculoId);
        List<ReservaResponse> responses = reservas.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return HttpResponse.ok(responses);
    }

    /**
     * Retorna detalhes de uma reserva específica.
     * GET /reservas/{id}
     */
    @Get("/reservas/{id}")
    public HttpResponse<ReservaResponse> obterReserva(@PathVariable UUID id) {
        return service.obterReserva(id)
                .map(reserva -> HttpResponse.ok(mapToResponse(reserva)))
                .orElse(HttpResponse.notFound());
    }

    /**
     * Lista todas as reservas.
     * GET /reservas
     */
    @Get("/reservas")
    public List<ReservaResponse> listarTodas() {
        return service.listarTodas().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============ HELPER ============

    private ReservaResponse mapToResponse(Reserva reserva) {
        return new ReservaResponse(
                reserva.getId(),
                reserva.getVeiculoId(),
                reserva.getPedidoId(),
                reserva.getDataInicio(),
                reserva.getDataFim(),
                reserva.getStatus()
        );
    }
}
