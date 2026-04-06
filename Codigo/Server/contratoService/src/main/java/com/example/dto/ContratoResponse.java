package com.example.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.enums.StatusContrato;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratoResponse {
    private UUID id;
    private Long clienteId;
    private Long veiculoId;
    private UUID pedidoId;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private BigDecimal valorDiario;
    private BigDecimal valorTotal;
    private BigDecimal valorEntrada;
    private BigDecimal valorRestante;
    private StatusContrato status;
    private String scoreFinanceiro;
    private String motivo;
    private UUID reservaId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
