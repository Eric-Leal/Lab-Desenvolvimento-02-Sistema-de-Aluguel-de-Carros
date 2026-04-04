package com.example.mapper.client;

import com.example.dto.client.ClientResponse;
import com.example.dto.client.CreateClientRequest;
import com.example.dto.client.UpdateClientRequest;
import com.example.dto.common.AddressDTO;
import com.example.dto.common.EmpregoDTO;
import com.example.model.Address;
import com.example.model.client.Client;
import com.example.model.client.Emprego;
import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "jsr330")
public interface ClientMapper {
    ClientMapper INSTANCE = Mappers.getMapper(ClientMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "rendimentoTotal", ignore = true)
    Client toEntity(CreateClientRequest request);

    ClientResponse toResponse(Client client);

    @Mapping(source = "empresaNome", target = "empresa.nome")
    @Mapping(source = "cnpj", target = "empresa.cnpj")
    @Mapping(source = "rendimento", target = "rendimento")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    Emprego toEmprego(EmpregoDTO dto);

    @Mapping(source = "empresa.nome", target = "empresaNome")
    @Mapping(source = "empresa.id", target = "empresaId")
    @Mapping(source = "empresa.cnpj", target = "cnpj")
    EmpregoDTO toEmpregoDTO(Emprego emprego);

    List<ClientResponse> toResponseList(List<Client> clients);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "rendimentoTotal", ignore = true)
    @Mapping(target = "empregos", ignore = true)
    void updateEntity(UpdateClientRequest request, @MappingTarget Client client);

    Address toAddress(AddressDTO dto);

    @AfterMapping
    default void finalizeEntity(@MappingTarget Client client) {
        if (client.getEmpregos() != null) {
            BigDecimal total = BigDecimal.ZERO;
            for (Emprego emp : client.getEmpregos()) {
                emp.setClient(client);
                if (emp.getRendimento() != null) {
                    total = total.add(emp.getRendimento());
                }
            }
            client.setRendimentoTotal(total);
        }
    }
}
