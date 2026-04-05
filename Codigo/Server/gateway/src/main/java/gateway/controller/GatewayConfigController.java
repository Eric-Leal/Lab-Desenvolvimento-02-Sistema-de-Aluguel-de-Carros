package gateway.controller;

import io.micronaut.context.annotation.Value;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import java.util.Map;

@Controller("/gateway")
public class GatewayConfigController {

    @Value("${proxy.targets.usersservice}")
    private String targetUsers;

    @Value("${proxy.targets.vehiclesservice}")
    private String targetVehicles;

    @Value("${proxy.targets.rentalsservice}")
    private String targetRentals;

    @Get("/config")
    public Map<String, String> getConfig() {
        return Map.of(
            "targetUsers", targetUsers,
            "targetVehicles", targetVehicles,
            "targetRentals", targetRentals
        );
    }
}
