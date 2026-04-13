package com.example.service;

import com.example.client.UsersServiceClient;
import com.example.client.VehiclesServiceClient;
import com.example.dto.automovel.AutomovelInfo;
import com.example.dto.client.ClientInfo;
import com.example.dto.pedido.CreatePedidoRequest;
import com.example.dto.pedido.PedidoResponse;
import com.example.dto.pedido.UpdatePedidoRequest;
import com.example.enums.StatusGeral;
import com.example.enums.StatusLocador;
import com.example.exception.InvalidStatusTransitionException;
import com.example.exception.PedidoNotFoundException;
import com.example.mapper.PedidoMapper;
import com.example.model.Pedido;
import com.example.repository.PedidoRepository;
import io.micronaut.context.annotation.Executable;
import jakarta.inject.Singleton;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Singleton
@AllArgsConstructor
public class PedidoService {

    private static final BigDecimal FINANCIAMENTO_PERCENTUAL = new BigDecimal("0.30");

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;
    private final VehiclesServiceClient vehiclesServiceClient;
    private final UsersServiceClient usersServiceClient;

    @Executable
    public PedidoResponse create(CreatePedidoRequest request) {
        Pedido pedido = pedidoMapper.toEntity(request);
        pedido.setStatusLocador(StatusLocador.PENDENTE.name());
        pedido.setStatusGeral(StatusGeral.RASCUNHO.name());
        pedido.setRequerFinanciamento(false);
        return pedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    @Executable
    public List<PedidoResponse> findByClienteId(UUID clienteId) {
        return pedidoMapper.toResponseList(pedidoRepository.findByClienteId(clienteId));
    }

    @Executable
    public PedidoResponse findById(UUID id) {
        return pedidoRepository.findById(id)
            .map(pedidoMapper::toResponse)
            .orElseThrow(() -> new PedidoNotFoundException(id));
    }

    @Executable
    public PedidoResponse update(UUID id, UpdatePedidoRequest request) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.RASCUNHO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido só pode ser editado quando em RASCUNHO.");
        }
        pedidoMapper.updateEntity(request, pedido);
        return pedidoMapper.toResponse(pedidoRepository.update(pedido));
    }

    @Executable
    public PedidoResponse submeter(UUID id, String authorization) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.RASCUNHO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido só pode ser submetido quando em RASCUNHO.");
        }

        // Verificar se requer financiamento comparando rendimento do cliente com valor total
        try {
            ClientInfo clientInfo = usersServiceClient.getClient(pedido.getClienteId(), authorization);
            if (clientInfo != null && clientInfo.getRendimentoTotal() != null) {
                BigDecimal limiteSemFinanciamento = clientInfo.getRendimentoTotal().multiply(FINANCIAMENTO_PERCENTUAL);
                boolean requer = pedido.getValorTotal().compareTo(limiteSemFinanciamento) > 0;
                pedido.setRequerFinanciamento(requer);
            }
        } catch (Exception e) {
            // Se não conseguir buscar o cliente, prossegue sem financiamento
            pedido.setRequerFinanciamento(false);
        }

        pedido.setStatusGeral(StatusGeral.SUBMETIDO.name());
        return pedidoMapper.toResponse(pedidoRepository.update(pedido));
    }

    @Executable
    public PedidoResponse cancelar(UUID id) {
        Pedido pedido = getPedidoOrThrow(id);
        if (StatusGeral.CONTRATO_FECHADO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido com contrato fechado não pode ser cancelado.");
        }
        pedido.setStatusGeral(StatusGeral.CANCELADO.name());
        return pedidoMapper.toResponse(pedidoRepository.update(pedido));
    }

    @Executable
    public void excluirRascunho(UUID id) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.RASCUNHO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Apenas pedidos em RASCUNHO podem ser excluídos.");
        }
        pedidoRepository.delete(pedido);
    }

    // --- Endpoints do Agente ---

    @Executable
    public List<PedidoResponse> findPendentesDoAgente(UUID locadorId) {
        List<Long> matriculas = getMatriculasDoLocador(locadorId);
        if (matriculas.isEmpty()) return List.of();
        return pedidoMapper.toResponseList(
            pedidoRepository.findByStatusLocadorAndAutomovelMatriculaIn(
                StatusLocador.PENDENTE.name(), matriculas)
        );
    }

    @Executable
    public List<PedidoResponse> findAnalisadosDoAgente(UUID locadorId) {
        List<Long> matriculas = getMatriculasDoLocador(locadorId);
        if (matriculas.isEmpty()) return List.of();
        List<Pedido> aprovados = pedidoRepository.findByStatusLocadorAndAutomovelMatriculaIn(
            StatusLocador.APROVADO.name(), matriculas);
        List<Pedido> reprovados = pedidoRepository.findByStatusLocadorAndAutomovelMatriculaIn(
            StatusLocador.REPROVADO.name(), matriculas);
        aprovados.addAll(reprovados);
        return pedidoMapper.toResponseList(aprovados);
    }

    @Executable
    public PedidoResponse aprovar(UUID id) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.SUBMETIDO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido só pode ser aprovado quando SUBMETIDO.");
        }
        pedido.setStatusLocador(StatusLocador.APROVADO.name());
        if (Boolean.TRUE.equals(pedido.getRequerFinanciamento())) {
            pedido.setStatusGeral(StatusGeral.EM_ANALISE_BANCO.name());
        } else {
            pedido.setStatusGeral(StatusGeral.CONTRATO_FECHADO.name());
        }
        return pedidoMapper.toResponse(pedidoRepository.update(pedido));
    }

    @Executable
    public PedidoResponse reprovar(UUID id) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.SUBMETIDO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido só pode ser reprovado quando SUBMETIDO.");
        }
        pedido.setStatusLocador(StatusLocador.REPROVADO.name());
        return pedidoMapper.toResponse(pedidoRepository.update(pedido));
    }

    // --- Endpoints do Banco ---

    @Executable
    public List<PedidoResponse> findDisponiveisParaBanco() {
        return pedidoMapper.toResponseList(
            pedidoRepository.findByStatusGeralAndBancoIdIsNull(StatusGeral.EM_ANALISE_BANCO.name())
        );
    }

    @Executable
    public PedidoResponse aprovarFinanciamento(UUID id, UUID bancoId) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.EM_ANALISE_BANCO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido não está em análise bancária.");
        }
        pedido.setBancoId(bancoId);
        pedido.setStatusGeral(StatusGeral.CONTRATO_FECHADO.name());
        return pedidoMapper.toResponse(pedidoRepository.update(pedido));
    }

    @Executable
    public PedidoResponse reprovarFinanciamento(UUID id, UUID bancoId) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.EM_ANALISE_BANCO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido não está em análise bancária.");
        }
        pedido.setBancoId(bancoId);
        pedido.setStatusGeral(StatusGeral.REPROVADO_BANCO.name());
        return pedidoMapper.toResponse(pedidoRepository.update(pedido));
    }

    // Helpers

    private Pedido getPedidoOrThrow(UUID id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new PedidoNotFoundException(id));
    }

    private List<Long> getMatriculasDoLocador(UUID locadorId) {
        try {
            List<AutomovelInfo> automoveis = vehiclesServiceClient.getMeusAutomoveis(locadorId);
            return automoveis.stream()
                .map(AutomovelInfo::getMatricula)
                .collect(Collectors.toList());
        } catch (Exception e) {
            return List.of();
        }
    }
}
