package com.example.model.client;

import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.GeneratedValue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@MappedEntity
@Getter
@Setter
public class EntidadeEmpregadora {
    @Id
    @GeneratedValue(GeneratedValue.Type.UUID)
    private UUID id;

    @NotBlank
    private String nome;

    @NotBlank
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve conter 14 dígitos numéricos")
    private String cnpj;
}
