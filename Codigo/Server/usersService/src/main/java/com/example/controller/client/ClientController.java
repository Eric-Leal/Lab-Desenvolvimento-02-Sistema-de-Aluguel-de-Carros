package com.example.controller.client;

import com.example.dto.client.ClientResponse;
import com.example.dto.client.CreateClientRequest;
import com.example.dto.client.UpdateClientRequest;
import com.example.dto.common.EmpregoDTO;
import com.example.service.client.ClientService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Patch;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Controller("/client")
@AllArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @Post
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<ClientResponse> create(@Body @Valid CreateClientRequest request) {
        return HttpResponse.created(clientService.create(request));
    }

    @Get("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<ClientResponse> getById(@PathVariable UUID id) {
        return HttpResponse.ok(clientService.findById(id));
    }

    @Get
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<List<ClientResponse>> getAll() {
        return HttpResponse.ok(clientService.findAll());
    }

    @Patch("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<ClientResponse> update(@PathVariable UUID id, @Body @Valid UpdateClientRequest request) {
        return HttpResponse.ok(clientService.update(id, request));
    }

    @Patch("/{clientId}/emprego/{empregoId}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<Void> updateEmprego(@PathVariable UUID clientId, @PathVariable UUID empregoId, @Body @Valid EmpregoDTO request) {
        clientService.updateEmprego(clientId, empregoId, request);
        return HttpResponse.ok();
    }

    @Delete("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<Void> delete(@PathVariable UUID id) {
        clientService.delete(id);
        return HttpResponse.noContent();
    }
}
