package com.example.mapper;

import com.example.dto.pedido.CreatePedidoRequest;
import com.example.dto.pedido.PedidoResponse;
import com.example.dto.pedido.UpdatePedidoRequest;
import com.example.model.Pedido;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = "jsr330",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PedidoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statusLocador", ignore = true)
    @Mapping(target = "statusGeral", ignore = true)
    @Mapping(target = "requerFinanciamento", ignore = true)
    @Mapping(target = "bancoId", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "atualizadoEm", ignore = true)
    Pedido toEntity(CreatePedidoRequest request);

    PedidoResponse toResponse(Pedido pedido);

    List<PedidoResponse> toResponseList(List<Pedido> pedidos);

    void updateEntity(UpdatePedidoRequest request, @MappingTarget Pedido pedido);
}
