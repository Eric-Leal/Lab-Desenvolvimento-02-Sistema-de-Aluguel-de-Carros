package com.example.model;

import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.GeneratedValue;
import jakarta.persistence.Embedded;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(GeneratedValue.Type.UUID)
    private UUID id;

    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String passwordHash;

    @NotBlank
    @Pattern(regexp = "\\d{11}|\\d{14}", message = "Documento deve conter 11 (CPF) ou 14 (CNPJ) dígitos numéricos")
    private String documento;

    @Embedded
    private Address address;
}
