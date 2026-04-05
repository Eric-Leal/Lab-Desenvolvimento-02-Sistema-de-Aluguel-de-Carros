package com.example.dto.pedido;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class PedidoResponse {

    private UUID id;
    private UUID clienteId;
    private Long automovelMatricula;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private BigDecimal valorTotal;
    private Boolean requerFinanciamento;
    private UUID bancoId;
    private String statusLocador;
    private String statusGeral;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
