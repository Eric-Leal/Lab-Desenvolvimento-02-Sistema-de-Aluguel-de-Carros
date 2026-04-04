package com.example.dto.common;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAddressDTO {
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;

    @Pattern(regexp = "\\d{8}", message = "o CEP deve ter 8 dígitos")
    private String cep;
}
