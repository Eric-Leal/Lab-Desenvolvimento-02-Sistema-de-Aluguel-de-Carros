package com.example.dto.automovel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAutomovelRequest {

    private String placa;

    private Integer ano;

    private String marca;

    private String modelo;
}
