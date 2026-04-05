package com.example.service.agent;

import com.example.dto.agent.AgentResponse;
import com.example.dto.agent.CreateAgentRequest;
import com.example.dto.agent.UpdateAgentRequest;
import com.example.exception.BusinessException;
import com.example.exception.DocumentAlreadyInUseException;
import com.example.exception.EmailAlreadyInUseException;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.agent.AgentMapper;
import com.example.model.agent.Agent;
import com.example.repository.agent.AgentRepository;
import com.example.util.PasswordValidator;
import io.micronaut.context.annotation.Executable;
import jakarta.inject.Singleton;
import lombok.AllArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.UUID;

@Singleton
@AllArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;
    private final AgentMapper agentMapper;

    @Executable
    public AgentResponse createAgent(CreateAgentRequest request) {
        if (request == null) {
            throw new BusinessException("Dados do agente não fornecidos");
        }

        PasswordValidator.validate(request.getPassword());

        if (agentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyInUseException("O e-mail informado já está em uso.");
        }

        if (agentRepository.findByDocumento(request.getDocumento()).isPresent()) {
            throw new DocumentAlreadyInUseException("O documento informado já está em uso.");
        }

        Agent agent = agentMapper.toEntity(request);
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        agent.setPasswordHash(hashedPassword);

        return agentMapper.toResponse(agentRepository.save(agent));
    }

    @Executable
    public AgentResponse updateAgent(UUID id, UpdateAgentRequest request) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));

        agentMapper.updateEntity(request, agent);

        return agentMapper.toResponse(agentRepository.update(agent));
    }

    @Executable
    public void deleteAgent(UUID id) {
        agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));

        agentRepository.deleteById(id);
    }

    @Executable
    public AgentResponse findById(UUID id) {
        return agentRepository.findById(id)
            .map(agentMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));
    }

    @Executable
    public List<AgentResponse> findAll() {
        return agentMapper.toResponseList(agentRepository.findAll());
    }
}
