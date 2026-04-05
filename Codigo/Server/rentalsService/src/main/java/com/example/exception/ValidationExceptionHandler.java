package com.example.exception;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import io.micronaut.validation.exceptions.ConstraintExceptionHandler;
import jakarta.inject.Singleton;
import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;
import java.util.Map;

@Produces
@Singleton
@Replaces(ConstraintExceptionHandler.class)
public class ValidationExceptionHandler implements ExceptionHandler<ConstraintViolationException, HttpResponse<?>> {

    @Override
    @SuppressWarnings("rawtypes")
    public HttpResponse<?> handle(HttpRequest request, ConstraintViolationException exception) {
        String message = exception.getConstraintViolations().stream()
            .map(violation -> {
                String propertyPath = violation.getPropertyPath().toString();
                String field = propertyPath.substring(propertyPath.lastIndexOf('.') + 1);
                return "O campo '" + field + "' " + violation.getMessage();
            })
            .collect(Collectors.joining(", "));

        return HttpResponse.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("message", "Erro de validação: " + message));
    }
}
