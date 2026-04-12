package com.example.controller;

import com.example.dto.automovel.AutomovelResponse;
import com.example.dto.automovel.CreateAutomovelRequest;
import com.example.dto.automovel.UpdateAutomovelRequest;
import com.example.dto.automovel.UpdateProprietarioRequest;
import com.example.service.AutomovelService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Consumes;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Part;
import io.micronaut.http.annotation.Patch;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.annotation.QueryValue;
import io.micronaut.http.multipart.CompletedFileUpload;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller("/automoveis")
@AllArgsConstructor
public class AutomovelController {

    private final AutomovelService automovelService;

    @Post
    public HttpResponse<AutomovelResponse> create(@Body @Valid CreateAutomovelRequest request) {
        return HttpResponse.created(automovelService.create(request));
    }

    @Get
    public HttpResponse<List<AutomovelResponse>> getAll() {
        return HttpResponse.ok(automovelService.findAll());
    }

    @Get("/meus")
    public HttpResponse<List<AutomovelResponse>> getMeus(@QueryValue UUID locadorOriginalId) {
        return HttpResponse.ok(automovelService.findByLocadorOriginalId(locadorOriginalId));
    }

    @Get("/disponiveis")
    public HttpResponse<List<AutomovelResponse>> getDisponiveis() {
        return HttpResponse.ok(automovelService.findDisponiveis());
    }

    @Get("/{matricula}")
    public HttpResponse<AutomovelResponse> getByMatricula(@PathVariable Long matricula) {
        return HttpResponse.ok(automovelService.findByMatricula(matricula));
    }

    @Put("/{matricula}")
    public HttpResponse<AutomovelResponse> update(
            @PathVariable Long matricula,
            @Body @Valid UpdateAutomovelRequest request) {
        return HttpResponse.ok(automovelService.update(matricula, request));
    }

    @Delete("/{matricula}")
    public HttpResponse<Void> delete(@PathVariable Long matricula) {
        automovelService.delete(matricula);
        return HttpResponse.noContent();
    }

    @Patch("/{matricula}/proprietario")
    public HttpResponse<AutomovelResponse> updateProprietario(
            @PathVariable Long matricula,
            @Body @Valid UpdateProprietarioRequest request) {
        return HttpResponse.ok(automovelService.updateProprietario(matricula, request));
    }

    @Get("/{matricula}/locador-original")
    public HttpResponse<Map<String, UUID>> getLocadorOriginal(@PathVariable Long matricula) {
        return HttpResponse.ok(Map.of("locadorOriginalId", automovelService.getLocadorOriginalId(matricula)));
    }

    /**
     * POST /automoveis/{matricula}/imagens
     * Adiciona uma imagem ao veículo via multipart (máximo 3 imagens).
     */
    @Post(value = "/{matricula}/imagens", consumes = MediaType.MULTIPART_FORM_DATA)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public HttpResponse<AutomovelResponse> addImageMultipart(
            @PathVariable Long matricula,
            @Part("file") CompletedFileUpload file) throws IOException {
        return HttpResponse.created(automovelService.addImageMultipart(matricula, file));
    }

    /**
     * DELETE /automoveis/{matricula}/imagens/{imageId}
     * Remove uma imagem do veículo (mínimo 1 imagem deve permanecer).
     */
    @Delete("/{matricula}/imagens/{imageId}")
    public HttpResponse<AutomovelResponse> removeImage(
            @PathVariable Long matricula,
            @PathVariable UUID imageId) {
        return HttpResponse.ok(automovelService.removeImage(matricula, imageId));
    }
}
