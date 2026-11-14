<p align="center">
  <a href="https://by.ivao.aero" target="_blank">
    <img src="https://cdn.by.ivao.aero/logos/logo_full_b.svg" width="400" alt="IVAO Belarus Division Logo" />
  </a>
</p>

<h1 align="center">IVAO Belarus Division Frontend</h1>

<p align="center">
  Public website of the IVAO Belarus Division — a single-page application for <a href="https://by.ivao.aero">by.ivao.aero</a>
</p>

<p align="center">
  <a href="https://github.com/IVAOBY/frontend/blob/main/package.json">
    <img src="https://img.shields.io/badge/license-UNLICENSED-red" alt="License" />
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/built%20with-React%2018-61DAFB" alt="Built with React" />
  </a>
  <a href="https://vitejs.dev">
    <img src="https://img.shields.io/badge/built%20with-Vite%205-646CFF" alt="Built with Vite" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript" />
  </a>
</p>

---

## 📋 Overview

The frontend for [by.ivao.aero](https://by.ivao.aero). It is a React SPA that reads **only** data from [`ivaoby/api`](https://github.com/IVAOBY/api) (cookie-based session, no backend of its own). It shows news, the agenda, an airport directory with METAR/TAF, the staff structure, normative documents, events with ATC position booking, vehicle permissions, a FAQ and a newcomer's guide.

The site is trilingual: Belarusian (`be`), English (`en`) and Russian (`ru`). The API client is generated from the backend's OpenAPI spec (see [API client generation](#-api-client-generation)).

## ✨ Features

- **Main page**: division news and live pilot/ATC activity, with a seasonal snowfall effect in winter
- **Airports**: directory of Belarusian airports with live METAR/TAF
- **Agenda**: division plans and goals
- **Staff**: staff structure by department
- **Documents**: normative and regulatory documents grouped into categories
- **Events**: events with parts and ATC slots that members can book
- **Vehicles**: Follow Me Car permissions
- **Training**: training information and first steps for new pilots
- **FAQ** and **About us**
- **Multilingual**: `be` / `en` / `ru`, with browser language detection

## 🛠️ Technology Stack

| Area          | Tools                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------- |
| Framework     | [React](https://react.dev) 18 on [Vite](https://vitejs.dev) 5                                       |
| Language      | TypeScript 5                                                                                       |
| Styling       | [Tailwind CSS](https://tailwindcss.com) 3 + PostCSS, [Mantine](https://mantine.dev) 6, Headless UI  |
| Data          | [TanStack Query](https://tanstack.com/query) 5 (with client persistence) + axios                    |
| Routing       | [react-router-dom](https://reactrouter.com) 6                                                      |
| Localization  | [i18next](https://www.i18next.com) 23 with browser language detection                               |
| API client    | [Orval](https://orval.dev) — react-query client generated from the OpenAPI spec                     |
| Tooling       | Yarn 4, ESLint (`@ivao/eslint-config`), Prettier (`@ivao/prettier-config`)                          |

## 📦 Getting Started

### Prerequisites

- Node.js 18+ (Vite 5 requires Node 18 or newer)
- Yarn 4. It is pinned in `package.json`, so `corepack enable` is enough.
- A running [`ivaoby/api`](https://github.com/IVAOBY/api) instance to serve data — the production API is the default, so you can develop against it out of the box.

### Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/IVAOBY/frontend.git
   cd frontend
   corepack enable
   yarn install
   ```

2. **Configure the environment**

   ```bash
   cp .env.example .env
   ```

   | Variable       | Description                          | Default                        |
   | -------------- | ------------------------------------ | ------------------------------ |
   | `VITE_API_URL` | Base URL of the division backend API | `https://api.by.ivao.aero`     |

   To develop against a local backend, point `VITE_API_URL` at your instance, e.g. `http://localhost:3000`.

## 🚀 Usage

### Development

```bash
yarn dev
```

The app runs at `http://localhost:3310` and the browser opens automatically.

### Production build

```bash
yarn build    # type-checks with tsc, then builds with vite
yarn preview  # serves the production build locally
```

The build is emitted to `dist/`. Deployment to production (the divisional hosting) is handled by the division leadership — production actions are not automated from this repository (see [AGENTS.md](./AGENTS.md)).

### Scripts

| Command        | What it does                                                                       |
| -------------- | ---------------------------------------------------------------------------------- |
| `yarn dev`     | Start the development server on port 3310                                          |
| `yarn build`   | Type-check with `tsc` and compile to `dist/`                                       |
| `yarn preview` | Serve the production build locally                                                 |
| `yarn lint`    | ESLint over `src/`                                                                 |
| `yarn format`  | Format `src/` with Prettier                                                        |
| `yarn gen:api` | Regenerate the typed API client from the backend OpenAPI spec                       |

Type-check without building: `npx tsc --noEmit`.

> [!NOTE]
> There is no test runner wired up yet (testing-library packages are installed, but there is no `test` script). Verify changes manually in the dev server.

## 📖 API Client Generation

The client in `src/api/` is generated with [Orval](https://orval.dev) from the OpenAPI spec the backend serves at `https://api.by.ivao.aero/docs-json`:

```bash
yarn gen:api
```

It generates a react-query client over axios (`src/api/client.ts`, models in `src/api/model/`, one folder per tag), with requests going through the custom axios instance in `src/utils/customInstance.ts` so cookies and the base URL are handled in one place.

Do not edit generated files by hand — the source of truth is the backend contract; change it there and regenerate.

### Authentication

The app does not manage credentials itself. Sign-in is delegated to the backend via IVAO SSO: the browser is redirected to `GET /auth/login` on the API, IVAO redirects back, and the session is a JWT stored in the `auth_token` cookie that every request sends automatically. Expired sessions are handled globally and redirect back to the login URL.

## 🌐 Localization

UI strings live in `src/i18n/locales/` (`be.ts`, `en.ts`, `ru.ts`). The language is detected from the browser and can be switched in the interface.

> [!IMPORTANT]
> Every new or changed user-facing string must be translated into **all three** locales. Missing keys fall back and leave the interface inconsistent between languages.

## 🏗️ Project Structure

```
src/
├── api/            # Generated API client (Orval): client, models, one folder per API tag
├── assets/         # Static assets
├── components/     # Shared UI: layout, header, footer, airport page, main page widgets, …
├── constants/      # App-wide constants
├── context/        # React contexts (user/session)
├── hooks/          # Custom hooks: queries, mutations, helpers
├── i18n/           # i18next setup and locales (be.ts, en.ts, ru.ts)
├── pages/          # Route pages: news, events, staff, documents, training, FAQ, …
├── types/          # Shared TypeScript types
├── utils/          # Helpers: custom axios instance, formatters, …
├── ivaoTheme.ts    # Mantine theme for the division identity
├── App.tsx         # Root component and routes
└── index.tsx       # Entry point
```

## 🤝 Contributing

This is a private project of IVAO Belarus Division; contributions come from division staff.

- Branch off `main` and open a pull request into `main`.
- Before opening a PR, run `yarn lint` and `yarn build`, and manually check the affected pages in the dev server.
- Translate every new or changed string into all three locales (see [Localization](#-localization)).
- There are no pre-commit hooks in this repository: run `yarn format` before committing.
- Conventions for AI coding agents and repository working rules are in [AGENTS.md](./AGENTS.md); known issues are collected in [BUGS.md](./BUGS.md).

## 📧 Contact

- **Email**: by-web@ivao.aero
- **Website**: [by.ivao.aero](https://by.ivao.aero)

## 📄 License

UNLICENSED. This software is proprietary to IVAO Belarus Division.

---

<p align="center">
  Made with ❤️ by IVAO Belarus Division
</p>
