package com.example.controller;

import com.example.dto.automovel.AutomovelResponse;
import com.example.dto.automovel.CreateAutomovelRequest;
import com.example.dto.automovel.UpdateAutomovelRequest;
import com.example.dto.automovel.UpdateProprietarioRequest;
import com.example.service.AutomovelService;
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
import java.util.Map;
import java.util.UUID;

@Controller("/automoveis")
@AllArgsConstructor
public class AutomovelController {

    private final AutomovelService automovelService;

    /**
     * POST /automoveis
     * Ator: Agente locador (EMPRESA ou LOCADOR_PESSOA_FISICA)
     * Cadastra novo automóvel. locadorOriginalId deve ser o ID do agente autenticado.
     */
    @Post
    public HttpResponse<AutomovelResponse> create(@Body @Valid CreateAutomovelRequest request) {
        return HttpResponse.created(automovelService.create(request));
    }

    /**
     * GET /automoveis/meus?locadorOriginalId={uuid}
     * Ator: Agente locador
     * Lista os automóveis do agente. Quando segurança estiver habilitada, extrair do JWT.
     */
    @Get("/meus")
    public HttpResponse<List<AutomovelResponse>> getMeus(@QueryValue UUID locadorOriginalId) {
        return HttpResponse.ok(automovelService.findByLocadorOriginalId(locadorOriginalId));
    }

    /**
     * GET /automoveis/disponiveis
     * Ator: Qualquer autenticado (cliente)
     * Lista automóveis com disponivel = true.
     */
    @Get("/disponiveis")
    public HttpResponse<List<AutomovelResponse>> getDisponiveis() {
        return HttpResponse.ok(automovelService.findDisponiveis());
    }

    /**
     * GET /automoveis/{matricula}
     * Ator: Qualquer autenticado
     * Busca automóvel pela matrícula.
     */
    @Get("/{matricula}")
    public HttpResponse<AutomovelResponse> getByMatricula(@PathVariable Long matricula) {
        return HttpResponse.ok(automovelService.findByMatricula(matricula));
    }

    /**
     * PUT /automoveis/{matricula}
     * Ator: Agente locador dono do automóvel
     * Atualiza dados editáveis (placa, ano, marca, modelo).
     */
    @Put("/{matricula}")
    public HttpResponse<AutomovelResponse> update(
            @PathVariable Long matricula,
            @Body @Valid UpdateAutomovelRequest request) {
        return HttpResponse.ok(automovelService.update(matricula, request));
    }

    /**
     * DELETE /automoveis/{matricula}
     * Ator: Agente locador dono do automóvel
     * Remove automóvel (futuramente verificar pedido ativo no rentalsService).
     */
    @Delete("/{matricula}")
    public HttpResponse<Void> delete(@PathVariable Long matricula) {
        automovelService.delete(matricula);
        return HttpResponse.noContent();
    }

    /**
     * PATCH /automoveis/{matricula}/proprietario
     * Ator: Interno — contractsService
     * Atualiza proprietario_atual_id (ex: transferência durante contrato de crédito).
     */
    @Patch("/{matricula}/proprietario")
    public HttpResponse<AutomovelResponse> updateProprietario(
            @PathVariable Long matricula,
            @Body @Valid UpdateProprietarioRequest request) {
        return HttpResponse.ok(automovelService.updateProprietario(matricula, request));
    }

    /**
     * GET /automoveis/{matricula}/locador-original
     * Ator: Interno — rentalsService / contractsService
     * Retorna o locador_original_id para consulta por outros microserviços.
     */
    @Get("/{matricula}/locador-original")
    public HttpResponse<Map<String, UUID>> getLocadorOriginal(@PathVariable Long matricula) {
        return HttpResponse.ok(Map.of("locadorOriginalId", automovelService.getLocadorOriginalId(matricula)));
    }
}
