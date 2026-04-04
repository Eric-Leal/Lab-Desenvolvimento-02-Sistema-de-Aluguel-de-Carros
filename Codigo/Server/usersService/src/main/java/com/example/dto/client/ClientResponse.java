package com.example.dto.client;

import com.example.dto.common.AddressDTO;
import com.example.dto.common.EmpregoDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.micronaut.core.annotation.Introspected;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Introspected
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {
    private UUID id;
    private String nome;
    private String email;
    private String documento;
    private String profissao;
    private String rg;

    @JsonProperty("endereço")
    private AddressDTO address;
    private List<EmpregoDTO> empregos;
    private BigDecimal rendimentoTotal;
}
