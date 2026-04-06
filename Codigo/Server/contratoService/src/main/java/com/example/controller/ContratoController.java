package com.example.controller;

import com.example.dto.AnalisarContratoRequest;
import com.example.dto.CriarContratoRequest;
import com.example.dto.ContratoResponse;
import com.example.service.ContratoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Controller("/contratos")
@RequiredArgsConstructor
public class ContratoController {

    private final ContratoService service;

    @Get("/ping")
    public String ping() {
        return "ok";
    }

    @Post
    public HttpResponse<ContratoResponse> criar(@Body CriarContratoRequest request) {
        ContratoResponse contrato = service.criarContrato(request);
        return HttpResponse.created(contrato);
    }

    @Put("/{id}/submeter-analise")
    public HttpResponse<ContratoResponse> submeterParaAnalise(@PathVariable UUID id) {
        ContratoResponse contrato = service.submeterParaAnalise(id);
        return HttpResponse.ok(contrato);
    }

    @Put("/{id}/analisar")
    public HttpResponse<ContratoResponse> analisar(@PathVariable UUID id, @Body AnalisarContratoRequest request) {
        request.setContratoId(id);
        ContratoResponse contrato = service.analisarContrato(request);
        return HttpResponse.ok(contrato);
    }

    @Put("/{id}/assinar")
    public HttpResponse<ContratoResponse> assinar(@PathVariable UUID id) {
        ContratoResponse contrato = service.assinarContrato(id);
        return HttpResponse.ok(contrato);
    }

    @Put("/{id}/ativar")
    public HttpResponse<ContratoResponse> ativar(@PathVariable UUID id) {
        ContratoResponse contrato = service.ativarContrato(id);
        return HttpResponse.ok(contrato);
    }

    @Put("/{id}/encerrar")
    public HttpResponse<ContratoResponse> encerrar(@PathVariable UUID id) {
        ContratoResponse contrato = service.encerrarContrato(id);
        return HttpResponse.ok(contrato);
    }

    @Get("/pendentes")
    public HttpResponse<List<ContratoResponse>> listarPendentes() {
        List<ContratoResponse> contratos = service.listarPendentes();
        return HttpResponse.ok(contratos);
    }

    @Get("/cliente/{clienteId}")
    public HttpResponse<List<ContratoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        List<ContratoResponse> contratos = service.listarPorCliente(clienteId);
        return HttpResponse.ok(contratos);
    }

    @Get
    public HttpResponse<List<ContratoResponse>> listarTodos() {
        List<ContratoResponse> contratos = service.listarTodos();
        return HttpResponse.ok(contratos);
    }
}
