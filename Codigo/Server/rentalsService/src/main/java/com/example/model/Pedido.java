package com.example.model;

import com.example.enums.StatusGeral;
import com.example.enums.StatusLocador;
import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.MappedProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@MappedEntity("pedidos")
@Getter
@Setter
public class Pedido {

    @Id
    @GeneratedValue(GeneratedValue.Type.UUID)
    private UUID id;

    private UUID clienteId;

    private Long automovelMatricula;

    private LocalDate dataInicio;

    private LocalDate dataFim;

    private BigDecimal valorTotal;

    private Boolean requerFinanciamento = false;

    private UUID bancoId;

    @MappedProperty("status_locador")
    private String statusLocador = StatusLocador.PENDENTE.name();

    @MappedProperty("status_geral")
    private String statusGeral = StatusGeral.RASCUNHO.name();

    @DateCreated
    private LocalDateTime criadoEm;

    @DateUpdated
    private LocalDateTime atualizadoEm;
}
