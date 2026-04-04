package com.example.model.client;

import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Relation;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@MappedEntity
@Getter
@Setter
public class Emprego {
    @Id
    @GeneratedValue(GeneratedValue.Type.UUID)
    private UUID id;

    private BigDecimal rendimento;

    @Relation(Relation.Kind.MANY_TO_ONE)
    private Client client;

    @Relation(value = Relation.Kind.MANY_TO_ONE, cascade = Relation.Cascade.ALL)
    private EntidadeEmpregadora empresa;
}
