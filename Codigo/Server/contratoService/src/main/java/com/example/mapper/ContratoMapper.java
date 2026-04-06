package com.example.mapper;

import com.example.dto.ContratoResponse;
import com.example.model.Contrato;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = "jsr330",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ContratoMapper {

    ContratoResponse toResponse(Contrato contrato);

    List<ContratoResponse> toResponseList(List<Contrato> contratos);
}
