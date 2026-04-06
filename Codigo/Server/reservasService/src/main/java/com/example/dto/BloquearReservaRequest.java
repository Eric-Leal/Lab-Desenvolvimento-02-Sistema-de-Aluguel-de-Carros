package com.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloquearReservaRequest {

    @JsonProperty("veiculo_id")
    private Long veiculoId;

    @JsonProperty("pedido_id")
    private String pedidoId;

    @JsonProperty("data_inicio")
    private LocalDate dataInicio;

    @JsonProperty("data_fim")
    private LocalDate dataFim;
}
