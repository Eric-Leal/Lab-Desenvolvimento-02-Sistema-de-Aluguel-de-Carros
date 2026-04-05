package com.example.model;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedEntity("automoveis")
@Getter
@Setter
public class Automovel {

    @Id
    @GeneratedValue(GeneratedValue.Type.IDENTITY)
    private Long matricula;

    private String placa;

    private Integer ano;

    private String marca;

    private String modelo;

    private UUID locadorOriginalId;

    private UUID proprietarioAtualId;

    private Boolean disponivel = true;

    @DateCreated
    private LocalDateTime criadoEm;

    @DateUpdated
    private LocalDateTime atualizadoEm;
}
