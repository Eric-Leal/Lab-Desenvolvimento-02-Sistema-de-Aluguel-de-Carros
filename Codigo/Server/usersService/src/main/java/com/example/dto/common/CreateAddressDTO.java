package com.example.dto.common;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAddressDTO {
    @NotBlank
    private String logradouro;

    @NotBlank
    private String numero;

    private String complemento;

    @NotBlank
    private String bairro;

    @NotBlank
    private String cidade;

    @NotBlank
    private String estado;

    @NotBlank
    @Pattern(regexp = "\\d{8}", message = "o CEP deve ter 8 dígitos")
    private String cep;
}
