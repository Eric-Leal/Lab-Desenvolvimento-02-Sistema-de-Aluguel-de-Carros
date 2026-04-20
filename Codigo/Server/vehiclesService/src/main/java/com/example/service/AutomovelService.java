package com.example.service;

import com.example.dto.automovel.AutomovelImagemResponse;
import com.example.dto.automovel.AutomovelResponse;
import com.example.dto.automovel.CreateAutomovelRequest;
import com.example.dto.automovel.UpdateAutomovelRequest;
import com.example.dto.automovel.UpdateProprietarioRequest;
import com.example.exception.AutomovelNotFoundException;
import com.example.exception.BusinessException;
import com.example.exception.PlacaAlreadyInUseException;
import com.example.mapper.AutomovelMapper;
import com.example.model.Automovel;
import com.example.model.AutomovelImagem;
import com.example.repository.AutomovelImagemRepository;
import com.example.repository.AutomovelRepository;
import com.example.service.cloudinary.CloudinaryService;
import com.example.service.cloudinary.CloudinaryUploadResult;
import io.micronaut.context.annotation.Executable;
import io.micronaut.http.MediaType;
import io.micronaut.http.multipart.CompletedFileUpload;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Singleton
public class AutomovelService {

    private static final int MAX_IMAGENS = 3;

    private final AutomovelRepository automovelRepository;
    private final AutomovelImagemRepository automovelImagemRepository;
    private final CloudinaryService cloudinaryService;
    @Inject
    private AutomovelMapper automovelMapper;

