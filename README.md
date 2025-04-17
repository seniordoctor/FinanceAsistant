# 💸 FinanceAsistant

Kişisel finans yönetimi için geliştirilmiş web tabanlı bir uygulamadır. Gelir, gider ve taksitlerinizi kolayca takip etmenizi sağlar. Ayrıca size özel yatırım tavsiyeleri sunar. Lütfen şunu unutmayın: ben bir Backend Developer'ım o sebepten Frontend becerilerime kızmayın :D

## 🚀 Özellikler

- 👤 Kullanıcı kayıt ve giriş sistemi (Admin onaylı)
- 📊 Dashboard: Toplam gelir, gider ve aylık özet
- 📝 Gelir/Gider ekleme, düzenleme, silme
- 📅 Taksit ekleme ve aylık ödeme takibi
- 📈 Kategori bazlı dağılım grafikleri (Pie Chart)
- 🤖 AI destekli yatırım tavsiyeleri (statik akıllı öneriler)
- 📱 Responsive frontend (Next.js + TailwindCSS)

## 🛠️ Kullanılan Teknolojiler

**Backend**
- ASP.NET Core 8
- EF Core + PostgreSQL
- FluentValidation
- JWT Authentication
- Entity DTO Mapping

**Frontend**
- Next.js (App Router)
- TailwindCSS
- Recharts (grafikler)
- LocalStorage tabanlı oturum kontrolü

---

## 🧪 Kurulum ve Çalıştırma

### Backend

1. `cd backend/FinanceAsistant.API`
2. `dotnet restore`
3. `dotnet ef database update`
4. `dotnet run`

> **Not:** `appsettings.json` içinde PostgreSQL bağlantı bilgilerini güncellemeyi unutma.

### Frontend

1. `cd frontend` (örneğin: `FinanceAsistant`)
2. `npm install`
3. `npm run dev`
---

Made with ❤️ by [Doctor](https://github.com/seniordoctor)
