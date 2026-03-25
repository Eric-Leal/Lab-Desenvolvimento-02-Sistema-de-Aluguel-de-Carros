# Guia Rápido: Criação e Renomeação de Microsserviços

Este documento serve como checklist e referência para criar um novo microsserviço ou renomear um existente no monorepo.

---

## 1. Criar Novo Microsserviço

### Passos Básicos
1. **Copie uma pasta modelo**
   - Use `microsservico` ou `microsservico-b` como base.
   - Renomeie a nova pasta (ex: `microsservico-c`).
2. **Renomeie referências internas**
   - Ajuste o `<artifactId>` e `<name>` no `pom.xml`.
   - Atualize o nome do pacote Java se necessário (ex: `com.example` para outro namespace).
   - Ajuste portas e variáveis em `application.properties`.
3. **Adicione ao orquestrador**
   - Edite `Codigo/Server/docker-compose.yml` para incluir o novo serviço.
   - Configure volumes, portas e dependências.
4. **Crie/atualize arquivos `.env`**
   - Copie de `env-pattern` e ajuste valores.
5. **Inclua scripts de automação**
   - Certifique-se de que os scripts em `scripts/` suportam o novo serviço.
6. **Teste localmente**
   - Rode `./scripts/dev.cmd up` e valide endpoints do novo serviço.

### Checklist de Ajustes
- [ ] Nome da pasta
- [ ] `pom.xml` (`artifactId`, `name`)
- [ ] Pacote Java (opcional)
- [ ] `application.properties` (porta, configs)
- [ ] `.env`
- [ ] `docker-compose.yml`
- [ ] Scripts de automação
- [ ] Testes e endpoints

---

## 2. Renomear Microsserviço Existente

1. Renomeie a pasta do serviço.
2. Atualize `pom.xml` (`artifactId`, `name`).
3. Ajuste referências em `docker-compose.yml` e scripts.
4. Atualize nomes de pacotes Java se necessário.
5. Teste toda a automação e endpoints.

---

## 3. Convenções
- Use nomes curtos, sem espaços, minúsculos e separados por hífen ou underline.
- Mantenha a estrutura de pacotes e pastas igual ao modelo.
- Sempre atualize o orquestrador e scripts globais.

---

## 4. Dicas para Automação/IA
- A IA pode seguir este checklist para criar ou renomear serviços automaticamente.
- Se necessário, crie scripts para clonar e ajustar nomes automaticamente.
- Sempre valide o funcionamento após alterações.

---

## 5. Referências
- Consulte o README principal para requisitos de ambiente.
- Veja exemplos em `microsservico` e `microsservico-b`.
- Dúvidas? Consulte o AI_CONTEXT.md ou peça ajuda à equipe.
