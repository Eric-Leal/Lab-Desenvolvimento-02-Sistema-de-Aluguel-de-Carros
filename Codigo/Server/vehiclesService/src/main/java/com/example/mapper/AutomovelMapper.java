package com.example.mapper;

import com.example.dto.automovel.AutomovelResponse;
import com.example.dto.automovel.CreateAutomovelRequest;
import com.example.dto.automovel.UpdateAutomovelRequest;
import com.example.model.Automovel;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "jsr330")
public interface AutomovelMapper {

    AutomovelMapper INSTANCE = Mappers.getMapper(AutomovelMapper.class);

    @Mapping(target = "matricula", ignore = true)
    @Mapping(target = "proprietarioAtualId", source = "locadorOriginalId")
    @Mapping(target = "disponivel", constant = "true")
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "atualizadoEm", ignore = true)
    Automovel toEntity(CreateAutomovelRequest request);

    @Mapping(target = "imagens", ignore = true)
    AutomovelResponse toResponse(Automovel automovel);

    @Mapping(target = "imagens", ignore = true)
    List<AutomovelResponse> toResponseList(List<Automovel> automoveis);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "matricula", ignore = true)
    @Mapping(target = "locadorOriginalId", ignore = true)
    @Mapping(target = "proprietarioAtualId", ignore = true)
    @Mapping(target = "disponivel", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "atualizadoEm", ignore = true)
    void updateEntity(UpdateAutomovelRequest request, @MappingTarget Automovel automovel);
}
