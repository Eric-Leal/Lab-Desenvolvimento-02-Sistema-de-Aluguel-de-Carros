package com.example.dto.client;

import com.example.dto.common.UpdateAddressDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.micronaut.core.annotation.Introspected;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateClientRequest {
    private String nome;
    private String email;

    @Pattern(regexp = "\\d{11}|\\d{14}", message = "deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido (apenas números)")
    private String documento;

    private String profissao;

    private String rg;

    @Valid
    @JsonProperty("endereço")
    private UpdateAddressDTO address;
}
