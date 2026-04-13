package com.example.service.client;

import com.example.dto.client.ClientResponse;
import com.example.dto.client.CreateClientRequest;
import com.example.dto.client.UpdateClientRequest;
import com.example.dto.common.EmpregoDTO;
import com.example.exception.BusinessException;
import com.example.exception.DocumentAlreadyInUseException;
import com.example.exception.EmailAlreadyInUseException;
import com.example.exception.ResourceNotFoundException;
import com.example.mapper.client.ClientMapper;
import com.example.model.client.Client;
import com.example.model.client.Emprego;
import com.example.repository.client.ClientRepository;
import com.example.repository.client.EmpregoRepository;
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
public class ClientService {

    private final ClientRepository clientRepository;
    private final EmpregoRepository empregoRepository;
    private final CloudinaryService cloudinaryService;

    private final ClientMapper clientMapper = ClientMapper.INSTANCE;

    @Executable
    public ClientResponse create(CreateClientRequest request) {
        if (request == null) {
            throw new BusinessException("Dados do cliente não fornecidos");
        }

        PasswordValidator.validate(request.getPassword());

        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyInUseException("O e-mail informado já está em uso.");
        }

        if (clientRepository.findByDocumento(request.getDocumento()).isPresent()) {
            throw new DocumentAlreadyInUseException("O documento informado já está em uso.");
        }

        if (request.getEmpregos() != null && request.getEmpregos().size() > 3) {
            throw new BusinessException("Um cliente só pode ter no máximo 3 empregos cadastrados.");
        }

        Client client = clientMapper.toEntity(request);
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        client.setPasswordHash(hashedPassword);

        Client savedClient = clientRepository.save(client);

        if (request.getImageBase64() != null && !request.getImageBase64().isBlank()) {
            CloudinaryUploadResult uploadResult = cloudinaryService.uploadBase64UserImage(request.getImageBase64(), "client", savedClient.getId());
            savedClient.setImageUrl(uploadResult.imageUrl());
            savedClient.setImagePublicId(uploadResult.publicId());
            savedClient = clientRepository.update(savedClient);
        }

        return clientMapper.toResponse(savedClient);
    }

    @Executable
    public ClientResponse update(UUID id, UpdateClientRequest request) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", id.toString()));

        clientMapper.updateEntity(request, client);

        if (request.getImageBase64() != null && !request.getImageBase64().isBlank()) {
            CloudinaryUploadResult uploadResult = cloudinaryService.uploadBase64UserImage(request.getImageBase64(), "client", id);
            client.setImageUrl(uploadResult.imageUrl());
            client.setImagePublicId(uploadResult.publicId());
        }

        return clientMapper.toResponse(clientRepository.update(client));
    }

    @Executable
    public void updateEmprego(UUID clientId, UUID empregoId, EmpregoDTO request) {
        clientRepository.findById(clientId)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", clientId.toString()));

        Emprego emprego = empregoRepository.findById(empregoId)
            .orElseThrow(() -> new ResourceNotFoundException("Emprego", empregoId.toString()));

        if (request.getEmpresaNome() != null) emprego.getEmpresa().setNome(request.getEmpresaNome());
        if (request.getCnpj() != null) emprego.getEmpresa().setCnpj(request.getCnpj());
        if (request.getRendimento() != null) emprego.setRendimento(request.getRendimento());

        empregoRepository.update(emprego);
    }

    @Executable
    public ClientResponse findById(UUID id) {
        return clientRepository.findById(id)
            .map(clientMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", id.toString()));
    }

    @Executable
    public ClientResponse uploadImage(UUID id, byte[] fileBytes, String contentType) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", id.toString()));

        CloudinaryUploadResult uploadResult = cloudinaryService.uploadUserImage(fileBytes, contentType, "client", id);
        client.setImageUrl(uploadResult.imageUrl());
        client.setImagePublicId(uploadResult.publicId());

        return clientMapper.toResponse(clientRepository.update(client));
    }

    @Executable
    public ClientResponse removeImage(UUID id) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", id.toString()));

        cloudinaryService.deleteImage(client.getImagePublicId());
        client.setImageUrl(null);
        client.setImagePublicId(null);

        return clientMapper.toResponse(clientRepository.update(client));
    }

    @Executable
    public List<ClientResponse> findAll() {
        return clientMapper.toResponseList(clientRepository.findAll());
    }

    @Executable
    public void delete(UUID id) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", id.toString()));

        cloudinaryService.deleteImage(client.getImagePublicId());
        clientRepository.deleteById(id);
    }
}
