package com.example.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;

public class PlacaAlreadyInUseException extends RuntimeException {
    public PlacaAlreadyInUseException(String placa) {
        super("Placa '" + placa + "' já está cadastrada.");
    }

    @Singleton
    public static class Handler implements ExceptionHandler<PlacaAlreadyInUseException, HttpResponse<?>> {
        @Override
        @SuppressWarnings("rawtypes")
        public HttpResponse<?> handle(HttpRequest request, PlacaAlreadyInUseException exception) {
            return HttpResponse.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
        }
    }
}
