package com.example.controller;

import com.example.dto.BloquearReservaRequest;
import com.example.dto.DisponibilidadeResponse;
import com.example.dto.ReservaResponse;
import com.example.service.ReservaService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@Controller
public class ReservaController {

    private final ReservaService service;

    public ReservaController(ReservaService service) {
        this.service = service;
    }

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
            @QueryValue("data_inicio") LocalDate dataInicio,
            @QueryValue("data_fim") LocalDate dataFim) {

        boolean disponivel = service.verificarDisponibilidade(veiculoId, dataInicio, dataFim);
        
        DisponibilidadeResponse response = new DisponibilidadeResponse(
                disponivel,
                disponivel ? null : "Período ocupado ou em sobreposição"
        );
        
        return HttpResponse.ok(response);
    }

    // ============ BLOQUEIO DE RESERVA (MS-D) ============

    /**
     * Bloqueia um período de reserva (novo estado: BLOQUEADO).
     * Usado quando MS-D aprova um contrato.
     * POST /reservas/bloquear
     */
    @Post("/reservas/bloquear")
    public HttpResponse<ReservaResponse> bloquearReserva(@Body BloquearReservaRequest request) {
        UUID pedidoId = UUID.fromString(request.getPedidoId());
        ReservaResponse reserva = service.bloquearReserva(
                request.getVeiculoId(),
                pedidoId,
                request.getDataInicio(),
                request.getDataFim()
        );
        
        return HttpResponse
                .created(reserva)
                .header("Location", "/reservas/" + reserva.getId());
    }

    // ============ MUDANÇA DE STATUS ============

    /**
     * Ativa uma reserva (BLOQUEADO → ATIVO).
     * PUT /reservas/{id}/ativar
     */
    @Put("/reservas/{id}/ativar")
    public HttpResponse<ReservaResponse> ativarReserva(@PathVariable UUID id) {
        ReservaResponse reserva = service.ativarReserva(id);
        return HttpResponse.ok(reserva);
    }

    /**
     * Encerra uma reserva (ATIVO → ENCERRADO).
     * PUT /reservas/{id}/encerrar
     */
    @Put("/reservas/{id}/encerrar")
    public HttpResponse<ReservaResponse> encerrarReserva(@PathVariable UUID id) {
        ReservaResponse reserva = service.encerrarReserva(id);
        return HttpResponse.ok(reserva);
    }

    /**
     * Cancela uma reserva (remove se BLOQUEADO).
     * DELETE /reservas/{id}
     */
    @Delete("/reservas/{id}")
    public HttpResponse<Void> cancelarReserva(@PathVariable UUID id) {
        service.cancelarReserva(id);
        return HttpResponse.noContent();
    }

    // ============ CONSULTA E LISTAGEM ============

    /**
     * Retorna a agenda completa de um veículo.
     * GET /reservas/agenda/{veiculo_id}
     */
    @Get("/reservas/agenda/{veiculoId}")
    public HttpResponse<List<ReservaResponse>> obterAgendaVeiculo(@PathVariable Long veiculoId) {
        List<ReservaResponse> reservas = service.obterAgendaVeiculo(veiculoId);
        return HttpResponse.ok(reservas);
    }

    /**
     * Retorna detalhes de uma reserva específica.
     * GET /reservas/{id}
     */
    @Get("/reservas/{id}")
    public HttpResponse<ReservaResponse> obterReserva(@PathVariable UUID id) {
        return service.obterReserva(id)
                .map(reserva -> HttpResponse.ok(reserva))
                .orElse(HttpResponse.notFound());
    }

    /**
     * Lista todas as reservas.
     * GET /reservas
     */
    @Get("/reservas")
    public List<ReservaResponse> listarTodas() {
        return service.listarTodas();
    }

}
