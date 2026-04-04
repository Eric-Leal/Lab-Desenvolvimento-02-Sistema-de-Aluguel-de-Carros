package com.example.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;

public class WeakPasswordException extends RuntimeException {
    public WeakPasswordException(String message) {
        super(message);
    }

    @Singleton
    public static class Handler implements ExceptionHandler<WeakPasswordException, HttpResponse<?>> {
        @Override
        @SuppressWarnings("rawtypes")
        public HttpResponse<?> handle(HttpRequest request, WeakPasswordException exception) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", exception.getMessage()));
        }
    }
}
