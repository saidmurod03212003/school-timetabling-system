package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.UserJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.UserJpaRepository;
import uz.edu.timetable.infrastructure.security.CustomUserDetails;
import uz.edu.timetable.infrastructure.security.JwtTokenProvider;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserJpaRepository userRepository;

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password
    ) {}

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @Valid @RequestBody LoginRequest request) {

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(ApiResponse.error("INVALID_CREDENTIALS", "Email yoki parol noto'g'ri"));
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        userRepository.findByIdAndDeletedAtIsNull(userDetails.getId())
            .ifPresent(u -> {
                u.setLastLoginAt(Instant.now());
                u.setFailedLoginAttempts(0);
                userRepository.save(u);
            });

        List<String> permissions = userRepository.findPermissionCodesByUserId(userDetails.getId());

        UUID sessionId = UUID.randomUUID();
        String accessToken = jwtTokenProvider.generateAccessToken(
            userDetails.getId(),
            userDetails.getEmail(),
            userDetails.getRoleNames(),
            userDetails.getSchoolId(),
            sessionId
        );

        String refreshToken = UUID.randomUUID().toString();

        Map<String, Object> response = Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "tokenType", "Bearer",
            "expiresIn", 900,
            "user", Map.of(
                "id", userDetails.getId(),
                "email", userDetails.getEmail(),
                "fullName", userDetails.getFullName(),
                "roles", userDetails.getRoleNames(),
                "schoolId", userDetails.getSchoolId() != null ? userDetails.getSchoolId().toString() : "",
                "permissions", permissions,
                "isActive", userDetails.isActive()
            )
        );

        log.info("User logged in: {}", userDetails.getEmail());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me() {
        CustomUserDetails userDetails = currentUser();
        List<String> permissions = userRepository.findPermissionCodesByUserId(userDetails.getId());
        Map<String, Object> user = Map.of(
            "id", userDetails.getId(),
            "email", userDetails.getEmail(),
            "fullName", userDetails.getFullName(),
            "roles", userDetails.getRoleNames(),
            "schoolId", userDetails.getSchoolId() != null ? userDetails.getSchoolId().toString() : "",
            "permissions", permissions,
            "isActive", userDetails.isActive()
        );
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refresh(@RequestBody Map<String, String> body) {
        // Simple stub — return new tokens based on session if valid
        return ResponseEntity.status(401).body(ApiResponse.error("INVALID_TOKEN", "Refresh token yaroqsiz"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody Map<String, String> body) {
        log.info("Password reset requested for: {}", body.get("email"));
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "Smart Jadval API"));
    }

    private CustomUserDetails currentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }
}
