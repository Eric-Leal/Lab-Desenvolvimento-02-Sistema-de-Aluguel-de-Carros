package com.example.dto.agent;

import com.example.dto.common.UpdateAddressDTO;
import com.example.enums.TipoAgente;
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
public class UpdateAgentRequest {
    private String nome;
    private String email;

    @Pattern(regexp = "\\d{11}|\\d{14}", message = "deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido (apenas números)")
    private String documento;
    private TipoAgente tipo;

    @Valid
    @JsonProperty("endereço")
    private UpdateAddressDTO address;
}
