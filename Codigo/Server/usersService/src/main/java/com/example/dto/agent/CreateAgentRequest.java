package com.example.dto.agent;

import com.example.dto.common.AddressDTO;
import com.example.enums.TipoAgente;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAgentRequest {
    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    @Pattern(regexp = "\\d{11}|\\d{14}", message = "deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido (apenas números)")
    private String documento;

    private TipoAgente tipo;

    @Valid
    @NotNull(message = "O endereço é obrigatório")
    @JsonProperty("endereço")
    private AddressDTO address;
}
