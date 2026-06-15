# Production Readiness Checklist
## Smart School Timetable Management and Optimization System

---

## 1. Security Checklist

### Authentication & Authorization
- [ ] JWT RS256 signing with 2048-bit RSA key pair
- [ ] Access token expiry: 15 minutes
- [ ] Refresh token expiry: 7 days with rotation
- [ ] Refresh tokens stored as bcrypt hash in DB
- [ ] Refresh tokens cached in Redis for fast revocation
- [ ] Account lockout after 5 failed attempts (15 min lockout)
- [ ] All endpoints require authentication except `/auth/**`
- [ ] Role-based access control on all protected endpoints
- [ ] Method-level `@PreAuthorize` on sensitive operations
- [ ] School-scoped data access enforcement (multi-tenancy)
- [ ] Password minimum 8 chars with complexity requirements

### Transport Security
- [ ] TLS 1.2+ enforced (TLS 1.0, 1.1 disabled)
- [ ] HSTS header with max-age=31536000
- [ ] Valid SSL certificate (Let's Encrypt or commercial)
- [ ] Certificate auto-renewal configured

### HTTP Security Headers
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Content-Security-Policy` configured
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` configured

### Input Validation
- [ ] Bean Validation on all request DTOs
- [ ] SQL injection prevention (JPA parameterized queries only)
- [ ] No raw string interpolation in queries
- [ ] File upload size limits configured
- [ ] Request body size limits set

### Data Security
- [ ] Passwords hashed with BCrypt cost factor ≥ 12
- [ ] Sensitive fields encrypted at rest (SMTP passwords, tokens)
- [ ] Audit logs for all security events
- [ ] Secrets stored in Docker secrets or env vars (NOT in code)
- [ ] No secrets in Git history

---

## 2. Performance Checklist

### Backend
- [ ] Database connection pool configured (HikariCP, min 5, max 20)
- [ ] Redis caching for frequently accessed data (timetable entries, settings)
- [ ] Database queries analyzed with EXPLAIN ANALYZE
- [ ] N+1 query problems resolved (use JOIN FETCH)
- [ ] Async processing for timetable generation
- [ ] Response compression (GZIP) enabled
- [ ] API response times P95 < 200ms (load tested)
- [ ] Pagination on all list endpoints
- [ ] Database indexes verified (no sequential scans on large tables)

### Frontend
- [ ] Next.js bundle size < 250KB initial JS
- [ ] Images optimized (Next/Image with WebP)
- [ ] Code splitting per route
- [ ] Lazy loading for heavy components (charts, calendar)
- [ ] LCP < 2.5 seconds measured
- [ ] TanStack Query cache configured (staleTime, gcTime)

### Solver
- [ ] Solver time limit configurable (30s to 30min)
- [ ] Progress polling interval: 5 seconds
- [ ] Solver status stored in Redis (survives backend restart)
- [ ] Async solver execution (non-blocking API response)
- [ ] Memory limit for solver JVM: 2GB+

---

## 3. Database Checklist

### Schema
- [ ] All migrations via Flyway (numbered V1, V2...)
- [ ] Foreign key constraints on all relations
- [ ] Check constraints on critical fields
- [ ] NOT NULL on required columns
- [ ] Soft deletes implemented (deleted_at column)
- [ ] UUID primary keys (not sequential integers)
- [ ] updated_at triggers on all mutable tables

### Performance
- [ ] Indexes on all foreign key columns
- [ ] Indexes on frequently filtered columns (school_id, status, email)
- [ ] Composite indexes for common query patterns
- [ ] No full table scans on large tables (> 10K rows)
- [ ] Autovacuum configured

### Backup & Recovery
- [ ] Daily automated backups
- [ ] Backup retention: 30 days
- [ ] Backup restoration tested
- [ ] Point-in-time recovery configured
- [ ] RPO ≤ 1 hour, RTO ≤ 4 hours

---

## 4. Infrastructure Checklist

### Docker & Containers
- [ ] All services containerized
- [ ] Docker Compose production file tested
- [ ] Health checks on all services
- [ ] Restart policies: `unless-stopped`
- [ ] Resource limits set (CPU, memory) per container
- [ ] Non-root users in containers
- [ ] Docker secrets for sensitive values
- [ ] `.dockerignore` files present

### Networking
- [ ] All inter-service communication on internal Docker network
- [ ] Only Nginx exposed to internet (ports 80, 443)
- [ ] Backend and database NOT directly accessible from internet
- [ ] Nginx rate limiting configured

### Monitoring
- [ ] Uptime monitoring (Uptime Kuma or similar)
- [ ] Spring Boot Actuator `/health` endpoint
- [ ] Alerting on downtime (email/Telegram)
- [ ] Log aggregation (JSON structured logs)
- [ ] Disk space alerts (>80% usage)
- [ ] Memory usage monitoring

---

## 5. Application Quality Checklist

### Testing
- [ ] Unit test coverage > 80% (backend)
- [ ] Integration tests for all API endpoints
- [ ] Domain logic unit tests (constraints, validators)
- [ ] Frontend component tests (React Testing Library)
- [ ] End-to-end tests (Playwright) for critical flows:
  - Login/logout
  - Timetable generation
  - Timetable export
  - Teacher availability save
- [ ] Load tests: 500 concurrent users

### Code Quality
- [ ] No `TODO` or `FIXME` in production code
- [ ] No hardcoded secrets or passwords
- [ ] SonarQube / CheckStyle passing (0 blocker issues)
- [ ] TypeScript strict mode enabled
- [ ] ESLint passing with 0 errors

### API Quality
- [ ] OpenAPI 3.0 specification complete
- [ ] All endpoints documented
- [ ] Error responses consistent (ErrorResponse format)
- [ ] Pagination consistent across all list endpoints
- [ ] API versioning in place (`/api/v1/`)

---

## 6. User Experience Checklist

### Uzbek Language
- [ ] 100% of UI text in Uzbek (no English in UI)
- [ ] Error messages in Uzbek
- [ ] Validation messages in Uzbek
- [ ] Date formats in Uzbek locale
- [ ] Export files (PDF/Excel) in Uzbek
- [ ] Email notifications in Uzbek

### Accessibility & Responsiveness
- [ ] Desktop breakpoint (1280px+) fully functional
- [ ] Tablet breakpoint (768px+) usable
- [ ] Mobile breakpoint basic functionality
- [ ] Loading states on all async operations
- [ ] Empty states with helpful Uzbek messages
- [ ] Error boundaries prevent full app crashes

### Timetable Editor
- [ ] Drag and drop works on Chrome, Firefox, Safari, Edge
- [ ] Conflicts shown immediately on drag
- [ ] Undo/redo works correctly (20 steps)
- [ ] Pinned lessons cannot be moved
- [ ] Calendar grid renders correctly for 7 periods × 5 days

---

## 7. Operational Checklist

### Documentation
- [ ] API documentation (Swagger UI) accessible
- [ ] Deployment runbook written
- [ ] Environment variables documented
- [ ] Database migration guide
- [ ] Backup/restore procedure

### Deployment
- [ ] CI/CD pipeline running (GitHub Actions)
- [ ] Zero-downtime deployment strategy
- [ ] Rollback procedure tested
- [ ] Environment separation (dev/staging/prod)
- [ ] Production environment variables set correctly

### Legal & Compliance
- [ ] Data stored in Uzbekistan or compliant region
- [ ] Privacy policy for student data
- [ ] Terms of service

---

## 8. Go-Live Final Checklist

### 48 Hours Before Go-Live
- [ ] Full data migration tested (if migrating from existing system)
- [ ] Production smoke test on staging environment
- [ ] All team members briefed on support procedures
- [ ] Monitoring dashboards operational
- [ ] Rollback plan documented and tested

### Day of Go-Live
- [ ] Database backup taken before deployment
- [ ] Deployment executed during low-traffic window
- [ ] Health check verified post-deployment
- [ ] Critical paths manually tested:
  - [ ] Login works
  - [ ] School management works
  - [ ] Teacher management works
  - [ ] Curriculum entry works
  - [ ] Timetable generation works
  - [ ] Export works
  - [ ] Notification works
- [ ] Monitoring active and alerting tested
- [ ] Support channel open

### Post Go-Live (24 Hours)
- [ ] Monitor error rates (< 0.1% error rate target)
- [ ] Monitor response times (P95 < 200ms)
- [ ] Monitor solver completion rate
- [ ] User feedback collected
- [ ] No critical bugs reported

---

## 9. Compliance Score

```
Security:        ___/30 items
Performance:     ___/18 items
Database:        ___/18 items
Infrastructure:  ___/18 items
Code Quality:    ___/15 items
UX/Uzbek:        ___/15 items
Operations:      ___/12 items

Total: ___/126 items

Production Ready: 120/126 (95%+) items checked
```
