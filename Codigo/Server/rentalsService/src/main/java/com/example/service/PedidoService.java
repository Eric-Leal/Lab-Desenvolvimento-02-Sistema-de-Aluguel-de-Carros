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
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import jakarta.inject.Singleton;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Singleton
public class PedidoService {

    private static final BigDecimal FINANCIAMENTO_PERCENTUAL = new BigDecimal("0.30");

    private final PedidoRepository pedidoRepository;
    private final VehiclesServiceClient vehiclesServiceClient;
    private final UsersServiceClient usersServiceClient;
    private final PedidoMapper pedidoMapper = PedidoMapper.INSTANCE;

    public PedidoService(
        PedidoRepository pedidoRepository,
        VehiclesServiceClient vehiclesServiceClient,
        UsersServiceClient usersServiceClient
    ) {
        this.pedidoRepository = pedidoRepository;
        this.vehiclesServiceClient = vehiclesServiceClient;
        this.usersServiceClient = usersServiceClient;
    }

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
    public PedidoResponse cancelar(UUID id, String authorization) {
        Pedido pedido = getPedidoOrThrow(id);
        if (StatusGeral.CONTRATO_FECHADO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido com contrato fechado não pode ser cancelado.");
        }

        boolean deveLiberarVeiculo = StatusGeral.EM_ANALISE_BANCO.name().equals(pedido.getStatusGeral());
        if (deveLiberarVeiculo) {
            atualizarDisponibilidadeVeiculo(pedido.getAutomovelMatricula(), true, authorization);
        }

        pedido.setStatusGeral(StatusGeral.CANCELADO.name());
        try {
            return pedidoMapper.toResponse(pedidoRepository.update(pedido));
        } catch (RuntimeException e) {
            if (deveLiberarVeiculo) {
                tentarCompensarDisponibilidade(pedido.getAutomovelMatricula(), false, authorization);
            }
            throw e;
        }
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
        List<Pedido> pedidosDoLocador = pedidoRepository.findByAutomovelMatriculaIn(matriculas);
        List<Pedido> pendentes = pedidosDoLocador.stream()
            .filter(pedido -> StatusLocador.PENDENTE.name().equalsIgnoreCase(pedido.getStatusLocador()))
            .collect(Collectors.toList());
        return pedidoMapper.toResponseList(pendentes);
    }

    @Executable
    public List<PedidoResponse> findAnalisadosDoAgente(UUID locadorId) {
        List<Long> matriculas = getMatriculasDoLocador(locadorId);
        if (matriculas.isEmpty()) return List.of();
        List<Pedido> pedidosDoLocador = pedidoRepository.findByAutomovelMatriculaIn(matriculas);
        List<Pedido> analisados = pedidosDoLocador.stream()
            .filter(pedido ->
                StatusLocador.APROVADO.name().equalsIgnoreCase(pedido.getStatusLocador())
                    || StatusLocador.REPROVADO.name().equalsIgnoreCase(pedido.getStatusLocador())
            )
            .collect(Collectors.toList());
        return pedidoMapper.toResponseList(analisados);
    }

    @Executable
    public PedidoResponse aprovar(UUID id, String authorization) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.SUBMETIDO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido só pode ser aprovado quando SUBMETIDO.");
        }

        atualizarDisponibilidadeVeiculo(pedido.getAutomovelMatricula(), false, authorization);

        pedido.setStatusLocador(StatusLocador.APROVADO.name());
        if (Boolean.TRUE.equals(pedido.getRequerFinanciamento())) {
            pedido.setStatusGeral(StatusGeral.EM_ANALISE_BANCO.name());
        } else {
            pedido.setStatusGeral(StatusGeral.CONTRATO_FECHADO.name());
        }
        try {
            return pedidoMapper.toResponse(pedidoRepository.update(pedido));
        } catch (RuntimeException e) {
            tentarCompensarDisponibilidade(pedido.getAutomovelMatricula(), true, authorization);
            throw e;
        }
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
    public PedidoResponse reprovarFinanciamento(UUID id, UUID bancoId, String authorization) {
        Pedido pedido = getPedidoOrThrow(id);
        if (!StatusGeral.EM_ANALISE_BANCO.name().equals(pedido.getStatusGeral())) {
            throw new InvalidStatusTransitionException("Pedido não está em análise bancária.");
        }

        atualizarDisponibilidadeVeiculo(pedido.getAutomovelMatricula(), true, authorization);

        pedido.setBancoId(bancoId);
        pedido.setStatusGeral(StatusGeral.REPROVADO_BANCO.name());
        try {
            return pedidoMapper.toResponse(pedidoRepository.update(pedido));
        } catch (RuntimeException e) {
            tentarCompensarDisponibilidade(pedido.getAutomovelMatricula(), false, authorization);
            throw e;
        }
    }

    // Helpers

    private Pedido getPedidoOrThrow(UUID id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new PedidoNotFoundException(id));
    }

    private List<Long> getMatriculasDoLocador(UUID locadorId) {
        List<AutomovelInfo> automoveis = vehiclesServiceClient.getMeusAutomoveis(locadorId);
        return automoveis.stream()
            .map(AutomovelInfo::getMatricula)
            .collect(Collectors.toList());
    }

    private void atualizarDisponibilidadeVeiculo(Long matricula, boolean disponivel, String authorization) {
        String acao = disponivel ? "liberar" : "reservar";
        try {
            vehiclesServiceClient.updateDisponibilidade(matricula, disponivel, authorization);
        } catch (HttpClientResponseException e) {
            String detalhe = e.getResponse().getBody(String.class).orElse(e.getMessage());
            throw new InvalidStatusTransitionException("Não foi possível " + acao + " o veículo: " + detalhe);
        } catch (Exception e) {
            throw new InvalidStatusTransitionException("Não foi possível " + acao + " o veículo neste momento.");
        }
    }

    private void tentarCompensarDisponibilidade(Long matricula, boolean disponivel, String authorization) {
        try {
            vehiclesServiceClient.updateDisponibilidade(matricula, disponivel, authorization);
        } catch (Exception ignored) {
            // Melhor esforço: evita mascarar a exceção principal da transição.
        }
    }
}
