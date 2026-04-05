package com.example.service.auth;

import com.example.dto.auth.LoginRequest;
import com.example.dto.auth.LoginResponse;
import com.example.exception.InvalidCredentialsException;
import com.example.model.User;
import com.example.repository.agent.AgentRepository;
import com.example.repository.client.ClientRepository;
import io.micronaut.security.token.jwt.generator.JwtTokenGenerator;
import jakarta.inject.Singleton;
import lombok.AllArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Map;
import java.util.Optional;

@Singleton
@AllArgsConstructor
public class AuthService {

    private final ClientRepository clientRepository;
    private final AgentRepository agentRepository;
    private final JwtTokenGenerator jwtTokenGenerator;

    public LoginResponse login(LoginRequest request) {
        Optional<? extends User> userOpt = clientRepository.findByEmail(request.getEmail());
        String role = "CLIENT";

        if (userOpt.isEmpty()) {
            userOpt = agentRepository.findByEmail(request.getEmail());
            role = "AGENT";
        }

        if (userOpt.isEmpty()) {
            throw new InvalidCredentialsException("Email ou senha inválidos.");
        }

        User user = userOpt.get();

        if (!BCrypt.checkpw(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Email ou senha inválidos.");
        }

        Map<String, Object> claims = Map.of(
            "sub", user.getId().toString(),
            "email", user.getEmail(),
            "role", role
        );

        Optional<String> tokenOpt = jwtTokenGenerator.generateToken(claims);

        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Erro ao gerar o token de acesso.");
        }

        return new LoginResponse(tokenOpt.get(), user.getEmail());
    }
}
