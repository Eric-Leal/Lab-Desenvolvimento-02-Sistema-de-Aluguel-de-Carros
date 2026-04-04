package com.example.dto.common;

import io.micronaut.core.annotation.Introspected;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpregoDTO {
    private String empresaNome;
    private String cnpj;
    private UUID empresaId;
    private BigDecimal rendimento;
}
