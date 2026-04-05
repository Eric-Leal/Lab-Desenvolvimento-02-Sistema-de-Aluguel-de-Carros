package com.example.dto.automovel;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UpdateProprietarioRequest {

    @NotNull
    private UUID proprietarioAtualId;
}
