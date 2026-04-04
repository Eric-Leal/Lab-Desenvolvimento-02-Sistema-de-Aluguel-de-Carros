package com.example.model.agent;

import com.example.enums.TipoAgente;
import com.example.model.User;
import io.micronaut.data.annotation.MappedEntity;
import lombok.Getter;
import lombok.Setter;

@MappedEntity
@Getter
@Setter
public class Agent extends User {
    private TipoAgente tipo;
}
