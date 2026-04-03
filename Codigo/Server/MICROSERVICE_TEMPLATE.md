# Guia Completo: Criação de um Novo Microsserviço

Este documento é o guia definitivo passo a passo para criar um novo microsserviço (ex: `microsservico-c`) e integrá-lo perfeitamente à arquitetura do **API Gateway** e do **Docker**.

Siga a ordem exata abaixo para não esquecer de nada.

---

## Passo 1: Copiar e Estruturar a Pasta
A forma mais segura é copiar um microserviço que já funciona.
1. Na pasta `Codigo/Server`, copie a pasta inteira `microsservico`.
2. Cole e renomeie para o nome do seu novo serviço (ex: `microsservico-c`).
3. Apague pastas geradas automaticamente (como `target` ou `bin`, se houver).

## Passo 2: Atualizar o Maven (`pom.xml`)
Dentro da pasta do seu `microsservico-c`:
1. Abra o arquivo `pom.xml`.
2. Mude o nome do artefato para o nome do seu serviço:
   ```xml
    <artifactId>microsservico-c</artifactId>
    <name>microsservico-c</name>
    ```
3. **Importante:** Verifique se há argumentos de compilador no final do arquivo:
   ```xml
   <arg>-Amicronaut.processing.module=microsservico-c</arg>
   ```

## Passo 3: Configurar os Arquivos `.env`
Seu microsserviço precisa de um arquivo `.env` próprio para rodar.
1. Dentro do `microsservico-c`, crie (ou modifique) o arquivo `.env`.
2. **Importante:** Defina a nova porta do serviço (nenhuma porta pode se repetir na sua máquina local).
   ```env
   # Padrão: Porta 8080 (A), 8081 (B), 8082 (C)...
   MICRONAUT_SERVER_PORT=8082
   
   # Credenciais do Banco
   DB_URL=jdbc:postgresql://localhost:5433/aluguelcarros
   # DB_URL=jdbc:postgresql://postgres:5432/aluguelcarros (Usado quando rodar via Docker)
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   JWT_GENERATOR_SIGNATURE_SECRET=sua_chave_jwt_aqui
   ```

## Passo 4: Atualizar o `application.properties`
No caminho `microsservico-c/src/main/resources/application.properties`:
1. Mude o nome da aplicação para Micronaut registrar corretamente:
   ```properties
   micronaut.application.name=microsservico-c
   ```

## Passo 5: Configurar o Docker Compose (`docker-compose.yml`)
Esta é uma das etapas mais críticas. Abra o arquivo `docker-compose.yml` que fica na raiz do projeto e faça duas coisas:

**A) Adicione o bloco do seu novo serviço:**
```yaml
  microsservico-c:
    build:
      context: ./microsservico-c
      dockerfile: Dockerfile
    ports:
      - "8082:8082"
    environment:
      - DB_URL=jdbc:postgresql://postgres:5432/aluguelcarros
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_GENERATOR_SIGNATURE_SECRET=${JWT_GENERATOR_SIGNATURE_SECRET}
    networks:
      - app-network
    depends_on:
      postgres:
        condition: service_healthy
```

**B) Injetar a URL no Gateway:**
Ainda no `docker-compose.yml`, procure o bloco do serviço `gateway` e adicione a variável para que ele saiba onde achar o seu novo container:
```yaml
  gateway:
    # ... outras configurações ...
    environment:
      - PROXY_TARGETS_MICROSSERVICO=http://microsservico:8080
      - PROXY_TARGETS_MICROSSERVICOB=http://microsservico-b:8081
      - PROXY_TARGETS_MICROSSERVICOC=http://microsservico-c:8082 # NOVO!
```
> [!TIP]
> **DICA DE OURO:** Use nomes sem hífens ou camelCase para as chaves de proxy no YAML (ex: `microsservico-c` vira `microsservicoc` no environment) para evitar que o Micronaut se perca na conversão de Relaxed Binding.

## Passo 6: Registrar o Controller no Gateway
Com a nova arquitetura modular fatiada, não temos mais um "super-arquivo" com tudo misturado. Cada microserviço possui um _Controller_ simples para si.

No projeto do Gateway (`gateway/src/main/java/gateway/controller`), crie o arquivo **`MicrosservicoCController.java`**:

```java
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

@Controller("/microsservico-c")
public class MicrosservicoCController {

    @Inject
    @Client("${proxy.targets.microsservico-c}")
    private ProxyHttpClient microCClient;

    @Inject
    private ProxyFacadeService proxyFacade;

    @Get("{path:.*}")
    public Publisher<MutableHttpResponse<?>> proxyGet(HttpRequest<?> request, @Nullable String path) {
        return proxyFacade.forward(microCClient, request, path);
    }

    // Copie também o mapeamento genérico para @Post, @Put, @Delete e @Options usando a mesma sintaxe delegando para proxyFacade...
}
```
**LEMBRETE (Strip Prefix)**: Como a anotação padrão é `@Controller("/microsservico-c")`, o Gateway corta o `/microsservico-c` da URL antes de enviar para o `proxyFacade`. Quando você criar o código Java no seu novo serviço, declare a rota a partir da raiz `/`. (Exemplo: `@Get("/clientes")`).

## Passo 7: Atualizar o GatewayConfigController (Opcional mas Recomendado)
Se o seu projeto possui um `GatewayConfigController.java` para diagnóstico:
1. Adicione a nova `@Value` apontando para `${proxy.targets.microsservicoc}`.
2. Adicione o novo campo no retorno do método `getConfig()`.

## Passo 8: Compilar e Rodar o Front
Pronto! Abra o terminal na raiz do servidor e recompile tudo para que o Docker construa a nova máquina:
```powershell
.\scripts\dev.cmd rebuild
```
Agora o Gateway responderá perfeitamente na porta 8000 para as rotas do seu novo serviço!
