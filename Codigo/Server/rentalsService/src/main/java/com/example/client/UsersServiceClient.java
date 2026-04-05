package com.example.client;

import com.example.dto.client.ClientInfo;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Header;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.client.annotation.Client;

import java.util.UUID;

@Client("${users.service.url}")
public interface UsersServiceClient {

    @Get("/client/{id}")
    ClientInfo getClient(@PathVariable UUID id, @Header("Authorization") String authorization);
}
