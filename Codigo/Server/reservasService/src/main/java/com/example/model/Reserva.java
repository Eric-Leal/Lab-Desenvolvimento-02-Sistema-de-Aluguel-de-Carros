package com.example.model;

import com.example.enums.StatusReserva;
import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@MappedEntity("reservas")
@Getter
@Setter
public class Reserva {

    @Id
    @GeneratedValue(GeneratedValue.Type.UUID)
    private UUID id;

    private Long veiculoId;      // FK lógica para MS-B (vehiclesService)

    private UUID pedidoId;       // FK lógica para MS-C (rentalsService)

    private LocalDate dataInicio;

    private LocalDate dataFim;

    private StatusReserva status = StatusReserva.DISPONIVEL;

    @DateCreated
    private LocalDateTime criadoEm;

    @DateUpdated
    private LocalDateTime atualizadoEm;
}
