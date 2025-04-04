package com.backend.PlanWise.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Disable CSRF for API usage
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").authenticated() // Secure API endpoints
                .anyRequest().permitAll() // Allow other endpoints (e.g., /login) if needed
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(clerkJwtDecoder()))
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, authEx) -> {
                    res.sendError(401, "Unauthorized"); // Return 401 instead of redirect
                })
            );
        return http.build();
    }

    @Bean
    public JwtDecoder clerkJwtDecoder() {
        String jwksUrl = "https://sterling-moth-53.clerk.accounts.dev/.well-known/jwks.json";
         // Debug log
        return NimbusJwtDecoder.withJwkSetUri(jwksUrl).build();
    }
}