# AGENTS.md — правила работы с `ivaoby/frontend`

> Файл коммитится в репозиторий. Он нужен, чтобы любой разработчик и любой ИИ-ассистент
> работали с проектом в одних границах. Не редактируй его молча — правки обсуждаются с владельцем.

## Что это

Публичный сайт дивизии IVAO Belarus — <https://by.ivao.aero>.
SPA на React, который читает **только** данные из `ivaoby/api` (cookie-сессия, без своего бэкенда).
Показывает новости, агенду, справочник аэродромов с METAR/TAF, структуру staff, нормативные
документы, события с бронированием ATC-смен, разрешения на технику, FAQ и памятку новичка.
Три языка: `be` / `en` / `ru`.

## Стек

- React 18.2, TypeScript 5.3, **`strict: false`**
- Vite 5.4 (`vite.config.mts`), dev-порт **3310**, `base: '/'`
- Tailwind 3.4 + PostCSS; Mantine 6 (`@mantine/form`, `hooks`, `notifications`); Headless UI 2.1
- TanStack Query 5.62 (+ persist-client, query-sync-storage-persister, devtools), axios 1.8
- react-router-dom 6.20, i18next 23 + react-i18next + browser-languagedetector
- date-fns, `@tabler/icons-react`, `react-snowfall` (сезонный эффект), mapbox-gl (маршрут отключён)
- Yarn **4.14.1**, `nodeLinker: node-modules`
- ESLint 8 + `@ivao/eslint-config`, Prettier + `@ivao/prettier-config`

## Команды

```bash
corepack enable
yarn install
yarn dev          # http://localhost:3310
yarn build        # tsc && vite build
yarn preview
yarn lint
yarn format       # prettier src -w
```

Тестов **нет** — ни фреймворка, ни скрипта `test`. Пока их нет, добавление новой функциональности
без проверки вручную — риск.

## Что можно делать свободно

- читать код и историю; править вёрстку, стили, тексты, переводы, локализацию
- добавлять страницы/компоненты, работающие с уже существующими эндпоинтами API
- править `tailwind.config.ts`, тему Mantine, ассеты
- добавлять тесты, если в проекте появится тестовый раннер

## Что — только после явного подтверждения владельца

- **что угодно, меняющее состояние прода**: деплой, заливка `dist`, правка `.env` на сервере,
  перезапуск, правка nginx/`.htaccess`/сертификатов
- изменение **контракта API** (новые/переименованные эндпоинты, изменение полей ответа):
  это затрагивает `api` и `admin.by.ivao.aero`
- удаление или переименование публичных маршрутов
- изменение структуры `public/` (там `.htaccess` — SPA-fallback)
- массовая замена текстов во всех трёх локалях

## Что нельзя трогать

- `.env`, `.env.example` с секретами — секретов там быть не должно вообще
- `.yarnrc.yml` — токена в нём нет, и он не нужен: `@ivao/*` в `yarn.lock` резолвятся с публичного
  npm, а не с `npm.pkg.github.com`. В **истории** репозитория PAT остаётся — историю не
  переписываем (решение владельца 15.11.2026), но он отозван: GitHub API отвечает
  `401 Bad credentials`. Не добавлять токены в tracked-файлы
- чужие ветки: `fix/redesign`, `squircle-redesign`, `IVAOBY-31-Добавить-проверку-доступов-по-департаменту`
  (последняя — незавершённая реализация доступа по департаментам, в `main` её нет).
  В `squircle-redisign` PAT убран из `.yarnrc.yml` 15.11.2026 — остальное в ветке не трогать

## Известные ловушки

1. **🔴 Сборка сейчас падает.** Коммит `a4c7e84` (20.10.2026) удалил `@ivaoby/common`
   из `package.json` и `yarn.lock`, но импорты остались:
   - `src/types/Airport.ts:4` — `@ivaoby/common/types/data/internal/ivao-weather`
   - `src/components/MainPage/components/OnlineInfo.tsx:4-5` — `@ivaoby/common/types/tracker/internal/…`

   `types/Airport.ts` входит в граф сборки (`useAirports.ts` → `AirportPage`) → ожидается TS2307.
   Варианты: вернуть зависимость, либо убрать импорты и заменить типы локальными.
   **Это первое, что надо починить в этом репозитории.**
2. **`origin/main` отстаёт от `origin/dev` на 8 коммитов**, а `dev` обновлялся позже
   (24.10.2026). Сначала выяснить, какой ветке принадлежит прод.
3. **Ветка-зомби** `IVAOBY-Добавить-проверку-доступов-по-департаменту` (+2 / **−89** от `main`,
   последний коммит 15.08.2025) содержит незавершённую реализацию доступа по департаментам:
   `src/hooks/useDepAccess.ts`, `src/components/Private/index.tsx`, сильно переписанные
   `useBookingMutations.tsx` и `ShiftComponent.tsx` (+860 строк). В `main` этой идеи нет —
   если она нужна, её надо дописать, а не просто смержить.
4. **Дублирование ESLint-конфига**: правила есть и в `package.json`, и в `.eslintrc` — и они различаются.
5. **Скрипт `commitmsg` мёртвый**: ссылается на `commitlint`/`husky`, которых в зависимостях нет.
6. **`.gitignore` игнорирует `yarn.lock`**, хотя файл tracked — противоречие, приводит к расхождениям.
7. **Неиспользуемые зависимости**: `jwt-decode`, `mapbox-gl`/`react-map-gl` (маршрут `/map` закомментирован),
   `@mantine/form` (только в отключённом `ContactUs.tsx`).
8. **Ошибки обрабатываются не везде**: Error Boundary в `App.tsx` нет, `pages/training/index.tsx` —
   заглушка из пустых `<div>`.
9. **Дублирование обработки ошибок 401**: axios-интерсептор и `UserContext` дублируют редирект на логин.
10. **Мёртвый код**: `src/pages/MapPage.tsx`, `src/components/MainPage/components/OnlineInfo.tsx`,
    `src/hooks/types.ts` (`DecodedTokenInt` — следы прежней JWT-схемы), `src/components/MessageOverlay.tsx`.

## Что считается готовым изменением

- `yarn lint` — без ошибок
- `yarn build` — **проходит** (сейчас не проходит — см. ловушку 1)
- ручная проверка затронутых страниц в dev-режиме
- новые/изменённые строки переведены во **все три** локали
- никаких новых секретов в tracked-файлах

## Контакты

Владелец продукта и релизов — **Pavel Sidorovich (BY-DIR)**.
Перед слиятием в `main` и перед деплоем — к нему.
