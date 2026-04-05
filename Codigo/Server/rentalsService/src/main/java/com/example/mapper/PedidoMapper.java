package com.example.mapper;

import com.example.dto.pedido.CreatePedidoRequest;
import com.example.dto.pedido.PedidoResponse;
import com.example.dto.pedido.UpdatePedidoRequest;
import com.example.model.Pedido;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = "jsr330",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PedidoMapper {

    Pedido toEntity(CreatePedidoRequest request);

    PedidoResponse toResponse(Pedido pedido);

    List<PedidoResponse> toResponseList(List<Pedido> pedidos);

    void updateEntity(UpdatePedidoRequest request, @MappingTarget Pedido pedido);
}
