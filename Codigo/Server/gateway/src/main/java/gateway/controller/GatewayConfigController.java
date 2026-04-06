package gateway.controller;

import java.util.Map;

import io.micronaut.context.annotation.Value;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;

@Controller("/gateway")
public class GatewayConfigController {

    @Value("${proxy.targets.usersservice}")
    private String targetUsers;

    @Value("${proxy.targets.vehiclesservice}")
    private String targetVehicles;

    @Value("${proxy.targets.rentalsservice}")
    private String targetRentals;

    @Value("${proxy.targets.contratoservice}")
    private String targetContrato;

    @Value("${proxy.targets.reservasservice}")
    private String targetReservas;

    @Get("/config")
    public Map<String, String> getConfig() {
        return Map.of(
            "targetUsers", targetUsers,
            "targetVehicles", targetVehicles,
            "targetRentals", targetRentals,
            "targetContrato", targetContrato,
            "targetReservas", targetReservas
        );
    }
}
