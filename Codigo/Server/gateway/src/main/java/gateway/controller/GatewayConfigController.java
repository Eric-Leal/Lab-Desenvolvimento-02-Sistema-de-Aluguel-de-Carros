package gateway.controller;

import io.micronaut.context.annotation.Value;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import java.util.Map;

@Controller("/gateway")
public class GatewayConfigController {

    @Value("${proxy.targets.usersservice}")
    private String targetA;

    @Value("${proxy.targets.microsservicob}")
    private String targetB;

    @Get("/config")
    public Map<String, String> getConfig() {
        return Map.of(
            "targetA", targetA,
            "targetB", targetB
        );
    }
}
