package com.example.dto.automovel;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Introspected
public class CreateAutomovelRequest {

    @NotBlank
    private String placa;

    @NotNull
    @Positive
    private Integer ano;

    @NotBlank
    private String marca;

    @NotBlank
    private String modelo;

    @NotNull
    @Positive
    private BigDecimal valorDiaria;

    @NotNull
    private UUID locadorOriginalId;

    @NotBlank
    private String imageBase64;

    // Opcional: imagens adicionais (além da principal), total máximo de 3 imagens por veículo.
    private List<String> imagesBase64;
}
