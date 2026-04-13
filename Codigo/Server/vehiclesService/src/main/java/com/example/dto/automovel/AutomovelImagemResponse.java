package com.example.dto.automovel;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AutomovelImagemResponse {

    private UUID id;
    private String imageUrl;
    private Integer ordem;
}
