package com.example.dto.pedido;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UpdatePedidoRequest {

    private LocalDate dataInicio;

    private LocalDate dataFim;

    @Positive
    private BigDecimal valorTotal;
}