    public AutomovelService(
        AutomovelRepository automovelRepository,
        AutomovelImagemRepository automovelImagemRepository,
        CloudinaryService cloudinaryService
    ) {
        this.automovelRepository = automovelRepository;
        this.automovelImagemRepository = automovelImagemRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // -------------------------------------------------------------------------
    // CRUD principal
    // -------------------------------------------------------------------------

    @Executable
    public AutomovelResponse create(CreateAutomovelRequest request) {
        validateAnoAndValor(request.getAno(), request.getValorDiaria());

        automovelRepository.findByPlaca(request.getPlaca())
            .ifPresent(existing -> {
                throw new PlacaAlreadyInUseException(request.getPlaca());
            });

        Automovel automovel = automovelMapper.toEntity(request);
        automovel = automovelRepository.save(automovel);

        List<String> imagens = new ArrayList<>();
        imagens.add(request.getImageBase64());
        if (request.getImagesBase64() != null) {
            request.getImagesBase64().stream()
                .filter(base64 -> base64 != null && !base64.isBlank())
                .forEach(imagens::add);
        }

        if (imagens.size() > MAX_IMAGENS) {
            throw new BusinessException("Limite de " + MAX_IMAGENS + " imagens por veículo atingido.");
        }

        for (int ordem = 0; ordem < imagens.size(); ordem++) {
            String publicId = buildPublicId(automovel.getMatricula(), UUID.randomUUID());
            CloudinaryUploadResult uploadResult = cloudinaryService.uploadBase64Image(imagens.get(ordem), publicId);

            AutomovelImagem imagem = new AutomovelImagem();
            imagem.setAutomovelMatricula(automovel.getMatricula());
            imagem.setImageUrl(uploadResult.imageUrl());
            imagem.setImagePublicId(uploadResult.publicId());
            imagem.setOrdem(ordem);
            automovelImagemRepository.save(imagem);
        }

        return toResponseWithImages(automovel);
    }

    @Executable
    public List<AutomovelResponse> findAll() {
        List<Automovel> all = new java.util.ArrayList<>();
        automovelRepository.findAll().forEach(all::add);
        return all.stream()
            .map(this::toResponseWithImages)
            .collect(Collectors.toList());
    }

    @Executable
    public List<AutomovelResponse> findByLocadorOriginalId(UUID locadorOriginalId) {
        return automovelRepository.findByLocadorOriginalId(locadorOriginalId)
            .stream()
            .map(this::toResponseWithImages)
            .collect(Collectors.toList());
    }

    @Executable
    public List<AutomovelResponse> findDisponiveis() {
        return automovelRepository.findByDisponivel(true)
            .stream()
            .map(this::toResponseWithImages)
            .collect(Collectors.toList());
    }

    @Executable
    public AutomovelResponse findByMatricula(Long matricula) {
        Automovel automovel = automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));
        return toResponseWithImages(automovel);
    }

    @Executable
    public AutomovelResponse update(Long matricula, UpdateAutomovelRequest request) {
        Automovel automovel = automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        validateAnoAndValor(request.getAno(), request.getValorDiaria());

        if (request.getPlaca() != null && !request.getPlaca().equals(automovel.getPlaca())) {
            automovelRepository.findByPlaca(request.getPlaca())
                .ifPresent(existing -> {
                    throw new PlacaAlreadyInUseException(request.getPlaca());
                });
        }

        automovelMapper.updateEntity(request, automovel);
        return toResponseWithImages(automovelRepository.update(automovel));
    }

    @Executable
    public void delete(Long matricula) {
        Automovel automovel = automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        if (Boolean.FALSE.equals(automovel.getDisponivel())) {
            throw new BusinessException("Veículo indisponível (em locação) não pode ser excluído.");
        }

        // Remove imagens do Cloudinary antes de deletar
        automovelImagemRepository.findByAutomovelMatricula(matricula)
            .forEach(img -> cloudinaryService.deleteImage(img.getImagePublicId()));

        automovelRepository.deleteById(matricula);
    }

    @Executable
    public AutomovelResponse updateProprietario(Long matricula, UpdateProprietarioRequest request) {
        Automovel automovel = automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        automovel.setProprietarioAtualId(request.getProprietarioAtualId());
        return toResponseWithImages(automovelRepository.update(automovel));
    }

    @Executable
    public void updateDisponibilidade(Long matricula, boolean disponivel) {
        Automovel automovel = automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        if (Boolean.valueOf(disponivel).equals(automovel.getDisponivel())) {
            String estado = disponivel ? "disponível" : "indisponível";
            throw new BusinessException("Veículo já está " + estado + ".");
        }

        automovel.setDisponivel(disponivel);
        automovelRepository.update(automovel);
    }

    @Executable
    public UUID getLocadorOriginalId(Long matricula) {
        return automovelRepository.findById(matricula)
            .map(Automovel::getLocadorOriginalId)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));
    }

    // -------------------------------------------------------------------------
    // Gest\u00e3o de imagens
    // -------------------------------------------------------------------------

    @Executable
    public AutomovelResponse addImageMultipart(Long matricula, CompletedFileUpload file) throws IOException {
        automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        long count = automovelImagemRepository.countByAutomovelMatricula(matricula);
        if (count >= MAX_IMAGENS) {
            throw new BusinessException("Limite de " + MAX_IMAGENS + " imagens por ve\u00edculo atingido.");
        }

        String contentType = file.getContentType().map(MediaType::toString).orElse("image/jpeg");
        String publicId = buildPublicId(matricula, UUID.randomUUID());
        CloudinaryUploadResult result = cloudinaryService.uploadImage(file.getBytes(), contentType, publicId);

        AutomovelImagem imagem = new AutomovelImagem();
        imagem.setAutomovelMatricula(matricula);
        imagem.setImageUrl(result.imageUrl());
        imagem.setImagePublicId(result.publicId());
        imagem.setOrdem((int) count);
        automovelImagemRepository.save(imagem);

        return toResponseWithImages(automovelRepository.findById(matricula).get());
    }

    @Executable
    public AutomovelResponse addImageBase64(Long matricula, String imageBase64) {
        automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        long count = automovelImagemRepository.countByAutomovelMatricula(matricula);
        if (count >= MAX_IMAGENS) {
            throw new BusinessException("Limite de " + MAX_IMAGENS + " imagens por ve\u00edculo atingido.");
        }

        String publicId = buildPublicId(matricula, UUID.randomUUID());
        CloudinaryUploadResult result = cloudinaryService.uploadBase64Image(imageBase64, publicId);

        AutomovelImagem imagem = new AutomovelImagem();
        imagem.setAutomovelMatricula(matricula);
        imagem.setImageUrl(result.imageUrl());
        imagem.setImagePublicId(result.publicId());
        imagem.setOrdem((int) count);
        automovelImagemRepository.save(imagem);

        return toResponseWithImages(automovelRepository.findById(matricula).get());
    }

    @Executable
    public AutomovelResponse removeImage(Long matricula, UUID imageId) {
        automovelRepository.findById(matricula)
            .orElseThrow(() -> new AutomovelNotFoundException(matricula));

        AutomovelImagem imagem = automovelImagemRepository.findById(imageId)
            .orElseThrow(() -> new BusinessException("Imagem com ID " + imageId + " n\u00e3o encontrada."));

        if (!imagem.getAutomovelMatricula().equals(matricula)) {
            throw new BusinessException("Esta imagem n\u00e3o pertence ao ve\u00edculo informado.");
        }

        long count = automovelImagemRepository.countByAutomovelMatricula(matricula);
        if (count <= 1) {
            throw new BusinessException("O ve\u00edculo precisa ter ao menos 1 imagem. Envie outra imagem antes de remover esta.");
        }

        cloudinaryService.deleteImage(imagem.getImagePublicId());
        automovelImagemRepository.deleteById(imageId);

        return toResponseWithImages(automovelRepository.findById(matricula).get());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private AutomovelResponse toResponseWithImages(Automovel automovel) {
        AutomovelResponse response = automovelMapper.toResponse(automovel);
        List<AutomovelImagemResponse> imagens = automovelImagemRepository
            .findByAutomovelMatricula(automovel.getMatricula())
            .stream()
            .map(img -> {
                AutomovelImagemResponse r = new AutomovelImagemResponse();
                r.setId(img.getId());
                r.setImageUrl(img.getImageUrl());
                r.setOrdem(img.getOrdem());
                return r;
            })
            .collect(Collectors.toList());
        response.setImagens(imagens);
        return response;
    }

    private String buildPublicId(Long matricula, UUID uniqueSuffix) {
        return "vehicle-" + matricula + "-" + uniqueSuffix.toString().replace("-", "").substring(0, 8);
    }

    private void validateAnoAndValor(Integer ano, BigDecimal valorDiaria) {
        if (ano != null) {
            int currentYear = Year.now().getValue();
            if (ano <= 0) {
                throw new BusinessException("Ano deve ser maior que zero.");
            }
            if (ano > currentYear) {
                throw new BusinessException("Ano não pode ser futuro.");
            }
        }

        if (valorDiaria != null && valorDiaria.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Valor da diária deve ser maior que zero.");
        }
    }
}

