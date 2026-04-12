package com.example.controller;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

@Controller
public class HealthController {

    @Secured(SecurityRule.IS_ANONYMOUS)
    @Get("/")
    public String index() {
        return "vehiclesService online";
    }

    @Secured(SecurityRule.IS_ANONYMOUS)
    @Get("/ping")
    public String health() {
        return "ok";
    }
}
