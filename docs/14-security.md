# Security Architecture
## Smart School Timetable Management and Optimization System

---

## 1. Security Layers

```
┌──────────────────────────────────────────────────────┐
│              Layer 1: Network Security                │
│  Cloudflare DDoS + WAF + Rate Limiting               │
├──────────────────────────────────────────────────────┤
│              Layer 2: Transport Security              │
│  TLS 1.3 (HTTPS) + HSTS                              │
├──────────────────────────────────────────────────────┤
│              Layer 3: Application Security            │
│  JWT Auth + RBAC + CSRF + XSS Headers + Rate Limit   │
├──────────────────────────────────────────────────────┤
│              Layer 4: Data Security                   │
│  bcrypt hashing + field encryption + parameterized   │
│  queries + audit logs                                 │
├──────────────────────────────────────────────────────┤
│              Layer 5: Infrastructure Security         │
│  Docker isolation + secrets management + backups     │
└──────────────────────────────────────────────────────┘
```

---

## 2. Authentication Architecture

### 2.1 JWT Token Strategy

```java
// Token configuration
ACCESS_TOKEN:
  algorithm:  RS256 (RSA 2048-bit)
  expiry:     15 minutes
  claims:     userId, email, roles, schoolId, sessionId
  storage:    Client memory (NOT localStorage - XSS risk)

REFRESH_TOKEN:
  algorithm:  UUID v4 (random, not JWT)
  expiry:     7 days
  storage:    HttpOnly cookie (XSS-safe) OR DB (server-side)
  rotation:   Each use issues a new refresh token (RTR)
  revocation: Stored as hash in DB + Redis
```

### 2.2 Token Rotation (Refresh Token Rotation)

```
1. Client sends refresh token
2. Server verifies token hash in Redis
3. Server IMMEDIATELY invalidates old token
4. Server issues new access token + new refresh token
5. Client stores new tokens
6. If old token used again → DETECT THEFT → invalidate all user sessions
```

### 2.3 Spring Security Configuration

```java
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())             // JWT stateless = no CSRF needed
            .cors(cors -> cors.configurationSource(corsConfigSource()))
            .sessionManagement(sess ->
                sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/schools/*/timetables/*/entries").hasAnyRole("TEACHER", "VIEWER", "SCHEDULER", "ACADEMIC_MANAGER", "SCHOOL_ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/v1/schools/*/timetables/*/generate").hasAnyRole("SCHEDULER", "ACADEMIC_MANAGER", "SCHOOL_ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/v1/schools/*/timetables/*/publish").hasAnyRole("ACADEMIC_MANAGER", "SCHOOL_ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/v1/schools/**").hasAnyRole("SCHOOL_ADMIN", "SUPER_ADMIN", "ACADEMIC_MANAGER", "SCHEDULER")
                .requestMatchers("/api/v1/users/**").hasAnyRole("SCHOOL_ADMIN", "SUPER_ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(unauthorizedHandler())
                .accessDeniedHandler(accessDeniedHandler())
            )
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "https://timetable.school.uz",
            "http://localhost:3000"  // dev only
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Request-ID"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

### 2.4 JWT Auth Filter

```java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (token != null && tokenProvider.validateToken(token)) {
            UUID userId = tokenProvider.getUserIdFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserById(userId);

            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Inject school context for multi-tenancy
            String schoolId = tokenProvider.getSchoolIdFromToken(token);
            TenantContext.setCurrentSchool(schoolId);
        }

        filterChain.doFilter(request, response);
        TenantContext.clear();
    }

    private String extractToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
```

---

## 3. Role-Based Access Control (RBAC)

### 3.1 Permission Matrix

| Permission | Super Admin | School Admin | Academic Mgr | Scheduler | Teacher | Viewer |
|------------|:-----------:|:------------:|:------------:|:---------:|:-------:|:------:|
| school:create | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| school:manage | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| branch:manage | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| teacher:manage | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| teacher:view | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| classroom:manage | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| subject:manage | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| curriculum:manage | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| timetable:generate | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| timetable:edit | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| timetable:publish | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| timetable:view | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| timetable:export | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| report:view | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| user:manage | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| audit:view | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| availability:self-edit | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |

### 3.2 Method-Level Security

```java
@RestController
@RequiredArgsConstructor
public class TimetableController {

    @PostMapping("/{schoolId}/timetables/generate")
    @PreAuthorize("hasPermission(#schoolId, 'timetable:generate')")
    public ResponseEntity<ApiResponse<TimetableResponse>> generate(
            @PathVariable UUID schoolId,
            @RequestBody GenerateTimetableRequest request) { ... }

    @PostMapping("/{schoolId}/timetables/{id}/publish")
    @PreAuthorize("hasPermission(#schoolId, 'timetable:publish')")
    public ResponseEntity<ApiResponse<Void>> publish(
            @PathVariable UUID schoolId,
            @PathVariable UUID id) { ... }
}
```

---

## 4. Password Security

```java
// Password policy
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 digit
- No common passwords (checked against top-10000 list)

// Storage
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);  // cost factor 12
}

