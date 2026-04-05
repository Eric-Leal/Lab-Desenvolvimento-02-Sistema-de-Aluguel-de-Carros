package gateway.controller;

import gateway.service.ProxyFacadeService;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.http.client.ProxyHttpClient;
import io.micronaut.http.client.annotation.Client;
import jakarta.inject.Inject;
import org.reactivestreams.Publisher;

@Controller("/rentalsService")
public class RentalsServiceController {

    @Inject
    @Client("${proxy.targets.rentalsservice}")
    private ProxyHttpClient rentalsServiceClient;

    @Inject
    private ProxyFacadeService proxyFacade;

    @Get("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyGet(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(rentalsServiceClient, request, path);
    }

    @Post("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyPost(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(rentalsServiceClient, request, path);
    }

    @Put("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyPut(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(rentalsServiceClient, request, path);
    }

    @Delete("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyDelete(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(rentalsServiceClient, request, path);
    }

    @Options("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyOptions(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.respondOptionsPreflight(request);
    }

    @Patch("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyPatch(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(rentalsServiceClient, request, path);
    }
}
