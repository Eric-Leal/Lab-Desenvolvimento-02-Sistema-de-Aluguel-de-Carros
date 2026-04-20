package com.example.dto.automovel;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.micronaut.core.annotation.Introspected;
import lombok.Getter;
import lombok.Setter;

@Introspected
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class AutomovelInfo {

    private Long matricula;
}
