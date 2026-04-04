package com.example.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;

public class EmailAlreadyInUseException extends RuntimeException {
    public EmailAlreadyInUseException(String message) {
        super(message);
    }

    @Singleton
    public static class Handler implements ExceptionHandler<EmailAlreadyInUseException, HttpResponse<?>> {
        @Override
        @SuppressWarnings("rawtypes")
        public HttpResponse<?> handle(HttpRequest request, EmailAlreadyInUseException exception) {
            return HttpResponse.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
        }
    }
}
