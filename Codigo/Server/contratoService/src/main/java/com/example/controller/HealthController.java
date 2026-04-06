package com.example.controller;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

@Controller
public class HealthController {

    @Get("/")
    public String index() {
        return "contratoService online";
    }

    @Get("/ping")
    public String health() {
        return "ok";
    }
}
