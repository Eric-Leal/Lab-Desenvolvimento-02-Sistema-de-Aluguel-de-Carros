package com.example.dto.client;

import com.example.dto.common.AddressDTO;
import com.example.dto.common.EmpregoDTO;
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

import java.util.List;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateClientRequest {
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

    private String profissao;

    @NotBlank
    private String rg;

    @Valid
    @NotNull(message = "O endereço é obrigatório")
    @JsonProperty("endereço")
    private AddressDTO address;

    private List<EmpregoDTO> empregos;
}
