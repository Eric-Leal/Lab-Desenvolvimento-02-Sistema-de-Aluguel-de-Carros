package com.example.dto;

import com.example.enums.StatusReserva;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservaResponse {

    private UUID id;

    @JsonProperty("veiculo_id")
    private Long veiculoId;

    @JsonProperty("pedido_id")
    private UUID pedidoId;

    @JsonProperty("data_inicio")
    private LocalDate dataInicio;

    @JsonProperty("data_fim")
    private LocalDate dataFim;

    private StatusReserva status;
}
