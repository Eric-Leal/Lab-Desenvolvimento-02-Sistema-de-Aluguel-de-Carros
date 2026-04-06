package com.example.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalisarContratoRequest {
    private UUID contratoId;
    private String scoreFinanceiro; // "APROVADO", "REJEITADO"
    private String motivo;
}
