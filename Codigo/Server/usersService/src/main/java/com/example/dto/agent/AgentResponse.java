package com.example.dto.agent;

import com.example.dto.common.AddressDTO;
import com.example.enums.TipoAgente;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.micronaut.core.annotation.Introspected;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {
    private UUID id;
    private String nome;
    private String email;
    private String documento;
    private String imageUrl;
    private TipoAgente tipo;

    @JsonProperty("endereço")
    private AddressDTO address;
}
