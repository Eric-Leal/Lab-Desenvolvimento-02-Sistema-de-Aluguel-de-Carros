package com.example.controller;

import com.example.dto.pedido.CreatePedidoRequest;
import com.example.dto.pedido.PedidoResponse;
import com.example.dto.pedido.UpdatePedidoRequest;
import com.example.service.PedidoService;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Patch;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.annotation.QueryValue;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Controller("/pedidos")
@AllArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    /**
     * POST /pedidos
     * Ator: Cliente
     * Cria pedido em RASCUNHO.
     */
    @Post
    public HttpResponse<PedidoResponse> create(@Body @Valid CreatePedidoRequest request) {
        return HttpResponse.created(pedidoService.create(request));
    }

    /**
     * GET /pedidos/meus?clienteId={uuid}
     * Ator: Cliente
     * Lista pedidos do cliente. Quando segurança habilitada, extrair do JWT.
     */
    @Get("/meus")
    public HttpResponse<List<PedidoResponse>> getMeus(@QueryValue UUID clienteId) {
        return HttpResponse.ok(pedidoService.findByClienteId(clienteId));
    }

    /**
     * GET /pedidos/{id}
     * Ator: Qualquer autenticado
     * Detalhe do pedido.
     */
    @Get("/{id}")
    public HttpResponse<PedidoResponse> getById(@PathVariable UUID id) {
        return HttpResponse.ok(pedidoService.findById(id));
    }

    /**
     * PUT /pedidos/{id}
     * Ator: Cliente
     * Edita pedido (só RASCUNHO).
     */
    @Put("/{id}")
    public HttpResponse<PedidoResponse> update(
            @PathVariable UUID id,
            @Body @Valid UpdatePedidoRequest request) {
        return HttpResponse.ok(pedidoService.update(id, request));
    }

    /**
     * PATCH /pedidos/{id}/submeter
     * Ator: Cliente
     * RASCUNHO → SUBMETIDO. Avalia requer_financiamento.
     * Propaga o Authorization header para consultar rendimento no usersService.
     */
    @Patch("/{id}/submeter")
    public HttpResponse<PedidoResponse> submeter(
            @PathVariable UUID id,
            HttpRequest<?> request) {
        String authorization = request.getHeaders().get("Authorization");
        return HttpResponse.ok(pedidoService.submeter(id, authorization != null ? authorization : ""));
    }

    /**
     * PATCH /pedidos/{id}/cancelar
     * Ator: Cliente
     * Status geral → CANCELADO (antes de CONTRATO_FECHADO).
     */
    @Patch("/{id}/cancelar")
    public HttpResponse<PedidoResponse> cancelar(@PathVariable UUID id) {
        return HttpResponse.ok(pedidoService.cancelar(id));
    }

    /**
     * DELETE /pedidos/{id}
     * Ator: Cliente
     * Exclui pedido em RASCUNHO.
     */
    @Delete("/{id}")
    public HttpResponse<Void> excluirRascunho(@PathVariable UUID id) {
        pedidoService.excluirRascunho(id);
        return HttpResponse.noContent();
    }

    // --- Endpoints do Agente ---

    /**
     * GET /pedidos/agente/pendentes?locadorId={uuid}
     * Ator: Agente locador
     * Pedidos com status_locador = PENDENTE nos veículos do agente.
     */
    @Get("/agente/pendentes")
    public HttpResponse<List<PedidoResponse>> getPendentesAgente(@QueryValue UUID locadorId) {
        return HttpResponse.ok(pedidoService.findPendentesDoAgente(locadorId));
    }

    /**
     * GET /pedidos/agente/analisados?locadorId={uuid}
     * Ator: Agente locador
     * Pedidos com status_locador = APROVADO ou REPROVADO nos veículos do agente.
     */
    @Get("/agente/analisados")
    public HttpResponse<List<PedidoResponse>> getAnalisadosAgente(@QueryValue UUID locadorId) {
        return HttpResponse.ok(pedidoService.findAnalisadosDoAgente(locadorId));
    }

    /**
     * PATCH /pedidos/{id}/aprovar
     * Ator: Agente locador
     * Aprova → CONTRATO_FECHADO ou EM_ANALISE_BANCO.
     */
    @Patch("/{id}/aprovar")
    public HttpResponse<PedidoResponse> aprovar(@PathVariable UUID id) {
        return HttpResponse.ok(pedidoService.aprovar(id));
    }

    /**
     * PATCH /pedidos/{id}/reprovar
     * Ator: Agente locador
     * status_locador → REPROVADO.
     */
    @Patch("/{id}/reprovar")
    public HttpResponse<PedidoResponse> reprovar(@PathVariable UUID id) {
        return HttpResponse.ok(pedidoService.reprovar(id));
    }

    // --- Endpoints do Banco ---

    /**
     * GET /pedidos/banco/disponiveis
     * Ator: Banco
     * Pedidos EM_ANALISE_BANCO com banco_id IS NULL.
     */
    @Get("/banco/disponiveis")
    public HttpResponse<List<PedidoResponse>> getDisponiveisParaBanco() {
        return HttpResponse.ok(pedidoService.findDisponiveisParaBanco());
    }

    /**
     * PATCH /pedidos/{id}/financiamento/aprovar?bancoId={uuid}
     * Ator: Banco
     * banco_id + status_geral → CONTRATO_FECHADO.
     */
    @Patch("/{id}/financiamento/aprovar")
    public HttpResponse<PedidoResponse> aprovarFinanciamento(
            @PathVariable UUID id,
            @QueryValue UUID bancoId) {
        return HttpResponse.ok(pedidoService.aprovarFinanciamento(id, bancoId));
    }

    /**
     * PATCH /pedidos/{id}/financiamento/reprovar?bancoId={uuid}
     * Ator: Banco
     * banco_id + status_geral → REPROVADO_BANCO.
     */
    @Patch("/{id}/financiamento/reprovar")
    public HttpResponse<PedidoResponse> reprovarFinanciamento(
            @PathVariable UUID id,
            @QueryValue UUID bancoId) {
        return HttpResponse.ok(pedidoService.reprovarFinanciamento(id, bancoId));
    }
}
