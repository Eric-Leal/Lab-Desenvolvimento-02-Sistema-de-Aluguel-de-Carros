package com.example.controller.agent;

import com.example.dto.agent.AgentResponse;
import com.example.dto.agent.CreateAgentRequest;
import com.example.dto.agent.UpdateAgentRequest;
import com.example.service.agent.AgentService;
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

@Controller("/agent")
@AllArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @Post
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<AgentResponse> create(@Body @Valid CreateAgentRequest request) {
        return HttpResponse.created(agentService.createAgent(request));
    }

    @Get("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<AgentResponse> getById(@PathVariable UUID id) {
        return HttpResponse.ok(agentService.findById(id));
    }

    @Get
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<List<AgentResponse>> getAll() {
        return HttpResponse.ok(agentService.findAll());
    }

    @Patch("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<AgentResponse> update(@PathVariable UUID id, @Body @Valid UpdateAgentRequest request) {
        return HttpResponse.ok(agentService.updateAgent(id, request));
    }

    @Delete("/{id}")
    @Secured(SecurityRule.IS_AUTHENTICATED)
    public HttpResponse<Void> delete(@PathVariable UUID id) {
        agentService.deleteAgent(id);
        return HttpResponse.noContent();
    }
}
