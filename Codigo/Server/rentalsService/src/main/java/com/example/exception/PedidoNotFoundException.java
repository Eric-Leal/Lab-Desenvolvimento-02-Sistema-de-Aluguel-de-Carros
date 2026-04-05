package com.example.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;
import java.util.UUID;

public class PedidoNotFoundException extends RuntimeException {
    public PedidoNotFoundException(UUID id) {
        super("Pedido " + id + " não encontrado.");
    }

    @Singleton
    public static class Handler implements ExceptionHandler<PedidoNotFoundException, HttpResponse<?>> {
        @Override
        @SuppressWarnings("rawtypes")
        public HttpResponse<?> handle(HttpRequest request, PedidoNotFoundException exception) {
            return HttpResponse.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
        }
    }
}
