package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalisarContratoRequest {
    private UUID contratoId;
    private String scoreFinanceiro; // "APROVADO", "REJEITADO"
    private String motivo;
}
