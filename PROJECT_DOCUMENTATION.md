# 📋 Nami-Pomodoro — Complete Project Documentation

> **Last Updated:** August 2026
> A collaborative Pomodoro focus-room application with real-time WebSocket sync, friend management, and user profiles.

---

## Table of Contents

- [Tech Stack Overview](#tech-stack-overview)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
  - [Django Configuration](#django-configuration)
  - [Database Models](#database-models)
  - [REST API Endpoints](#rest-api-endpoints)
  - [WebSocket Architecture](#websocket-architecture)
  - [Authentication System](#authentication-system)
- [Frontend Architecture](#frontend-architecture)
  - [React Application](#react-application)
  - [Pages & Components](#pages--components)
  - [State Management (AuthContext)](#state-management-authcontext)
  - [API Layer](#api-layer)
- [DevOps & Infrastructure](#devops--infrastructure)
  - [Makefile Commands](#makefile-commands)
  - [Docker Configuration](#docker-configuration)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Deployment Targets](#deployment-targets)
- [Environment Variables](#environment-variables)
- [Feature Inventory](#feature-inventory)

---

## Tech Stack Overview

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.12 | Runtime |
| **Django** | 6.0.6 | Web framework |
| **Django REST Framework** | 3.17.1 | REST API toolkit |
| **SimpleJWT** | 5.5.1 | JWT authentication (access + refresh tokens) |
| **Django Channels** | 4.0.0 | WebSocket / async protocol support |
| **Daphne** | 4.0.0 | ASGI web server (HTTP + WebSocket) |
| **channels-redis** | 4.2.0 | Redis-backed Channel Layer for pub/sub |
| **PostgreSQL** | 16 | Primary database |
| **Redis** | 7 | Channel Layer backend + caching |
| **Cloudinary** | 1.45.0 | Cloud media storage (avatars) |
| **django-cloudinary-storage** | 0.3.0 | Django Cloudinary integration |
| **WhiteNoise** | 6.12.0 | Static file serving |
| **django-cors-headers** | 4.9.0 | CORS handling for frontend |
| **python-decouple** | 3.8 | Environment variable management |
| **Pillow** | 12.3.0 | Image processing (avatar uploads) |
| **psycopg2-binary** | 2.9.12 | PostgreSQL driver |
| **Twisted** | 26.4.0 | Async networking (Daphne dependency) |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.0.0 | UI library |
| **React DOM** | 19.0.0 | DOM rendering |
| **React Router DOM** | 7.18.2 | Client-side routing |
| **Vite** | 7.0.0 | Build tool & dev server |
| **@vitejs/plugin-react** | 5.0.0 | React JSX/Fast Refresh support |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| **Docker** | Container runtime |
| **Docker Compose** | Multi-container orchestration (backend + db + redis) |
| **GitHub Actions** | CI/CD pipeline |
| **Render** | Backend deployment (Docker-based) |
| **Vercel** | Frontend deployment |
| **GNU Make** (PowerShell) | Developer task runner |
| **Google Fonts (Roboto)** | Typography |

---

## Project Structure

```
nami-pomodoro/
├── .github/
│   └── workflows/
│       └── ci.yaml                # CI/CD pipeline (test → Docker → deploy)
├── backend/
│   ├── apps/
│   │   ├── users/                 # Custom User model & auth endpoints
│   │   │   ├── models.py          # User (UUID PK, email-based auth)
│   │   │   ├── serializers.py     # RegisterSerializer, UserSerializer
│   │   │   ├── views.py           # RegisterView, LogoutView
│   │   │   ├── urls.py            # /api/auth/ routes
│   │   │   ├── admin.py           # Custom UserAdmin
│   │   │   ├── migrations/
│   │   │   ├── apps.py
│   │   │   └── tests.py
│   │   ├── profiles/              # User profile management
│   │   │   ├── models.py          # Profile (1:1 with User, avatar, bio)
│   │   │   ├── serializers.py     # ProfileSerializer, AvatarUploadSerializer
│   │   │   ├── views.py           # MyProfileView, AvatarUploadView, PublicProfileView
│   │   │   ├── urls.py            # /api/profile/ routes
│   │   │   ├── migrations/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   └── tests.py
│   │   ├── rooms/                 # Pomodoro focus rooms
│   │   │   ├── models.py          # Room, RoomSession
│   │   │   ├── serializers.py     # RoomSerializer, RoomSessionSerializer
│   │   │   ├── views.py           # MyRoomView, FriendRoomsView, RoomDetailView
│   │   │   ├── urls.py            # /api/rooms/ routes
│   │   │   ├── migrations/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   └── tests.py
│   │   ├── friends/               # Friend requests & friendships
│   │   │   ├── models.py          # FriendRequest, Friendship
│   │   │   ├── serializers.py     # FriendRequestSerializer, FriendshipSerializer
│   │   │   ├── views.py           # SendFriendRequest, IncomingRequests, Respond, List, Unfriend
│   │   │   ├── urls.py            # /api/friends/ routes
│   │   │   ├── migrations/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   └── tests.py
│   │   └── websockets/            # Real-time WebSocket layer
│   │       ├── consumers.py       # RoomConsumer (timer sync, room state)
│   │       ├── middleware.py       # JWTAuthMiddleware (query-string token)
│   │       ├── routing.py         # ws/rooms/<room_id>/ → RoomConsumer
│   │       └── apps.py
│   ├── config/
│   │   ├── settings.py            # Django settings (DB, JWT, Channels, Cloudinary)
│   │   ├── urls.py                # Root URL configuration
│   │   ├── asgi.py                # ASGI entry (HTTP + WebSocket routing)
│   │   ├── wsgi.py                # WSGI entry (sync fallback)
│   │   └── __init__.py
│   ├── avatars/                   # Sample avatar images
│   ├── media/avatars/             # Uploaded avatar storage (local)
│   ├── docs/
│   │   └── api-contract.yaml      # OpenAPI 3.0.3 specification
│   ├── manage.py                  # Django CLI
│   ├── requirements.txt           # Python dependencies (44 packages)
│   ├── Dockerfile                 # Python 3.12-slim container
│   ├── docker-compose.yml         # PostgreSQL + Redis + Backend services
│   ├── entrypoint.sh              # Container startup (wait-for-db + Daphne)
│   └── .env.example               # Environment template
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # React entry (StrictMode + BrowserRouter)
│   │   ├── App.jsx                # Root component & route definitions
│   │   ├── api.js                 # HTTP/WS utility functions + localStorage auth
│   │   ├── styles.css             # Global dark-theme design system (~670 lines)
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state, API calls, dashboard data provider
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation bar with profile badge & logout
│   │   │   ├── ProfileBadge.jsx   # Reusable avatar + name + bio badge
│   │   │   └── TimerCounter.jsx   # Circular SVG Pomodoro timer (25/5/15 min)
│   │   └── pages/
│   │       ├── AuthPage.jsx       # Login & Registration forms
│   │       ├── DashboardPage.jsx  # Room overview (my room + friend rooms)
│   │       ├── FriendsPage.jsx    # Friend list, add friend, profile lookup
│   │       ├── RequestsPage.jsx   # Incoming friend request management
│   │       ├── RoomPage.jsx       # Live room with timer + WebSocket + participants
│   │       └── SettingsPage.jsx   # Profile editing & avatar upload
│   ├── index.html                 # SPA entry HTML (Roboto font)
│   ├── package.json               # NPM manifest (React 19, Vite 7)
│   ├── vite.config.js             # Vite config (port 5173, strict)
│   ├── .env.example               # VITE_API_BASE_URL template
│   └── .gitignore                 # node_modules, dist, build
├── scripts/
│   └── publish-docker.sh          # Docker Hub build & push script
├── Makefile                       # PowerShell-based dev commands
└── .gitignore                     # Python, Node, editor ignores
```

---

## Backend Architecture

### Django Configuration

**Settings file:** `backend/config/settings.py`

| Setting | Value | Notes |
|---|---|---|
| `AUTH_USER_MODEL` | `users.User` | Custom UUID-based user model |
| `ASGI_APPLICATION` | `config.asgi.application` | HTTP + WebSocket via Daphne |
| `ROOT_URLCONF` | `config.urls` | Root URL config |
| `DATABASE` | PostgreSQL 16 | Via `psycopg2-binary` |
| `CHANNEL_LAYERS` | Redis-backed | `channels_redis.core.RedisChannelLayer` |
| `DEFAULT_FILE_STORAGE` | Cloudinary or FileSystem | Conditional based on env var |
| `STATICFILES_STORAGE` | WhiteNoise compressed | `CompressedManifestStaticFilesStorage` |

**Installed Django Apps:**
- `django.contrib.admin`, `auth`, `contenttypes`, `sessions`, `messages`, `staticfiles`
- `rest_framework`, `rest_framework_simplejwt`, `rest_framework_simplejwt.token_blacklist`
- `corsheaders`, `channels`, `cloudinary`, `cloudinary_storage`
- `apps.users`, `apps.profiles`, `apps.friends`, `apps.rooms`, `apps.websockets`

**Middleware Stack:**
1. `SecurityMiddleware`
2. `WhiteNoiseMiddleware` (static files)
3. `CorsMiddleware`
4. `SessionMiddleware`
5. `CommonMiddleware`
6. `CsrfViewMiddleware`
7. `AuthenticationMiddleware`
8. `MessageMiddleware`
9. `XFrameOptionsMiddleware`

---

### Database Models

#### `users.User`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | Primary key, auto-generated |
| `email` | `EmailField` | Unique, used as `USERNAME_FIELD` |
| `profile_image_url` | `CharField(500)` | Synced from Profile avatar |
| `is_active` | `BooleanField` | Default `True` |
| `is_staff` | `BooleanField` | Default `False` |
| `created_at` | `DateTimeField` | Auto |
| `updated_at` | `DateTimeField` | Auto |

#### `profiles.Profile`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | Primary key |
| `user` | `OneToOneField → User` | `related_name="profile"` |
| `display_name` | `CharField(100)` | |
| `avatar` | `ImageField` | Upload to `avatars/` |
| `profile_image_url` | `CharField(500)` | Auto-synced from avatar on save |
| `bio` | `TextField` | Optional |
| `updated_at` | `DateTimeField` | Auto |

#### `rooms.Room`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | Primary key |
| `owner` | `OneToOneField → User` | `related_name="room"` |
| `name` | `CharField(200)` | e.g., "Alice's Room" |
| `created_at` | `DateTimeField` | Auto |

#### `rooms.RoomSession`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | Primary key |
| `room` | `ForeignKey → Room` | `related_name="sessions"` |
| `user` | `ForeignKey → User` | |
| `status` | `CharField` | Choices: `idle`, `running`, `paused`, `break` |
| `session_count` | `PositiveIntegerField` | Completed Pomodoro count |
| `updated_at` | `DateTimeField` | Auto |
| | | **Unique together:** `(room, user)` |

#### `friends.FriendRequest`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | Primary key |
| `sender` | `ForeignKey → User` | `related_name="sent_requests"` |
| `receiver` | `ForeignKey → User` | `related_name="received_requests"` |
| `status` | `CharField` | Choices: `pending`, `accepted`, `rejected` |
| `created_at` | `DateTimeField` | Auto |
| | | **Unique together:** `(sender, receiver)` |

#### `friends.Friendship`
| Field | Type | Notes |
|---|---|---|
| `id` | `UUIDField` | Primary key |
| `user_a` | `ForeignKey → User` | `related_name="friendships_as_a"` |
| `user_b` | `ForeignKey → User` | `related_name="friendships_as_b"` |
| `created_at` | `DateTimeField` | Auto |
| | | **Unique together:** `(user_a, user_b)` |
| | | **Class method:** `are_friends(user1, user2)` — bidirectional check |

---

### REST API Endpoints

#### Authentication — `/api/auth/`
| Method | Path | View | Auth | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register/` | `RegisterView` | Public | Create account → returns JWT tokens + user data |
| `POST` | `/api/auth/login/` | `TokenObtainPairView` | Public | Email/password → returns access + refresh tokens |
| `POST` | `/api/auth/refresh/` | `TokenRefreshView` | Public | Refresh token → new access token |
| `POST` | `/api/auth/logout/` | `LogoutView` | Bearer | Blacklists refresh token |

**Registration side effects:** Automatically creates a `Profile` and a personal `Room` for the user.

#### Profiles — `/api/profile/`
| Method | Path | View | Description |
|---|---|---|---|
| `GET` | `/api/profile/me/` | `MyProfileView` | Get own profile |
| `PATCH` | `/api/profile/me/` | `MyProfileView` | Update own profile (display_name, bio) |
| `POST` | `/api/profile/me/avatar/` | `AvatarUploadView` | Upload avatar image (multipart/form-data) |
| `GET` | `/api/profile/<uuid:user_id>/` | `PublicProfileView` | View any user's profile |

#### Friends — `/api/friends/`
| Method | Path | View | Description |
|---|---|---|---|
| `GET` | `/api/friends/` | `FriendListView` | List all friendships |
| `POST` | `/api/friends/requests/` | `SendFriendRequestView` | Send friend request (`{ receiver_id }`) |
| `GET` | `/api/friends/requests/incoming/` | `IncomingRequestsView` | List pending incoming requests |
| `PATCH` | `/api/friends/requests/<uuid:pk>/` | `RespondToRequestView` | Accept/reject request (`{ status }`) |
| `DELETE` | `/api/friends/<uuid:pk>/` | `UnfriendView` | Remove friendship |

#### Rooms — `/api/rooms/`
| Method | Path | View | Description |
|---|---|---|---|
| `GET` | `/api/rooms/` | `FriendRoomsView` | List rooms owned by friends |
| `GET` | `/api/rooms/me/` | `MyRoomView` | Get own room |
| `GET` | `/api/rooms/<uuid:room_id>/` | `RoomDetailView` | Get room detail (owner or friend only) |

---

### WebSocket Architecture

**Connection URL:** `ws://localhost:8000/ws/rooms/<room_id>/?token=<JWT_ACCESS_TOKEN>`

**Authentication Flow:**
1. `JWTAuthMiddleware` extracts `?token=` from query string
2. Decodes JWT using SimpleJWT `AccessToken`
3. Attaches authenticated `User` to `scope["user"]`
4. `AllowedHostsOriginValidator` validates origin

**Consumer:** `RoomConsumer` (`AsyncWebsocketConsumer`)

| Event Type | Direction | Description |
|---|---|---|
| `room.state` | Server → Client | Initial state with all sessions on connect |
| `session.update` | Server → Client | Broadcast when any user's timer status changes |
| `timer.start` | Client → Server | User starts focus timer → status = `running` |
| `timer.pause` | Client → Server | User pauses timer → status = `paused` |
| `timer.break` | Client → Server | User switches to break → status = `break` |
| `timer.reset` | Client → Server | User resets timer → status = `idle` |
| `timer.complete` | Client → Server | User completes session → status = `idle`, `session_count += 1` |

**Access Control:** Only room owner or friends of the owner can connect (4001 = unauthenticated, 4003 = unauthorized).

**Channel Layer Group:** `room_{room_id}` — all connected users receive real-time updates.

---

### Authentication System

**Type:** JWT (JSON Web Token) via `djangorestframework-simplejwt`

| Setting | Value |
|---|---|
| Access Token Lifetime | 15 minutes |
| Refresh Token Lifetime | 7 days |
| Token Rotation | Enabled (new refresh on each use) |
| Token Blacklisting | Enabled (old refresh tokens invalidated) |
| Default Permission | `IsAuthenticated` |
| Auth Header | `Authorization: Bearer <access_token>` |

**Token Storage (Frontend):** `localStorage` key `pomodoro.auth` → stores `{ access, refresh, user }`.

---

## Frontend Architecture

### React Application

**Entry Point:** `frontend/src/main.jsx`
- React 19 with `StrictMode`
- `BrowserRouter` from React Router DOM 7
- Global CSS imported (`styles.css`)

**Root Component:** `frontend/src/App.jsx`
- `AuthProvider` wraps `AppContent` (currently commented out — only `Navbar` renders)
- `AppContent` checks auth state and renders protected or public routes

### Pages & Components

#### Pages

| File | Route | Description |
|---|---|---|
| `AuthPage.jsx` | `/auth` | Login/Register toggle form (email, password, display_name) |
| `DashboardPage.jsx` | `/` | Focus dashboard — personal room + friend rooms grid |
| `FriendsPage.jsx` | `/friends` | Add friend by UUID, search profiles, friend list with unfriend |
| `RequestsPage.jsx` | `/requests` | View/accept/reject incoming friend requests |
| `RoomPage.jsx` | `/room/:roomId` | Live focus room — WebSocket timer + participant list |
| `SettingsPage.jsx` | `/settings` | Edit profile (display_name, bio) + avatar upload |

#### Components

| File | Description |
|---|---|
| `Navbar.jsx` | Header nav with links (Dashboard, Friends, Requests, Settings), user avatar badge, pending request count badge, logout button |
| `ProfileBadge.jsx` | Reusable avatar/initial + display name + bio card |
| `TimerCounter.jsx` | Circular SVG Pomodoro timer — Focus (25m), Short Break (5m), Long Break (15m) with start/pause/reset/complete controls |

### State Management (AuthContext)

**File:** `frontend/src/context/AuthContext.jsx`

The `AuthProvider` context manages:

| State | Type | Source |
|---|---|---|
| `auth` | `{ access, refresh, user }` | JWT tokens from login/register |
| `profile` | `Profile object` | `/api/profile/me/` |
| `friends` | `Friendship[]` | `/api/friends/` |
| `incomingRequests` | `FriendRequest[]` | `/api/friends/requests/incoming/` |
| `rooms` | `Room[]` | `/api/rooms/` |
| `myRoom` | `Room` | `/api/rooms/me/` |
| `loading` | `boolean` | Async operation in progress |
| `error` | `string` | Error message |

**Provided Functions:**
- `handleLogin(email, password)` — POST `/api/auth/login/`
- `handleRegister(email, password, display_name)` — POST `/api/auth/register/`
- `refreshAccessToken()` — POST `/api/auth/refresh/`
- `logout()` — POST `/api/auth/logout/` + clear state
- `updateProfile(profileData)` — PATCH `/api/profile/me/`
- `uploadAvatar(file)` — POST `/api/profile/me/avatar/`
- `sendFriendRequest(receiverId)` — POST `/api/friends/requests/`
- `respondToRequest(requestId, status)` — PATCH `/api/friends/requests/<id>/`
- `removeFriend(friendshipId)` — DELETE `/api/friends/<id>/`
- `loadDashboard()` — Parallel fetch of profile, friends, requests, rooms

### API Layer

**File:** `frontend/src/api.js`

| Export | Type | Purpose |
|---|---|---|
| `BACKEND_URL` | `string` | Base URL from `VITE_API_BASE_URL` env var (default `http://localhost:8000`) |
| `backendUrl(path)` | `function` | Construct absolute HTTP URL |
| `backendWsUrl(path, params)` | `function` | Construct WebSocket URL (auto `ws:` / `wss:`) |
| `storage` | `object` | `get()`, `set()`, `clear()` — localStorage `pomodoro.auth` |
| `parseResponse(response)` | `function` | Parse JSON/text, throw on HTTP errors |
| `apiRequest(path, options, token)` | `function` | Fetch wrapper with `Content-Type` + `Authorization: Bearer` |
| `roomSocketUrl(roomId, token)` | `function` | Build `/ws/rooms/<id>/?token=<jwt>` URL |

---

## DevOps & Infrastructure

### Makefile Commands

The Makefile uses **PowerShell** as its shell (`SHELL := powershell.exe`).

| Command | Description |
|---|---|
| `make help` | Print all available commands and URLs |
| `make urls` | Print frontend, backend, API contract, and WebSocket URLs |
| `make setup` | Install frontend npm dependencies |
| `make frontend` | Start Vite dev server at `http://127.0.0.1:5173` |
| `make backend` | Start Django backend via `docker compose up` |
| `make start` | Start frontend (background) + backend (foreground) simultaneously |
| `make services` | Start only PostgreSQL and Redis containers (detached) |
| `make migrate` | Run Django database migrations through Docker Compose |
| `make stop` | Stop all Docker Compose services |

**Default URLs:**
- Frontend: `http://127.0.0.1:5173`
- Backend: `http://localhost:8000`
- WebSocket: `ws://localhost:8000/ws/rooms/{room_id}/?token={access_token}`
- API Contract: `backend/docs/api-contract.yaml`

### Docker Configuration

#### Dockerfile (`backend/Dockerfile`)
- Base: `python:3.12-slim`
- System deps: `libpq-dev`, `gcc`, `netcat-openbsd`
- Installs `requirements.txt`
- Entrypoint: `entrypoint.sh`

#### Docker Compose (`backend/docker-compose.yml`)

| Service | Image | Port | Notes |
|---|---|---|---|
| `db` | `postgres:16-alpine` | 5432 | Persistent volume `postgres_data` |
| `redis` | `redis:7-alpine` | 6379 | Channel Layer backend |
| `backend` | Built from `Dockerfile` | 8000 | Depends on `db` + `redis`, bind-mount source |

#### Entrypoint Script (`backend/entrypoint.sh`)
1. Waits for PostgreSQL to be ready (via `nc` ping)
2. Runs `daphne -b 0.0.0.0 -p 8000 config.asgi:application`
3. Migration & collectstatic commands present but commented out

### CI/CD Pipeline

**File:** `.github/workflows/ci.yaml`

```
Push to main → Test → Docker Build & Push → Deploy Backend (Render) + Deploy Frontend (Vercel)
```

#### Jobs:

| Job | Trigger | Steps |
|---|---|---|
| `test` | Push/PR to `main` | Setup Python 3.12, install deps, run `manage.py test` with PostgreSQL + Redis services |
| `docker` | Push to `main` (after test) | Login to Docker Hub, run `scripts/publish-docker.sh` |
| `deploy-render` | Push to `main` (after docker) | Trigger Render deploy via webhook URL |
| `deploy-vercel` | Push to `main` (after test) | Setup Node 20, `npm install`, `npm run build`, deploy via `amondnet/vercel-action@v25` |

#### Required GitHub Secrets:
- `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `DOCKER_REPOSITORY`
- `RENDER_DEPLOY_HOOK_URL`
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### Deployment Targets

| Target | Service | What |
|---|---|---|
| **Backend** | Render | Docker container (Daphne ASGI server) |
| **Frontend** | Vercel | Static build (Vite production bundle) |
| **Docker Images** | Docker Hub | `<username>/pomodoro-backend:latest` + `:<sha>` |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | ✅ | — | Django secret key |
| `DEBUG` | ❌ | `True` | Debug mode |
| `ALLOWED_HOSTS` | ❌ | `localhost,127.0.0.1` | Comma-separated allowed hosts |
| `DB_NAME` | ✅ | — | PostgreSQL database name |
| `DB_USER` | ✅ | — | PostgreSQL username |
| `DB_PASSWORD` | ✅ | — | PostgreSQL password |
| `DB_HOST` | ❌ | `db` | PostgreSQL host (Docker service name) |
| `DB_PORT` | ❌ | `5432` | PostgreSQL port |
| `REDIS_HOST` | ❌ | `redis` | Redis host (Docker service name) |
| `CLOUDINARY_CLOUD_NAME` | ❌ | `""` | Cloudinary cloud name (if empty → local storage) |
| `CLOUDINARY_API_KEY` | ❌ | `""` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ❌ | `""` | Cloudinary API secret |
| `CORS_ALLOWED_ORIGINS` | ❌ | `http://localhost:5173,...` | Comma-separated CORS origins |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | ❌ | `http://localhost:8000` | Backend API base URL |

---

## Feature Inventory

All features have been moved to `_archive/` for later use. Here's a summary of what exists:

### 1. 🔐 User Registration & Authentication
- Custom User model (UUID, email-based)
- Email + password registration with auto-profile + room creation
- JWT login/logout with token rotation and blacklisting
- Protected routes (frontend) with auth context

### 2. 👤 User Profiles
- Display name, bio, avatar image
- Avatar upload (local or Cloudinary)
- Public profile viewing by user UUID
- Auto-sync avatar URL to User model

### 3. 👥 Friend System
- Send friend requests by user UUID
- View incoming pending requests
- Accept/reject friend requests
- Friendship creates bidirectional link
- Unfriend (delete friendship)
- Profile lookup/search

### 4. 🏠 Focus Rooms
- Personal room auto-created on registration
- View own room and friend rooms on dashboard
- Room access control (owner or friend only)
- Room detail with participant sessions

### 5. ⏱️ Real-Time Pomodoro Timer
- Circular SVG progress timer (Focus 25m, Short Break 5m, Long Break 15m)
- Start, pause, reset, complete controls
- WebSocket-synced timer status across all participants
- Live session count tracking per user
- Connection status indicator (Connected/Connecting/Error)

### 6. 🔌 WebSocket Real-Time Sync
- Django Channels + Redis Channel Layer
- JWT authentication via query string
- Room-scoped groups for broadcast
- Event types: `room.state`, `session.update`, `timer.*`
- Access control (friendship-based)

### 7. 🎨 Design System
- Dark theme with CSS custom properties
- Accent color: `#facc15` (yellow)
- Roboto font (300–900 weights)
- Responsive grid (12-column with breakpoints at 900px, 600px)
- Component styles: navbar, room cards, timer SVG, profile badges, buttons, pills, panels

### 8. 🚀 CI/CD & DevOps
- GitHub Actions multi-job pipeline
- Automated testing with PostgreSQL + Redis services
- Docker image build + push to Docker Hub
- Auto-deploy to Render (backend) + Vercel (frontend)
- PowerShell Makefile for local development
