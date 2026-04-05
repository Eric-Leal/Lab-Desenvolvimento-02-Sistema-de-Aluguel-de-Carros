package com.example.service;

import com.example.dto.automovel.AutomovelResponse;
import com.example.dto.automovel.CreateAutomovelRequest;
import com.example.dto.automovel.UpdateAutomovelRequest;
import com.example.dto.automovel.UpdateProprietarioRequest;
import com.example.exception.AutomovelNotFoundException;
import com.example.exception.PlacaAlreadyInUseException;
import com.example.mapper.AutomovelMapper;
import com.example.model.Automovel;
import com.example.repository.AutomovelRepository;
import io.micronaut.context.annotation.Executable;
import jakarta.inject.Singleton;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Singleton
@AllArgsConstructor
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final AutomovelMapper automovelMapper;

    @Executable
    public AutomovelResponse create(CreateAutomovelRequest request) {
        automovelRepository.findByPlaca(request.getPlaca())
            .ifPresent(existing -> {
                throw new PlacaAlreadyInUseException(request.getPlaca());
            });

        Automovel automovel = automovelMapper.toEntity(request);
        return automovelMapper.toResponse(automovelRepository.save(automovel));
    }

    @Executable
    public List<AutomovelResponse> findByLocadorOriginalId(UUID locadorOriginalId) {
        return automovelMapper.toResponseList(
            automovelRepository.findByLocadorOriginalId(locadorOriginalId)
        );
    }

    @Executable
    public List<AutomovelResponse> findDisponiveis() {
        return automovelMapper.toResponseList(
            automovelRepository.findByDisponivel(true)
        );
    }

    @Executable
    public AutomovelResponse findByMatricula(Long matricula) {
        return automovelRepository.findById(matricula)
            .map(automovelMapper::toResponse)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));
    }

    @Executable
    public AutomovelResponse update(Long matricula, UpdateAutomovelRequest request) {
        Automovel automovel = automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        if (request.getPlaca() != null && !request.getPlaca().equals(automovel.getPlaca())) {
            automovelRepository.findByPlaca(request.getPlaca())
                .ifPresent(existing -> {
                    throw new PlacaAlreadyInUseException(request.getPlaca());
                });
        }

        automovelMapper.updateEntity(request, automovel);
        return automovelMapper.toResponse(automovelRepository.update(automovel));
    }

    @Executable
    public void delete(Long matricula) {
        automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));
        // Nota: futuramente verificar se não há pedido ativo no rentalsService antes de remover
        automovelRepository.deleteById(matricula);
    }

    @Executable
    public AutomovelResponse updateProprietario(Long matricula, UpdateProprietarioRequest request) {
        Automovel automovel = automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        automovel.setProprietarioAtualId(request.getProprietarioAtualId());
        return automovelMapper.toResponse(automovelRepository.update(automovel));
    }

    @Executable
    public UUID getLocadorOriginalId(Long matricula) {
        return automovelRepository.findById(matricula)
            .map(Automovel::getLocadorOriginalId)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));
    }
}
