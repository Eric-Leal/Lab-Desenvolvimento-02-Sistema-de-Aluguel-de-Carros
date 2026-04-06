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
public class VerificacaoDisponibilidadeRequest {

    @JsonProperty("veiculo_id")
    private Long veiculoId;

    @JsonProperty("data_inicio")
    private LocalDate dataInicio;

    @JsonProperty("data_fim")
    private LocalDate dataFim;
}
