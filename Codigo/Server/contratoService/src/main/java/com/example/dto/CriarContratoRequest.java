package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriarContratoRequest {
    private Long clienteId;
    private Long veiculoId;
    private UUID pedidoId;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private BigDecimal valorDiario;
    private BigDecimal valorEntrada;
}
