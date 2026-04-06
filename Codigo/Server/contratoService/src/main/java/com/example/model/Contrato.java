package com.example.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.enums.StatusContrato;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contratos", indexes = {
    @Index(name = "idx_contrato_cliente", columnList = "cliente_id"),
    @Index(name = "idx_contrato_veiculo", columnList = "veiculo_id"),
    @Index(name = "idx_contrato_status", columnList = "status"),
    @Index(name = "idx_contrato_pedido", columnList = "pedido_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private Long clienteId;

    @Column(nullable = false)
    private Long veiculoId;

    @Column(nullable = false)
    private UUID pedidoId;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(nullable = false)
    private LocalDate dataFim;

    @Column(nullable = false)
    private BigDecimal valorDiario;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private BigDecimal valorEntrada;

    @Column
    private BigDecimal valorRestante;

    @Column
    private String motivo; // Motivo de rejeição ou cancelamento

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusContrato status;

    @Column
    private UUID reservaId; // ID da reserva bloqueada no MS-E

    @Column
    private String scoreFinanceiro; // Score da análise financeira

    @DateCreated
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @DateUpdated
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;
}
