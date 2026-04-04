package com.example.service.client;

import com.example.dto.client.ClientResponse;
import com.example.dto.client.CreateClientRequest;
import com.example.dto.client.UpdateClientRequest;
import com.example.dto.common.EmpregoDTO;
import com.example.exception.DocumentAlreadyInUseException;
import com.example.exception.EmailAlreadyInUseException;
import com.example.mapper.client.ClientMapper;
import com.example.model.client.Client;
import com.example.model.client.Emprego;
import com.example.repository.client.ClientRepository;
import com.example.repository.client.EmpregoRepository;
import com.example.util.PasswordValidator;
import io.micronaut.context.annotation.Executable;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
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
    private final ClientMapper clientMapper;

    @Executable
    public ClientResponse create(CreateClientRequest request) {
        if (request == null) {
            throw new RuntimeException("Dados do cliente não fornecidos");
        }

        PasswordValidator.validate(request.getPassword());

        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyInUseException("O e-mail informado já está em uso.");
        }

        if (clientRepository.findByDocumento(request.getDocumento()).isPresent()) {
            throw new DocumentAlreadyInUseException("O documento informado já está em uso.");
        }

        if (request.getEmpregos() != null && request.getEmpregos().size() > 3) {
            throw new RuntimeException("Um cliente só pode ter no máximo 3 empregos cadastrados.");
        }

        Client client = clientMapper.toEntity(request);
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        client.setPasswordHash(hashedPassword);

        return clientMapper.toResponse(clientRepository.save(client));
    }

    @Executable
    public ClientResponse update(UUID id, UpdateClientRequest request) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        clientMapper.updateEntity(request, client);

        return clientMapper.toResponse(clientRepository.update(client));
    }

    @Executable
    public void updateEmprego(UUID clientId, UUID empregoId, EmpregoDTO request) {
        clientRepository.findById(clientId)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        Emprego emprego = empregoRepository.findById(empregoId)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Emprego não encontrado."));

        if (request.getEmpresaNome() != null) emprego.getEmpresa().setNome(request.getEmpresaNome());
        if (request.getCnpj() != null) emprego.getEmpresa().setCnpj(request.getCnpj());
        if (request.getRendimento() != null) emprego.setRendimento(request.getRendimento());

        empregoRepository.update(emprego);
    }

    @Executable
    public ClientResponse findById(UUID id) {
        return clientRepository.findById(id)
            .map(clientMapper::toResponse)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));
    }

    @Executable
    public List<ClientResponse> findAll() {
        return clientMapper.toResponseList(clientRepository.findAll());
    }

    @Executable
    public void delete(UUID id) {
        clientRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado."));

        clientRepository.deleteById(id);
    }
}
