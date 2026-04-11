package gateway.controller;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

@Controller
public class HealthController {

    @Get("/ping")
    public String ping() {
        return "ok";
    }
}
