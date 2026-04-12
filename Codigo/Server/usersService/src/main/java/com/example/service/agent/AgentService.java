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
import com.example.service.cloudinary.CloudinaryService;
import com.example.service.cloudinary.CloudinaryUploadResult;
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
    private final CloudinaryService cloudinaryService;

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

        Agent savedAgent = agentRepository.save(agent);

        if (request.getImageBase64() != null && !request.getImageBase64().isBlank()) {
            CloudinaryUploadResult uploadResult = cloudinaryService.uploadBase64UserImage(request.getImageBase64(), "agent", savedAgent.getId());
            savedAgent.setImageUrl(uploadResult.imageUrl());
            savedAgent.setImagePublicId(uploadResult.publicId());
            savedAgent = agentRepository.update(savedAgent);
        }

        return agentMapper.toResponse(savedAgent);
    }

    @Executable
    public AgentResponse updateAgent(UUID id, UpdateAgentRequest request) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));

        agentMapper.updateEntity(request, agent);

        if (request.getImageBase64() != null && !request.getImageBase64().isBlank()) {
            CloudinaryUploadResult uploadResult = cloudinaryService.uploadBase64UserImage(request.getImageBase64(), "agent", id);
            agent.setImageUrl(uploadResult.imageUrl());
            agent.setImagePublicId(uploadResult.publicId());
        }

        return agentMapper.toResponse(agentRepository.update(agent));
    }

    @Executable
    public AgentResponse findById(UUID id) {
        return agentRepository.findById(id)
            .map(agentMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));
    }

    @Executable
    public AgentResponse uploadImage(UUID id, byte[] fileBytes, String contentType) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));

        CloudinaryUploadResult uploadResult = cloudinaryService.uploadUserImage(fileBytes, contentType, "agent", id);
        agent.setImageUrl(uploadResult.imageUrl());
        agent.setImagePublicId(uploadResult.publicId());

        return agentMapper.toResponse(agentRepository.update(agent));
    }

    @Executable
    public AgentResponse removeImage(UUID id) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));

        cloudinaryService.deleteImage(agent.getImagePublicId());
        agent.setImageUrl(null);
        agent.setImagePublicId(null);

        return agentMapper.toResponse(agentRepository.update(agent));
    }

    @Executable
    public List<AgentResponse> findAll() {
        return agentMapper.toResponseList(agentRepository.findAll());
    }

    @Executable
    public void deleteAgent(UUID id) {
        Agent agent = agentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agente", id.toString()));

        cloudinaryService.deleteImage(agent.getImagePublicId());
        agentRepository.deleteById(id);
    }
}
