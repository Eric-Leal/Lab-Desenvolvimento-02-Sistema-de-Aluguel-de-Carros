package com.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisponibilidadeResponse {

    @JsonProperty("disponivel")
    private Boolean disponivel;

    @JsonProperty("motivo")
    private String motivo;
}
