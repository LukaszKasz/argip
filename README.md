# Argip - Authentication POC

Proof of Concept aplikacji z autentykacją użytkowników wykorzystującej Docker, FastAPI, React i PostgreSQL.

## 🚀 Stack Technologiczny

- **Backend**: FastAPI (Python 3.11)
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL 15
- **Containerization**: Docker + Docker Compose

## 📋 Wymagania

- Docker Desktop
- Docker Compose (zazwyczaj w pakiecie z Docker Desktop)

## 🏃 Uruchomienie

1. **Sklonuj repozytorium** (lub przejdź do katalogu projektu):
   ```bash
   cd \\wsl$\Ubuntu\home\lkasztelan\projekty\argip
   ```

2. **Uruchom wszystkie serwisy**:
   ```bash
   docker-compose up --build
   ```

3. **Dostęp do aplikacji**:
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:8002
   - API Documentation (Swagger): http://localhost:8002/docs
   - PostgreSQL: localhost:5434

## 🎯 Funkcjonalności

- ✅ Rejestracja użytkowników z walidacją email
- ✅ Logowanie z JWT tokenami
- ✅ Protected routes (dashboard)
- ✅ Hashowanie haseł (bcrypt)
- ✅ Nowoczesny UI z Tailwind CSS
- ✅ Automatyczne tworzenie tabel w bazie danych
- ✅ CORS configuration dla komunikacji frontend-backend

## 📁 Struktura Projektu

```
argip/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── auth.py              # Authentication utilities
│   ├── database.py          # Database configuration
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   ├── api.js           # API client
│   │   └── index.css        # Tailwind styles
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── database/
│   └── init.sql             # Optional DB init script
└── docker-compose.yml       # Docker orchestration
```

## 🔑 API Endpoints

### Public Endpoints
- `POST /register` - Rejestracja nowego użytkownika
  ```json
  {
    "username": "john",
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```

- `POST /login` - Logowanie użytkownika
  ```json
  {
    "username": "john",
    "password": "securepass123"
  }
  ```

### Protected Endpoints (wymagają JWT token)
- `GET /me` - Pobierz informacje o zalogowanym użytkowniku

## 🛠️ Development

### Zatrzymanie aplikacji
```bash
docker-compose down
```

### Zatrzymanie i usunięcie volumes (reset bazy danych)
```bash
docker-compose down -v
```

### Przebudowanie konkretnego serwisu
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### Logi z serwisów
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Dostęp do bazy danych
```bash
docker exec -it argip-db psql -U postgres -d argip_db
```

Przykładowe komendy SQL:
```sql
-- Lista użytkowników
SELECT id, username, email, created_at FROM users;

-- Usunięcie wszystkich użytkowników (dla testów)
TRUNCATE TABLE users RESTART IDENTITY;
```

## 🔒 Bezpieczeństwo

⚠️ **To jest POC - nie używaj w produkcji bez zmian!**

Przed wdrożeniem produkcyjnym:
- Zmień `SECRET_KEY` w pliku `.env`
- Użyj silnych haseł do bazy danych
- Skonfiguruj HTTPS
- Dodaj rate limiting
- Implementuj refresh tokens
- Dodaj walidację po stronie backendu
- Skonfiguruj proper CORS origins

## 📝 Testowanie

1. **Rejestracja**:
   - Otwórz http://localhost:3000
   - Kliknij "Sign up"
   - Wypełnij formularz rejestracji

2. **Logowanie**:
   - Użyj utworzonych credentials
   - Po zalogowaniu zobaczysz dashboard

3. **API Testing**:
   - Otwórz http://localhost:8000/docs
   - Przetestuj endpointy przez Swagger UI

## 🐛 Troubleshooting

**Problem**: Kontenery nie startują
```bash
# Sprawdź logi
docker-compose logs

# Sprawdź status
docker-compose ps
```

**Problem**: Frontend nie łączy się z backendem
- Sprawdź czy backend działa: http://localhost:8002/health
- Sprawdź CORS configuration w `backend/main.py`

**Problem**: Błędy bazy danych
```bash
# Restart bazy danych
docker-compose restart db

# Reset bazy danych
docker-compose down -v
docker-compose up --build
```

## 📄 Licencja

POC - użyj dowolnie do celów edukacyjnych i testowych.
