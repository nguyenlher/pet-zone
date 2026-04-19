// package com.petstore.petservice.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

// @Configuration
// @EnableWebSecurity
// @EnableMethodSecurity
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//                 .csrf(AbstractHttpConfigurer::disable)
//                 .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                 .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers("/api/pets/public/**").permitAll()
//                         .anyRequest().authenticated()
//                 )
//                 .oauth2ResourceServer(oauth2 -> oauth2
//                         .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter()))
//                 );
//         return http.build();
//     }

//     @Bean
//     public JwtAuthenticationConverter jwtAuthConverter() {
//         JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
//         // Có thể custom converter nếu cần
//         return converter;
//     }

//     @Bean
//     CorsConfigurationSource corsConfigurationSource() {
//         CorsConfiguration config = new CorsConfiguration();
//         config.setAllowedOrigins(List.of("http://localhost:3000"));
//         config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//         config.setAllowedHeaders(List.of("*"));
//         config.setAllowCredentials(true);
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", config);
//         return source;
//     }
// }



package com.petstore.petservice.infra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()  // Cho phép tất cả request
                );
        return http.build();
    }
}