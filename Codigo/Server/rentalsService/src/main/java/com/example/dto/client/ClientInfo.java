package com.example.dto.client;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ClientInfo {

    private UUID id;
    private BigDecimal rendimentoTotal;
}
