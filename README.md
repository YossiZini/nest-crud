# NestJS CRUD Demo + Interactive Teaching Guide

A minimal NestJS CRUD app built on **Express** with **TypeORM** and **PostgreSQL**, plus an interactive HTML guide that teaches NestJS to Express developers.

## What's Inside

- **CRUD API** — Create, Read, Update, Delete items via `/items` endpoints
- **TypeORM + PostgreSQL** — Entity-based database access with auto-sync
- **Validation** — DTOs with `class-validator` decorators
- **Unit + E2E tests** — Full test coverage with mocked DI
- **Teaching guide** — Interactive HTML pages with code walkthroughs, Express comparisons, and glossary modals

## Prerequisites

- **Node.js** >= 18
- **PostgreSQL** installed and running
- **Git**

---

## Option 1: Teaching Guide Only (Static Pages)

If you only want to view the teaching webpage locally — no database needed.

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YossiZini/nest-crud.git
cd nest-crud

# 2. Install dependencies
npm install

# 3. Open the guide directly in your browser
open public/index.html
# or on Linux:
xdg-open public/index.html
# or on Windows:
start public/index.html
```

That's it. The HTML files in `public/` are self-contained — just open `index.html` and navigate from there.

### Pages

| Page | Description |
|------|-------------|
| `index.html` | Main guide with table of contents and concept overviews |
| `walkthrough-entry.html` | Entry point (`main.ts`) walkthrough |
| `walkthrough-modules.html` | Modules (`AppModule` + `ItemsModule`) walkthrough |
| `walkthrough-entity.html` | Entity (`item.entity.ts`) walkthrough |
| `walkthrough-dto.html` | DTOs walkthrough |
| `walkthrough-service.html` | Service (`items.service.ts`) walkthrough |
| `walkthrough-controller.html` | Controller (`items.controller.ts`) walkthrough |
| `walkthrough-testing.html` | Testing walkthrough (unit + e2e) |

---

## Option 2: Full Demo App (API + Database + Guide)

Run the complete NestJS application with a live API and the teaching guide served at the root.

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YossiZini/nest-crud.git
cd nest-crud

# 2. Install dependencies
npm install

# 3. Start PostgreSQL (if not already running)
# macOS (Homebrew):
brew services start postgresql@14
# Ubuntu/Debian:
sudo systemctl start postgresql
# Windows: Start the PostgreSQL service from Services panel

# 4. Create the database
createdb nest_crud

# 5. (Optional) Configure database connection
# Default config assumes: host=localhost, port=5432, user=postgres, password=postgres
# Override with environment variables if your setup differs:
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=your_pg_username
export DB_PASS=your_pg_password
export DB_NAME=nest_crud

# 6. Start the app
npm run start:dev
```

The app is now running at **http://localhost:3000**:

| URL | What it serves |
|-----|---------------|
| `http://localhost:3000/` | Interactive teaching guide |
| `http://localhost:3000/items` | CRUD API |

### Test the API

```bash
# Create an item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","description":"A cool widget"}'

# List all items
curl http://localhost:3000/items

# Get one item
curl http://localhost:3000/items/1

# Update an item
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Widget"}'

# Delete an item
curl -X DELETE http://localhost:3000/items/1
```

### Run Tests

```bash
# Unit tests (no database required)
npm test

# E2E tests (requires a test database)
createdb nest_crud_test
npm run test:e2e
```

---

## Project Structure

```
src/
├── main.ts                        # Entry point (Express + Nest bootstrap)
├── app.module.ts                  # Root module (DB config, static files, feature imports)
├── items/
│   ├── items.module.ts            # Feature module
│   ├── items.controller.ts        # Route handlers (POST/GET/PUT/DELETE)
│   ├── items.controller.spec.ts   # Controller unit tests
│   ├── items.service.ts           # Business logic + DB operations
│   ├── items.service.spec.ts      # Service unit tests
│   ├── item.entity.ts             # TypeORM entity (maps to DB table)
│   └── dto/
│       ├── create-item.dto.ts     # Validation rules for creating
│       └── update-item.dto.ts     # Validation rules for updating
test/
└── app.e2e-spec.ts                # End-to-end API tests
public/
├── index.html                     # Main teaching guide
├── shared.css                     # Shared styles for walkthrough pages
└── walkthrough-*.html             # Step-by-step code walkthroughs
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | Database user |
| `DB_PASS` | `postgres` | Database password |
| `DB_NAME` | `nest_crud` | Database name |
| `PORT` | `3000` | App server port |

## Troubleshooting

**"connection refused" or "role does not exist"**
Your PostgreSQL user might differ from `postgres`. Check with `whoami` and set `DB_USER` accordingly:
```bash
export DB_USER=$(whoami)
```

**"database nest_crud does not exist"**
Create it:
```bash
createdb nest_crud
```

**PostgreSQL is not running**
```bash
# macOS
brew services start postgresql@14
# Linux
sudo systemctl start postgresql
```
