package com.example.controller.auth;

import com.example.dto.auth.LoginRequest;
import com.example.dto.auth.LoginResponse;
import com.example.service.auth.AuthService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Controller("/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Post("/login")
    public HttpResponse<LoginResponse> login(@Body @Valid LoginRequest request) {
        return HttpResponse.ok(authService.login(request));
    }
}
