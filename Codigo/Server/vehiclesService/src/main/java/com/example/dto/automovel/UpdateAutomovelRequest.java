package com.example.dto.automovel;

import io.micronaut.core.annotation.Introspected;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Introspected
public class UpdateAutomovelRequest {

    private String placa;

    private Integer ano;

    private String marca;

    private String modelo;

    private BigDecimal valorDiaria;
}
