package com.example.dto.pedido;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Introspected
@Getter
@Setter
public class CreatePedidoRequest {

    @NotNull
    private UUID clienteId;

    @NotNull
    private Long automovelMatricula;

    @NotNull
    private LocalDate dataInicio;

    @NotNull
    private LocalDate dataFim;

    @NotNull
    @Positive
    private BigDecimal valorTotal;
}
