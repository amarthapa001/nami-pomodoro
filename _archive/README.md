# 📦 Archived Features

This directory contains all the original feature code that was moved here to start with a fresh codebase.

**Nothing was deleted** — everything is preserved exactly as it was.

## How to Restore Features

When you're ready to bring a feature back:

### Backend Apps

1. Copy the app folder back:
   ```
   cp -r _archive/backend/apps/users backend/apps/users
   ```

2. Uncomment the app in `backend/config/settings.py`:
   ```python
   INSTALLED_APPS = [
       ...
       "apps.users",  # uncomment this
   ]
   ```

3. If restoring `users`, also uncomment `AUTH_USER_MODEL`:
   ```python
   AUTH_USER_MODEL = "users.User"
   ```

4. Re-add URL include in `backend/config/urls.py`:
   ```python
   path("api/auth/", include("apps.users.urls")),
   ```

5. Run migrations: `make migrate`

### Frontend Features

1. Copy files back:
   ```
   cp -r _archive/frontend/src/pages frontend/src/pages
   cp -r _archive/frontend/src/components frontend/src/components
   cp -r _archive/frontend/src/context frontend/src/context
   cp _archive/frontend/src/api.js frontend/src/api.js
   ```

2. Update `App.jsx` to import and use the restored components
   (refer to `_archive/frontend/src/App.jsx` for the original routing setup)

3. Replace `styles.css` with the full design system:
   ```
   cp _archive/frontend/src/styles.css frontend/src/styles.css
   ```

## Contents

```
_archive/
├── backend/
│   ├── apps/
│   │   ├── users/          # Custom User model, registration, login, JWT auth
│   │   ├── profiles/       # User profiles, avatar upload, bio
│   │   ├── rooms/          # Focus rooms, room sessions
│   │   ├── friends/        # Friend requests, friendships, unfriend
│   │   └── websockets/     # Real-time WebSocket consumer, JWT middleware
│   └── config/
│       └── urls.py         # Original URL config with all app includes
└── frontend/
    └── src/
        ├── pages/
        │   ├── AuthPage.jsx        # Login/Register page
        │   ├── DashboardPage.jsx   # Room dashboard
        │   ├── FriendsPage.jsx     # Friend management
        │   ├── RequestsPage.jsx    # Friend requests
        │   ├── RoomPage.jsx        # Live room with timer + WebSocket
        │   └── SettingsPage.jsx    # Profile settings
        ├── components/
        │   ├── Navbar.jsx          # Navigation bar
        │   ├── ProfileBadge.jsx    # User profile badge
        │   └── TimerCounter.jsx    # Pomodoro timer (SVG circular)
        ├── context/
        │   └── AuthContext.jsx     # Auth state management
        ├── api.js                  # API utility functions
        ├── App.jsx                 # Original App with all routes
        └── styles.css              # Full dark-theme design system (~670 lines)
```
