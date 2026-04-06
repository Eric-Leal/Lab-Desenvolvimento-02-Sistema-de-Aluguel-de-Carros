package com.example.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String id) {
        super(resource + " com ID " + id + " não foi encontrado.");
    }

    @Singleton
    public static class Handler implements ExceptionHandler<ResourceNotFoundException, HttpResponse<?>> {
        @Override
        @SuppressWarnings("rawtypes")
        public HttpResponse<?> handle(HttpRequest request, ResourceNotFoundException exception) {
            return HttpResponse.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
        }
    }
}
