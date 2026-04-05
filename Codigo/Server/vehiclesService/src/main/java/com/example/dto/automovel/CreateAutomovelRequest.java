package com.example.dto.automovel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CreateAutomovelRequest {

    @NotBlank
    private String placa;

    @NotNull
    private Integer ano;

    @NotBlank
    private String marca;

    @NotBlank
    private String modelo;

    @NotNull
    private UUID locadorOriginalId;
}
