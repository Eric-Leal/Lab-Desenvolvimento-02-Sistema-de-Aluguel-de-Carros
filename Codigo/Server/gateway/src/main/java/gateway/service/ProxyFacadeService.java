package gateway.service;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.client.ProxyHttpClient;
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Singleton
public class ProxyFacadeService {

    /**
     * Aplica os cabeçalhos de CORS manualmente na resposta.
     */
    public MutableHttpResponse<?> applyCorsHeaders(MutableHttpResponse<?> res) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
        res.header("Access-Control-Allow-Credentials", "true");
        return res;
    }

    /**
     * Resolve o path, removendo prefixos passados pelas variáveis das Controllers
     * para mapear na raiz do microserviço. Cria uma nova requisição limpa para Proxy.
     */
    public Publisher<MutableHttpResponse<?>> forward(ProxyHttpClient targetClient, HttpRequest<?> originalRequest, @Nullable String path) {
        String tempPath = (path == null || path.isEmpty()) ? "/" : path;

        if (!tempPath.startsWith("/")) {
            tempPath = "/" + tempPath;
        }

        final String finalPathToUse = tempPath;
        System.out.println("[GATEWAY FACADE] Resolving Proxy Request to internal path: " + finalPathToUse);

        HttpRequest<?> finalRequest = originalRequest.mutate()
                .uri(java.net.URI.create(finalPathToUse));

        return Flux.from(targetClient.proxy(finalRequest)).map(this::applyCorsHeaders);
    }

    /**
     * Responde requisições de configuração OPTIONS (Preflight Security Test do Navegador).
     */
    public Publisher<MutableHttpResponse<?>> respondOptionsPreflight() {
        return Mono.just(applyCorsHeaders(HttpResponse.ok()));
    }
}
