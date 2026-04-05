package com.example.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;

public class AutomovelNotFoundException extends RuntimeException {
    public AutomovelNotFoundException(Long matricula) {
        super("Automóvel com matrícula " + matricula + " não encontrado.");
    }

    @Singleton
    public static class Handler implements ExceptionHandler<AutomovelNotFoundException, HttpResponse<?>> {
        @Override
        @SuppressWarnings("rawtypes")
        public HttpResponse<?> handle(HttpRequest request, AutomovelNotFoundException exception) {
            return HttpResponse.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
        }
    }
}
