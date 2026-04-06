package gateway.controller;

import org.reactivestreams.Publisher;

import gateway.service.ProxyFacadeService;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Options;
import io.micronaut.http.annotation.Patch;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.client.ProxyHttpClient;
import io.micronaut.http.client.annotation.Client;
import jakarta.inject.Inject;

@Controller("/contratoService")
public class ContratoServiceController {

    @Inject
    @Client("${proxy.targets.contratoservice}")
    private ProxyHttpClient contratoServiceClient;

    @Inject
    private ProxyFacadeService proxyFacade;

    @Get("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyGet(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(contratoServiceClient, request, path);
    }

    @Post("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyPost(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(contratoServiceClient, request, path);
    }

    @Put("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyPut(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(contratoServiceClient, request, path);
    }

    @Delete("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyDelete(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(contratoServiceClient, request, path);
    }

    @Options("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyOptions(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.respondOptionsPreflight(request);
    }

    @Patch("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyPatch(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(contratoServiceClient, request, path);
    }
}
