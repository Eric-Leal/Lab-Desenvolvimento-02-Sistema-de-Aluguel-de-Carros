package com.example.dto.automovel;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class AutomovelResponse {

    private Long matricula;

    private String placa;

    private Integer ano;

    private String marca;

    private String modelo;

    private UUID locadorOriginalId;

    private UUID proprietarioAtualId;

    private Boolean disponivel;

    private LocalDateTime criadoEm;

    private LocalDateTime atualizadoEm;
}
