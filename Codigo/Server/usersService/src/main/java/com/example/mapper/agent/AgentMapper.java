package com.example.mapper.agent;

import com.example.dto.agent.AgentResponse;
import com.example.dto.agent.CreateAgentRequest;
import com.example.dto.agent.UpdateAgentRequest;
import com.example.dto.common.AddressDTO;
import com.example.model.Address;
import com.example.model.agent.Agent;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "jsr330")
public interface AgentMapper {
    AgentMapper INSTANCE = Mappers.getMapper(AgentMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    Agent toEntity(CreateAgentRequest request);

    AgentResponse toResponse(Agent agent);

    List<AgentResponse> toResponseList(List<Agent> agents);

    Address toAddress(AddressDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    void updateEntity(UpdateAgentRequest request, @MappingTarget Agent agent);
}
