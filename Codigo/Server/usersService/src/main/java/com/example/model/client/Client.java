package com.example.model.client;

import com.example.model.User;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.Relation;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@MappedEntity
@Getter
@Setter
public class Client extends User {

    private String profissao;

    @NotBlank
    private String rg;

    @Relation(value = Relation.Kind.ONE_TO_MANY, mappedBy = "client", cascade = Relation.Cascade.ALL)
    private List<Emprego> empregos;

    private BigDecimal rendimentoTotal;
}
