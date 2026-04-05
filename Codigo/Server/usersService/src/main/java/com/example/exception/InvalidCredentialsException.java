package com.example.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }

    @Singleton
    public static class Handler implements ExceptionHandler<InvalidCredentialsException, HttpResponse<?>> {
        @Override
        @SuppressWarnings("rawtypes")
        public HttpResponse<?> handle(HttpRequest request, InvalidCredentialsException exception) {
            return HttpResponse.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", exception.getMessage()));
        }
    }
}
