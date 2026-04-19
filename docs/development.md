## Development setup

### Prerequisites
- Node.js (project uses npm + Vite)
- A PostgreSQL database (local or hosted)

### Install
```bash
npm install
```

### Environment variables

#### Backend (`backend/.env`)
Create `backend/.env` with:

```bash
# Postgres connection string (Neon/local/etc.)
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DB_NAME"

# JWT signing secret used by auth middleware
JWT_SECRET="replace_me"

# Optional (defaults to 3001)
PORT=3001
```

#### Frontend (optional)
You can control the chat strategy via:

```bash
VITE_CHAT_STRATEGY=mock
```

If not set (or not `mock`), the app uses the fallback strategy (Gemini → Mock) where the Gemini strategy calls the backend endpoint at `/api/chat`.

### Run the app

#### Frontend + backend together
```bash
npm run dev:all
```

#### Frontend only
```bash
npm run dev
```

#### Backend only
```bash
npm run dev:backend
```

### Tests
```bash
npm test
```