// Validation regex
private static final String PASSWORD_PATTERN =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$";
```

---

## 5. Input Validation and SQL Injection Prevention

```java
// All database queries use JPA/Spring Data (parameterized)
// NEVER use string concatenation in queries

// GOOD:
@Query("SELECT t FROM Teacher t WHERE t.schoolId = :schoolId AND t.fullName LIKE :name")
List<Teacher> findByName(@Param("schoolId") UUID schoolId, @Param("name") String name);

// BAD (never do this):
// String query = "SELECT * FROM teachers WHERE name = '" + name + "'";

// Request validation with Zod-equivalent on backend (Bean Validation)
public record CreateTeacherRequest(
    @NotBlank @Size(max = 255) String fullName,
    @Email @Size(max = 255) String email,
    @Pattern(regexp = "^\\+?[0-9]{10,15}$") String phone,
    @Min(0) @Max(40) int minWeeklyLoad,
    @Min(1) @Max(40) int maxWeeklyLoad
) {}
```

---

## 6. XSS Protection

```java
// Global exception handler returns sanitized responses
// No raw HTML rendered from user input
// All API responses are JSON with Content-Type: application/json

// Nginx security headers (in nginx.conf):
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'; ...";
add_header X-Content-Type-Options "nosniff";

// Frontend: Next.js escapes all rendered values by default
// DOMPurify used for any HTML that must be rendered
```

---

## 7. Rate Limiting

```java
@Bean
public RateLimiter rateLimiter() {
    // Per-IP, per-endpoint
    Map<String, Bandwidth> limits = Map.of(
        "/api/v1/auth/login",    Bandwidth.simple(10, Duration.ofMinutes(1)),
        "/api/v1/auth/refresh",  Bandwidth.simple(60, Duration.ofMinutes(1)),
        "/api/v1/**",            Bandwidth.simple(1000, Duration.ofMinutes(1))
    );
}

// Also enforced at Nginx level (see nginx.conf)
```

---

## 8. Audit Logging

```java
// All security-relevant events are logged
@EventListener
public class AuditEventListener {
    @Async
    public void onEvent(AuditableEvent event) {
        auditLogRepository.save(AuditLog.builder()
            .userId(event.getUserId())
            .schoolId(event.getSchoolId())
            .action(event.getAction())
            .entityType(event.getEntityType())
            .entityId(event.getEntityId())
            .oldValue(event.getOldValue())
            .newValue(event.getNewValue())
            .ipAddress(event.getIpAddress())
            .build());
    }
}

// Audited events:
USER_LOGIN, USER_LOGOUT, USER_LOGIN_FAILED,
ACCOUNT_LOCKED, PASSWORD_RESET_REQUESTED, PASSWORD_RESET_COMPLETED,
TOKEN_REVOKED, SESSION_REVOKED,
TIMETABLE_GENERATED, TIMETABLE_PUBLISHED, TIMETABLE_DELETED,
SCHOOL_CREATED, SCHOOL_UPDATED,
USER_CREATED, USER_ROLE_CHANGED, USER_DEACTIVATED
```

---

## 9. Data Encryption

```java
// Sensitive fields encrypted at rest using AES-256
@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String attribute) {
        return attribute == null ? null : AesEncryption.encrypt(attribute, encryptionKey);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AesEncryption.decrypt(dbData, encryptionKey);
    }
}

// Applied to:
// school_settings.smtp_password
// notification_settings.telegram_bot_token
// Any PII not needed for searching
```

---

## 10. Multi-Tenancy Security

```java
// Every service method validates schoolId matches authenticated user's school
@Aspect
@Component
public class TenantSecurityAspect {

    @Before("@annotation(SchoolScoped) && args(schoolId, ..)")
    public void enforceSchoolAccess(UUID schoolId) {
        CustomUserDetails user = getCurrentUser();
        if (!user.isSuperAdmin() && !schoolId.equals(user.getSchoolId())) {
            throw new ForbiddenException("Boshqa maktab ma'lumotlariga kirish taqiqlangan");
        }
    }
}

// All repository queries include school_id filter:
@Query("SELECT c FROM Classroom c WHERE c.schoolId = :schoolId AND c.deletedAt IS NULL")
List<Classroom> findBySchool(@Param("schoolId") UUID schoolId);
```

---

## 11. OWASP Top 10 Mitigation

| OWASP Risk | Mitigation |
|------------|-----------|
| A01 Broken Access Control | RBAC + method security + school isolation |
| A02 Cryptographic Failures | TLS 1.3 + bcrypt + AES-256 field encryption |
| A03 Injection | JPA parameterized queries + Bean Validation |
| A04 Insecure Design | Clean Architecture + security review |
| A05 Security Misconfiguration | Docker secrets + security headers + CSP |
| A06 Vulnerable Components | Dependabot + regular updates |
| A07 Auth Failures | JWT RTR + account lockout + MFA (roadmap) |
| A08 Software Integrity Failures | Signed Docker images + GitHub Actions |
| A09 Logging Failures | Structured audit logs + alerting |
| A10 SSRF | No user-controlled URLs fetched server-side |
