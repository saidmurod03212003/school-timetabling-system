package uz.edu.timetable.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    private static final String[] PUBLIC_PATHS = {
        "/api/v1/auth/**",
        "/api/v1/health",
        "/actuator/**",
        "/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/v3/api-docs/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_PATHS).permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/v1/schools/*/timetables/*/entries",
                    "/api/v1/schools/*/timetables/*/by-class/**",
                    "/api/v1/schools/*/timetables/*/by-teacher/**"
                ).hasAnyRole("VIEWER", "TEACHER", "SCHEDULER", "ACADEMIC_MANAGER",
                              "SCHOOL_ADMIN", "SUPER_ADMIN")
                .requestMatchers(
                    "/api/v1/schools/*/timetables/*/generate",
                    "/api/v1/schools/*/timetables/*/entries/move",
                    "/api/v1/schools/*/timetables/*/entries/swap"
                ).hasAnyRole("SCHEDULER", "ACADEMIC_MANAGER", "SCHOOL_ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/v1/schools/*/timetables/*/publish")
                    .hasAnyRole("ACADEMIC_MANAGER", "SCHOOL_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/schools/**")
                    .authenticated()
                .requestMatchers("/api/v1/schools/**")
                    .hasAnyRole("SCHEDULER", "ACADEMIC_MANAGER", "SCHOOL_ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/v1/users/**")
                    .hasAnyRole("SCHOOL_ADMIN", "SUPER_ADMIN")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        String frontendUrl = System.getenv("FRONTEND_URL");
        List<String> origins = new java.util.ArrayList<>(List.of(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "https://timetable.school.uz",
            "https://frontend-jet-delta-56.vercel.app"
        ));
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            origins.add(frontendUrl);
        }
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Request-ID"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
