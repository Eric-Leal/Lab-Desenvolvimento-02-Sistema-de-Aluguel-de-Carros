package com.example.model;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.MappedProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedEntity("automovel_imagens")
@Getter
@Setter
public class AutomovelImagem {

    @Id
    @GeneratedValue
    private UUID id;

    @MappedProperty("automovel_matricula")
    private Long automovelMatricula;

    @MappedProperty("image_url")
    private String imageUrl;

    @MappedProperty("image_public_id")
    private String imagePublicId;

    private Integer ordem;

    @DateCreated
    @MappedProperty("criado_em")
    private LocalDateTime criadoEm;
}
