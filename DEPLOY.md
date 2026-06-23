# Deployment Guide: Vercel + Railway (Bepul)

## Arxitektura
```
Internet → Vercel (Frontend) → Railway (Backend API)
                                     ↓
                             Railway PostgreSQL
                             Railway Redis
```

---

## 1. GitHub'ga yuklash

### 1.1 GitHub'da yangi repository yarating
1. github.com → "New repository"
2. Nom: `school-timetabling-system`
3. Private yoki Public tanlang
4. "Create repository" bosing

### 1.2 Kodni yuklang
```bash
cd "School Timetabling System"
git remote add origin https://github.com/SIZNING_USERNAME/school-timetabling-system.git
git push -u origin main
```

---

## 2. Railway — Backend + Database + Redis

### 2.1 Hisob ochish
1. railway.app → "Login with GitHub"
2. Yangi project yarating: "New Project"

### 2.2 PostgreSQL qo'shish
1. Project ichida "Add Service" → "Database" → "PostgreSQL"
2. Service ochilganda "Variables" tabini oching
3. Quyidagilarni eslab qoling:
   - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### 2.3 Redis qo'shish
1. "Add Service" → "Database" → "Redis"
2. "Variables" tabidan oling:
   - `REDISHOST`, `REDISPORT`, `REDISPASSWORD`

### 2.4 Backend deploy qilish
1. "Add Service" → "GitHub Repo" → Repo tanlang
2. Railway avtomatik `railway.toml` faylini topadi va backend build qiladi
3. "Variables" tabida quyidagilarni kiriting:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
SPRING_REDIS_HOST=${{Redis.REDISHOST}}
SPRING_REDIS_PORT=${{Redis.REDISPORT}}
SPRING_REDIS_PASSWORD=${{Redis.REDISPASSWORD}}
JWT_SECRET=bu-yerga-kamida-32-belgi-kiriting-xavfsiz-kalit
FRONTEND_URL=https://SIZNING_VERCEL_URL.vercel.app
SPRING_PROFILES_ACTIVE=prod
```

4. "Settings" → "Networking" → "Generate Domain" bosib URL oling
   - URL ko'rinishi: `https://xxx.up.railway.app`

---

## 3. Vercel — Frontend

### 3.1 Hisob ochish
1. vercel.com → "Login with GitHub"
2. "Add New Project" → GitHub repo tanlang

### 3.2 Sozlash
- **Root Directory**: `frontend`
- **Framework**: Next.js (avtomatik aniqlanadi)
- **Build Command**: `npm run build`

### 3.3 Environment Variables
Vercel dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://RAILWAY_BACKEND_URL.up.railway.app
NEXT_PUBLIC_APP_NAME=Smart Jadval
```

### 3.4 Deploy
"Deploy" bosing — 2-3 daqiqada tayyor!

### 3.5 Railway'ga Frontend URL'ni qaytaring
Railway backend service → Variables:
```
FRONTEND_URL=https://SIZNING_VERCEL_PROJECT.vercel.app
```

---

## 4. Tekshirish

Backend sog'liq tekshiruvi:
```
https://RAILWAY_URL.up.railway.app/actuator/health
```

API docs:
```
https://RAILWAY_URL.up.railway.app/swagger-ui.html
```

Frontend:
```
https://SIZNING_PROJECT.vercel.app
```

---

## Bepul limtlar

| Xizmat    | Bepul chegarasi                        |
|-----------|----------------------------------------|
| Vercel    | Abadiy bepul, 100GB bandwidth/oy       |
| Railway   | $5/oy kredit (~2-3 oy yetadi)          |
| PostgreSQL| Railway krediti ichida                  |
| Redis     | Railway krediti ichida                  |

## Agar kredit tugasa

Muqobil bepul variantlar:
- **Backend**: Render.com (bepul, lekin 15 daqiqa ishlamasdan uxlaydi)
- **PostgreSQL**: Supabase.com (abadiy bepul 500MB)
- **Redis**: Upstash.com (abadiy bepul 10K request/kun)
