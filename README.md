# 💸 FinanceAsistant

Kişisel finanslarınızı yönetmenizi sağlayan bir web uygulamasıdır.  
.NET 8 Web API (Backend) + Next.js 14 (Frontend) stack'i kullanılarak geliştirilmiştir.

---

## 🚀 Özellikler

- JWT ile kullanıcı giriş/çıkış sistemi (admin onaylı)
- Gelir / Gider takibi (kategori bazlı)
- Taksit ekleme ve takvim takibi
- Kişisel + genel kategori sistemi
- Kullanıcı bazlı özet ekranlar (dashboard)
- PostgreSQL veritabanı kullanımı

---

## 📁 Proje Yapısı

FinanceAsistant/ │ ├── backend/FinanceAsistant.API/ │ ├── Controllers/ │ ├── DTOs/ │ ├── Entities/ │ ├── Services/ │ └── FinanceDbContext.cs │ ├── frontend/ (Next.js + Tailwind) │ ├── app/ │ └── public/

---

## ⚙️ Kurulum

### 🧱 Gereksinimler

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js (18+)](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- (Opsiyonel) [Rider](https://www.jetbrains.com/rider/) veya [Visual Studio Code](https://code.visualstudio.com/)

---

### 1️⃣ Backend Kurulumu (.NET)

```bash
cd backend/FinanceAsistant.API
dotnet restore
dotnet ef database update
dotnet run
```

Swagger otomatik açılır: http://localhost:5264/swagger

---

### 2️⃣ Frontend Kurulumu (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Açılan uygulama: http://localhost:3000

---

#### 🔐 Kullanıcı Girişi
Kullanıcılar sadece admin onayı sonrası giriş yapabilir.

Giriş sonrası JWT token localStorage’a kaydedilir.

---

📦 Ortam Değişkenleri
.env.local dosyasına frontend için:

```ini
NEXT_PUBLIC_API_BASE=http://localhost:5264
```
Backend için gerekirse appsettings.json üzerinden ConnectionStrings.DefaultConnection güncellenebilir.

