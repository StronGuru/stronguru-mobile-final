## Repo snapshot for AI coding agents

Quick, actionable notes so an automated agent can be immediately productive in this Expo + React Native codebase.

- Platform: Expo (React Native) app using TypeScript and `expo-router` (file-based routing under `app/`).
- State: global state via `zustand` with `persist` middleware (keys: `auth-storage`, `user-data-storage`).
- API: custom axios client in `api/apiClient.ts` implementing Authorization header + cookie-based refresh flow.
- Realtime: Supabase for realtime + DB access (client at `lib/supabase/client.ts`).

Key commands (development):

- Install: `npm install`
- Start (Expo): `npx expo start` (or `npm start`, `npm run ios`, `npm run android`, `npm run web`)
- Reset starter app: `npm run reset-project`
- Lint: `npm run lint`

Important env variables

- `EXPO_PUBLIC_API_URL` — used by `api/apiClient.ts` baseURL and refresh endpoint
- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — used by `lib/supabase/client.ts`

Auth & API patterns (concrete)

- `api/apiClient.ts` adds `Authorization: Bearer <token>` from `useAuthStore` (see `src/store/authStore.ts`).
- It adds device headers: `X-Device-Id` (from store) and `X-Device-Type: mobile`.
- On 401 it calls `${API_URL}/auth/refresh-token` with `withCredentials: true` to rely on HTTP-only refresh cookies; after a successful refresh it updates `useAuthStore.setAuthData` and replays waiting requests.
- If refresh fails it calls `useAuthStore.logoutUser()` and `useUserDataStore.clearUser()` (look at `src/store/*.ts` for exact effects). Use these files when changing auth behavior.

Supabase / realtime (concrete)

- `lib/supabase/client.ts` creates the supabase client with `realtime.params.eventsPerSecond: 10` and imports polyfills needed for RN (`react-native-get-random-values` and `react-native-url-polyfill/auto`).
- Chat hook: `hooks/use-realtime-chat.native.tsx`:
  - reads current messages from `messages` table filtered by `room`.
  - subscribes to `client.channel(roomName)` and listens for broadcast events with `event: "message"`.
  - `sendMessage` inserts into the `messages` table and then `channel.send({ type: 'broadcast', event: 'message', payload })`.
- Room listing is derived from messages in `src/services/chatService.native.ts` (groups by `room` and extracts last message).

Project conventions & small gotchas

- Path alias `@` is used (check `tsconfig.json` for exact mapping). Import paths like `@/lib/supabase/client` are common.
- `.native.tsx` / `.native.ts` files: platform-specific implementations live alongside shared files — prefer editing the `.native` variant for RN behavior.
- Persistent store names are set in the `persist` middleware: `auth-storage` and `user-data-storage`. But `logoutUser()` explicitly removes AsyncStorage keys `auth_token` and `device_id` — be careful when changing storage keys or the logout flow.
- Lots of console logging is used as the primary debug mechanism (search for `console.log`/`console.error`). Follow those traces when investigating runtime issues.

Files to inspect first when making changes

- `api/apiClient.ts` — request/response interceptors, refresh flow, device header behavior.
- `src/store/authStore.ts` and `src/store/userDataStore.ts` — zustand usage and persisted keys.
- `lib/supabase/client.ts` — supabase config and polyfills for RN.
- `hooks/use-realtime-chat.native.tsx` and `src/services/chatService.native.ts` — realtime subscribe/insert patterns for chat.
- `app/` — route structure (expo-router file-based routing). Look here for UI entry points.

How to change auth or refresh behavior safely

1. Update `api/apiClient.ts` only after reading `authStore` to keep signatures compatible.
2. Preserve `withCredentials: true` on refresh calls unless you also change server cookie semantics.
3. If you change persisted key names, adjust `persist({ name: ... })` and the explicit AsyncStorage removal calls used in `logoutUser()`.

When adding tests or automation

- There are no tests by default. Add small unit tests that mock `apiClient` and `supabase` clients. Prefer isolating `useAuthStore` and `apiClient` interceptors.

If anything here is unclear or you want me to add repository-specific linting or CI checks, tell me which area to expand and I will iterate.
