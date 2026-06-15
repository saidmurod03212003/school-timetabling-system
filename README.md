# Smart School Timetable Management and Optimization System
## Maktab Dars Jadvali Boshqaruv Tizimi

---

## Loyiha haqida

Maktablar uchun dars jadvalini avtomatik yaratish, optimallashtirish va boshqarish uchun ishlab chiqilgan enterprise-darajadagi platforma.

### Asosiy imkoniyatlar
- ✅ Avtomatik dars jadvali yaratish (Timefold Solver)
- ✅ Drag & Drop muharrir (konfliktlarni real vaqtda aniqlash)
- ✅ Ko'p sinfli, ko'p o'qituvchili maktablar uchun
- ✅ PDF, Excel, CSV eksport
- ✅ Email va Telegram bildirishnomalar
- ✅ 100% O'zbek tilidagi interfeys

---

## Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Spring Boot 3, Java 21, Clean Architecture, DDD |
| Solver | Timefold Solver (OptaPlanner vorisi) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Deploy | Docker, Nginx, GitHub Actions |

---

## Tezkor ishga tushirish

### Talablar
- Docker Desktop 4.x+
- Docker Compose 2.x+
- 8GB RAM (Solver uchun)

### 1. Klonlash va sozlash

```bash
git clone https://github.com/your-org/smart-timetable.git
cd smart-timetable

# Muhit o'zgaruvchilarini sozlash
cp .env.example .env
# .env faylini tahrirlang (parollar, SMTP, Telegram)
```

### 2. Ishga tushirish

```bash
docker compose up -d
```

### 3. Ochish

| Xizmat | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| API Docs | http://localhost:8080/api-docs |

### 4. Boshlang'ich kirish

Flyway migratsiyasidan keyin super admin yarating:

```bash
docker compose exec postgres psql -U timetable_user -d timetable_db -c "
  INSERT INTO users (email, password_hash, full_name, is_active, is_email_verified)
  VALUES ('admin@timetable.uz', '\$2a\$12\$...bcrypt_hash...', 'Super Admin', true, true);
"
```

---

## Loyiha tuzilmasi

```
smart-timetable/
├── docs/              # 15 ta hujjat (SRS, arxitektura, API va hokazo)
├── backend/           # Spring Boot 3 / Java 21
│   ├── src/main/java/uz/edu/timetable/
│   │   ├── domain/         # Domain layer (Entities, VOs, Repos)
│   │   ├── application/    # Use cases (Commands, Queries)
│   │   ├── infrastructure/ # JPA, Redis, Solver, Email
│   │   └── presentation/   # Controllers, DTOs, Mappers
│   └── src/main/resources/
│       └── db/migration/   # Flyway SQL migratsiyalari
├── frontend/          # Next.js 15 / React 19
│   └── src/
│       ├── app/       # App Router (auth + dashboard)
│       ├── components/# UI komponentlar (Shadcn + custom)
│       ├── lib/       # API client, utils, validatsiya
│       ├── store/     # Zustand store'lar
│       └── types/     # TypeScript turlari
├── nginx/             # Nginx konfiguratsiya
├── docker-compose.yml # Development
└── .github/workflows/ # CI/CD pipeline
```

---

## Hujjatlar

| # | Hujjat | Tavsif |
|---|--------|--------|
| 01 | [SRS](docs/01-srs.md) | Talablar spetsifikatsiyasi |
| 02 | [Arxitektura](docs/02-architecture.md) | Tizim arxitekturasi |
| 03 | [Ma'lumotlar bazasi](docs/03-database-design.md) | PostgreSQL sxema |
| 04 | [ER Diagramma](docs/04-er-diagram.md) | Jadval munosabatlari |
| 05 | [Backend tuzilma](docs/05-backend-structure.md) | Java papka tuzilmasi |
| 06 | [Frontend tuzilma](docs/06-frontend-structure.md) | Next.js papka tuzilmasi |
| 07 | [API spetsifikatsiya](docs/07-api-specification.md) | REST API endpointlari |
| 08 | [Timefold Solver](docs/08-timefold-solver.md) | Solver dizayni |
| 09 | [Optimallashtirish](docs/09-optimization-logic.md) | Algoritm mantig'i |
| 10 | [UML Diagrammalar](docs/10-uml-diagrams.md) | Tizim diagrammalari |
| 11 | [Yo'l xaritasi](docs/11-roadmap.md) | Rivojlanish rejasi |
| 12 | [Sprint reja](docs/12-sprint-plan.md) | Agile sprintlari |
| 13 | [Deploy](docs/13-deployment.md) | Infratuzilma |
| 14 | [Xavfsizlik](docs/14-security.md) | Security arxitekturasi |
| 15 | [Production tekshiruv](docs/15-production-checklist.md) | Go-live chek-ro'yxat |

---

## Litsenziya

MIT License © 2024 Smart Jadval Team
