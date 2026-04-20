package com.example.client;

import com.example.dto.automovel.AutomovelInfo;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Header;
import io.micronaut.http.annotation.Patch;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.QueryValue;
import io.micronaut.http.client.annotation.Client;

import java.util.List;
import java.util.UUID;

@Client("${vehicles.service.url}")
public interface VehiclesServiceClient {

    @Get("/automoveis/{matricula}/locador-original")
    UUID getLocadorOriginalId(@PathVariable Long matricula);

    @Get("/automoveis/meus")
    List<AutomovelInfo> getMeusAutomoveis(@QueryValue UUID locadorOriginalId);

    @Patch("/automoveis/{matricula}/disponibilidade")
    void updateDisponibilidade(
        @PathVariable Long matricula,
        @QueryValue boolean disponivel,
        @Header("Authorization") String authorization);
}
