#!/usr/bin/env bash
#
# Деплой статики сайта дивизии (хостинг IVAO, Plesk).
#
# Обслуживает два сайта:
#   stage.by.ivao.aero — ветка dev  (каталог деплоя .../stage.by.ivao.aero)
#   by.ivao.aero      — ветка main (каталог деплоя .../httpdocs)
#
# Запускается из post-deployment actions репозитория frontend.git:
#     DEPLOY_BRANCH=dev  bash /var/www/vhosts/by.ivao.aero/stage.by.ivao.aero/scripts/deploy.sh
#     DEPLOY_BRANCH=main bash /var/www/vhosts/by.ivao.aero/httpdocs/scripts/deploy.sh
#
# Шаги:
#   0. находит node и yarn: панель исполняет action с PATH=/usr/bin:/bin, где node нет;
#      Node лежит в /opt/plesk/node/<версия>/bin, Yarn 4 — в закоммиченном
#      .yarn/releases/yarn-4.14.1.cjs (nodeLinker: node-modules, не PnP);
#   1. определяет COMMIT_HASH: в каталоге деплоя .git нет (Plesk держит чекаут
#      отдельно), поэтому хэш берётся из bare-репозитория <vhost>/git/*.git —
#      иначе в бандл попал бы 'dev';
#   2. синхронизирует рабочую копию с коммитом: Plesk раскладывает файлы из
#      bare-репозитория, но файлы, удалённые в ветке, из копии НЕ убирает — tsc
#      видит модули старой ветки и падает. Синхронизация удаляет такие файлы и
#      выравнивает содержимое файлов коммита;
#   3. проверяет .yarnrc.yml: файл обязателен (nodeLinker: node-modules), без него
#      yarn install ушёл бы в PnP и node_modules не появился бы;
#   4. yarn install --immutable (генерированный Orval-клиент лежит в git —
#      gen:api на сервере запускать НЕЛЬЗЯ);
#   5. сборка в dist-staging/ явными шагами (tsc, затем vite build --outDir
#      dist-staging) — живой dist/ до проверки не трогаем;
#   6. build-info.json в staging — маркер сборки (commit, branch, builtAt, builtBy);
#   7. атомарная подмена dist/, предыдущий dist остаётся как dist-old-<ts> —
#      готовый откат;
#   8. health-check: build-info.json отдаёт JSON с нужным хэшем (а не index.html
#      из SPA-fallback!), в index.html отдаётся именно собранный ассет, сам ассет
#      отдаётся и содержит хэш, клиентский маршрут отдаёт index.html;
#      если проверка не прошла — автооткат на предыдущий dist.
#
# Почему работа уходит в фоновую сессию:
#   Plesk обрывает post-deployment action примерно через 300 секунд, а сборка
#   на сервере (install + tsc + vite build) идёт дольше. Поэтому скрипт запускает
#   сам себя в отдельной сессии (setsid), ждёт DEPLOY_WAIT секунд и выходит.
#
# Переменные окружения (необязательные):
#   SKIP_INSTALL=1     пропустить yarn install
#   SKIP_BUILD=1       не собирать, только переложить текущий dist
#   NO_ROLLBACK=1      не откатывать, если health-check не прошёл
#   COMMIT_HASH=...    задать хэш вручную (иначе определяется автоматически)
#   DEPLOY_BRANCH=...  ветка деплоя: dev (stage) или main (основной домен)
#   HEALTH_URL=...     URL проверки (по умолчанию берётся из DEPLOY_BRANCH)
#   HEALTH_RETRIES=10  сколько попыток проверки
#   HEALTH_INTERVAL=3  пауза между попытками, секунд
#   DEPLOY_WAIT=240    сколько секунд ждать завершения фонового деплоя
#
# Логи: logs/deploy.log — этапы деплоя и вывод команд, logs/deploy-run.log — сырой
# вывод фоновой сессии, logs/deploy-exit-<ts> — код завершения фонового прогона.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

# Домашний каталог vhost: /var/www/vhosts/by.ivao.aero — там лежат
# bare-репозитории Plesk (git/<имя>.git) и остальные домены.
VHOST_DIR="$(dirname "$APP_DIR")"

DEPLOY_BRANCH="${DEPLOY_BRANCH:-}"
case "$DEPLOY_BRANCH" in
  dev)  DEFAULT_HEALTH_URL="https://stage.by.ivao.aero/" ;;
  main) DEFAULT_HEALTH_URL="https://by.ivao.aero/" ;;
  *)    DEFAULT_HEALTH_URL="https://by.ivao.aero/" ;;
esac

HEALTH_URL="${HEALTH_URL:-$DEFAULT_HEALTH_URL}"
HEALTH_RETRIES="${HEALTH_RETRIES:-10}"
HEALTH_INTERVAL="${HEALTH_INTERVAL:-3}"
DEPLOY_WAIT="${DEPLOY_WAIT:-240}"

LOG_DIR="$APP_DIR/logs"
LOG_FILE="$LOG_DIR/deploy.log"
RUN_LOG="$LOG_DIR/deploy-run.log"
LIVE="$APP_DIR/dist"
STAGING="$APP_DIR/dist-staging"
TS="$(date +%Y%m%d-%H%M%S)"
BACKUP=""
BUILT_ASSET=""
HEALTH_OUT="$(mktemp)"
ROOT_OUT="$(mktemp)"
ASSET_OUT="$(mktemp)"
EXIT_FILE="$LOG_DIR/deploy-exit-$TS"

# Логирование: если logs/ недоступен — пишем только в stdout, деплой не падает.
LOG_OK=0
if mkdir -p "$LOG_DIR" 2>/dev/null && touch "$LOG_FILE" 2>/dev/null; then
  LOG_OK=1
fi

log() {
  local line
  line="$(printf '[%s] %s' "$(date '+%Y-%m-%d %H:%M:%S')" "$*")"
  printf '%s\n' "$line"
  if [ "$LOG_OK" = "1" ]; then
    printf '%s\n' "$line" >>"$LOG_FILE"
  fi
  return 0
}

die() {
  log "ОШИБКА: $*"
  NOTIFY_ERROR="$*"
  exit 1
}

cleanup() {
  rm -f "$HEALTH_OUT" "$ROOT_OUT" "$ASSET_OUT"
}
trap cleanup EXIT

# Команда с выводом в лог: stdout/stderr видно и в консоли деплоя, и в deploy.log.
run_step() {
  log "$*"
  if [ "$LOG_OK" = "1" ]; then
    "$@" 2>&1 | tee -a "$LOG_FILE"
    return "${PIPESTATUS[0]}"
  fi
  "$@"
}

# --- репозиторий и COMMIT_HASH -----------------------------------------------
# В каталоге деплоя .git нет: Plesk держит чекаут отдельно (в <vhost>/git/*.git),
# поэтому `git rev-parse` здесь не работает, а без COMMIT_HASH в бандл попал бы
# 'dev'. Хэш берём из bare-репозитория Plesk: у frontend их два (main и stage),
# оба с remote на IVAOBY/frontend.git — различаем по ветке DEPLOY_BRANCH.
detect_repo_and_commit() {
  local d url h head_ref mtime best_mtime=""
  # Шаг 1: репозиторий, у которого HEAD указывает именно на выкатываемую ветку.
  # У frontend их два (main и stage) с одинаковым remote на IVAOBY/frontend.git,
  # поэтому по одному remote их не различить — различает HEAD.
  if [ -n "$DEPLOY_BRANCH" ]; then
    for d in "$VHOST_DIR"/git/*.git; do
      [ -d "$d" ] || continue
      url="$(git --git-dir="$d" config --get remote.origin.url 2>/dev/null || true)"
      case "$url" in
        *IVAOBY/frontend.git) ;;
        *) continue ;;
      esac
      head_ref="$(git --git-dir="$d" symbolic-ref HEAD 2>/dev/null || true)"
      [ "$head_ref" = "refs/heads/$DEPLOY_BRANCH" ] || continue
      h="$(git --git-dir="$d" rev-parse --short "refs/heads/$DEPLOY_BRANCH" 2>/dev/null || true)"
      [ -n "$h" ] || continue
      printf '%s\t%s\n' "$d" "$h"
      return 0
    done
    # Шаг 2: ветка есть, но HEAD репозитория указывает в другую сторону.
    for d in "$VHOST_DIR"/git/*.git; do
      [ -d "$d" ] || continue
      url="$(git --git-dir="$d" config --get remote.origin.url 2>/dev/null || true)"
      case "$url" in
        *IVAOBY/frontend.git) ;;
        *) continue ;;
      esac
      h="$(git --git-dir="$d" rev-parse --short "refs/heads/$DEPLOY_BRANCH" 2>/dev/null || true)"
      if [ -n "$h" ]; then
        printf '%s\t%s\n' "$d" "$h"
        return 0
      fi
      # Шаг 3: ветка лежит только в remote-tracking refs (fetch без локальной ветки).
      h="$(git --git-dir="$d" rev-parse --short "refs/remotes/origin/$DEPLOY_BRANCH" 2>/dev/null || true)"
      if [ -n "$h" ]; then
        printf '%s\t%s\n' "$d" "$h"
        return 0
      fi
    done
    return 1
  fi
  # Ветка не задана — берём репозиторий, который обновлялся последним.
  for d in "$VHOST_DIR"/git/*.git; do
    [ -d "$d" ] || continue
    url="$(git --git-dir="$d" config --get remote.origin.url 2>/dev/null || true)"
    case "$url" in
      *IVAOBY/frontend.git) ;;
      *) continue ;;
    esac
    mtime="$(stat -c '%Y' "$d" 2>/dev/null || echo 0)"
    if [ -z "$best_mtime" ] || [ "$mtime" -gt "$best_mtime" ]; then
      best_mtime="$mtime"
      for ref in refs/heads/main refs/heads/dev HEAD; do
        h="$(git --git-dir="$d" rev-parse --short "$ref" 2>/dev/null || true)"
        if [ -n "$h" ]; then
          printf '%s\t%s\n' "$d" "$h"
          return 0
        fi
      done
    fi
  done
  return 1
}

# Короткий хэш коммита выкатываемой ветки.
detect_commit() {
  local out h
  out="$(detect_repo_and_commit || true)"
  [ -n "$out" ] || return 1
  h="${out#*$'\t'}"
  [ -n "$h" ] || return 1
  echo "$h"
}

# Путь к bare-репозиторию выкатываемой ветки.
detect_repo() {
  local out
  out="$(detect_repo_and_commit || true)"
  [ -n "$out" ] || return 1
  echo "${out%%$'\t'*}"
}

# --- синхронизация рабочей копии с коммитом ----------------------------------
# Plesk раскладывает файлы из bare-репозитория в каталог деплоя, но файлы,
# удалённые в ветке, из копии НЕ убирает. В копии остаются модули старой ветки
# (например src/utils/Http.ts и src/types/Airport.ts — их удалила миграция на
# Orval), tsc видит их и падает: сборка не идёт, живой dist не трогается.
# Поэтому перед установкой зависимостей приводим копию к состоянию коммита:
#   * удаляем файлы, которые git знает, но которых нет в коммите;
#   * перезаписываем файлы, содержимое которых отличается от коммита.
# Серверные артефакты (node_modules, logs, dist*, .env*, api_booking_ftp, .npmrc)
# не трогаем — это не исходники.
is_protected_path() {
  case "$1" in
    .git|.git/*|node_modules|node_modules/*|logs|logs/*|dist|dist/*|dist-staging|dist-staging/*|dist-old-*|dist-old-*/*|dist-failed-*|dist-failed-*/*|.env|.env.*|.deploy-notify.env|api_booking_ftp|api_booking_ftp/*|.yarn/cache|.yarn/cache/*|.npmrc) return 0 ;;
  esac
  return 1
}

# Приводит каталог деплоя к состоянию коммита из bare-репозитория.
sync_worktree() {
  local repo="$1" commit="$2"
  local manifest known full record meta path blob target tmp local_sha
  local removed=0 restored=0 shown=0
  full="$(git --git-dir="$repo" rev-parse --verify "refs/heads/$DEPLOY_BRANCH" 2>/dev/null || true)"
  if [ -z "$full" ]; then
    full="$(git --git-dir="$repo" rev-parse --verify "refs/remotes/origin/$DEPLOY_BRANCH" 2>/dev/null || true)"
  fi
  if [ -z "$full" ]; then
    full="$(git --git-dir="$repo" rev-parse --verify "$commit" 2>/dev/null || true)"
  fi
  if [ -z "$full" ]; then
    log "   ВНИМАНИЕ: не удалось разрешить коммит $commit — копия не синхронизирована"
    return 1
  fi
  manifest="$(mktemp)" || return 1
  known="$(mktemp)" || { rm -f "$manifest"; return 1; }
  git --git-dir="$repo" ls-tree -r --name-only "$full" 2>/dev/null | LC_ALL=C sort -u >"$manifest" || true
  git --git-dir="$repo" rev-list --all --objects 2>/dev/null \
    | sed -n 's/^[0-9a-f]\{40\} //p' | LC_ALL=C sort -u >"$known" || true

  # 1) файлы, которые git знает, но которых нет в коммите: их удалили в ветке.
  while IFS= read -r path; do
    [ -n "$path" ] || continue
    if is_protected_path "$path"; then continue; fi
    target="$APP_DIR/$path"
    if [ ! -f "$target" ]; then continue; fi
    if rm -f "$target"; then
      removed=$((removed + 1))
      if [ "$shown" -lt 30 ]; then
        shown=$((shown + 1))
        log "   удалён протухший файл: $path"
      fi
    fi
  done < <(LC_ALL=C comm -23 "$known" "$manifest" 2>/dev/null || true)
  if [ "$removed" -gt 0 ]; then
    log "   удалено протухших файлов: $removed"
  fi

  # 2) файлы коммита — достраиваем и выравниваем содержимое.
  while IFS= read -r -d '' record; do
    meta="${record%%$'\t'*}"
    path="${record#*$'\t'}"
    blob="${meta##* }"
    [ -n "$path" ] || continue
    target="$APP_DIR/$path"
    local_sha=""
    if [ -f "$target" ]; then
      local_sha="$(git hash-object -- "$target" 2>/dev/null || true)"
    fi
    if [ "$local_sha" = "$blob" ]; then continue; fi
    tmp="$(mktemp)" || continue
    if git --git-dir="$repo" cat-file blob "$blob" >"$tmp" 2>/dev/null; then
      if mkdir -p "$(dirname "$target")" 2>/dev/null && cat "$tmp" >"$target" 2>/dev/null; then
        restored=$((restored + 1))
        if [ "$shown" -lt 30 ]; then
          shown=$((shown + 1))
          log "   восстановлен из коммита: $path"
        fi
      fi
    fi
    rm -f "$tmp"
  done < <(git --git-dir="$repo" ls-tree -r -z "$full" 2>/dev/null || true)
  if [ "$restored" -gt 0 ]; then
    log "   восстановлено/обновлено файлов: $restored"
  fi

  rm -f "$manifest" "$known"
  return 0
}

# --- уведомления о деплое ------------------------------------------------------
# Уведомления шлёт роут API: POST /ops/deploy-notify. Оформление сообщений
# живёт в API, здесь — только вызов. Секрет и адрес роута лежат в файле
# .deploy-notify.env рядом с приложением (на сервере создаётся вручную).
# Ни одна ошибка отправки не должна ронять деплой: всё уходит в лог.
NOTIFY_PROJECT="frontend"
NOTIFY_REPO="IVAOBY/frontend"
NOTIFY_URL="${DEPLOY_NOTIFY_URL:-https://api.by.ivao.aero/ops/deploy-notify}"
NOTIFY_TOKEN=""
NOTIFY_SENT=0
NOTIFY_COMMIT=""
NOTIFY_BRANCH=""
NOTIFY_VERSION=""
NOTIFY_AUTHOR=""
NOTIFY_DURATION=""
NOTIFY_STAGE=""
NOTIFY_ERROR=""
NOTIFY_ROLLBACK=""
NOTIFY_CONFIRM=""
NOTIFY_DEPLOY_ID=""
NOTIFY_JSON=""

# Значение переменной из файла вида KEY=value (кавычки снимаются).
notify_env_value() {
  local file="$1" key="$2" line
  [ -r "$file" ] || return 1
  line="$(grep -m1 -E "^[[:space:]]*${key}[[:space:]]*=" "$file" 2>/dev/null | cut -d= -f2- || true)"
  [ -n "$line" ] || return 1
  line="${line%\"}"
  line="${line#\"}"
  line="${line%\'}"
  line="${line#\'}"
  printf '%s' "$line"
}

# Секрет и адрес роута: сначала .deploy-notify.env, потом .env приложения.
notify_load_config() {
  local file token="" url=""
  for file in "$APP_DIR/.deploy-notify.env" "$APP_DIR/.env"; do
    [ -r "$file" ] || continue
    if [ -z "$token" ]; then
      token="$(notify_env_value "$file" DEPLOY_NOTIFY_TOKEN || true)"
    fi
    if [ -z "$url" ]; then
      url="$(notify_env_value "$file" DEPLOY_NOTIFY_URL || true)"
    fi
  done
  if [ -n "${DEPLOY_NOTIFY_TOKEN:-}" ]; then
    token="$DEPLOY_NOTIFY_TOKEN"
  fi
  if [ -n "${DEPLOY_NOTIFY_URL:-}" ]; then
    url="$DEPLOY_NOTIFY_URL"
  fi
  NOTIFY_TOKEN="$token"
  if [ -n "$url" ]; then
    NOTIFY_URL="$url"
  fi
  if [ -z "$NOTIFY_TOKEN" ]; then
    log "ВНИМАНИЕ: не найден DEPLOY_NOTIFY_TOKEN — уведомления о деплое не уйдут"
  fi
}

# JSON-строка: переводы строк заменяем пробелами, экранируем \ и "
notify_escape() {
  printf '%s' "${1-}" | tr '\n\r\t' '   ' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

# Добавить поле в тело запроса: notify_add <ключ> <значение> [число]
notify_add() {
  local key="$1" value="${2-}" numeric="${3:-0}"
  [ -n "$value" ] || return 0
  if [ "$numeric" = "1" ]; then
    NOTIFY_JSON="${NOTIFY_JSON:+$NOTIFY_JSON,}\"$key\":$value"
  else
    NOTIFY_JSON="${NOTIFY_JSON:+$NOTIFY_JSON,}\"$key\":\"$(notify_escape "$value")\""
  fi
}

# Отправить уведомление: notify_send <start|success|fail>
notify_send() {
  local event="$1" resp="" code="" body=""
  [ -n "$NOTIFY_TOKEN" ] || return 1
  NOTIFY_JSON=""
  notify_add "event" "$event"
  notify_add "project" "$NOTIFY_PROJECT"
  notify_add "commit" "$NOTIFY_COMMIT"
  notify_add "branch" "$NOTIFY_BRANCH"
  notify_add "version" "$NOTIFY_VERSION"
  notify_add "author" "$NOTIFY_AUTHOR"
  notify_add "duration" "$NOTIFY_DURATION" 1
  notify_add "stage" "$NOTIFY_STAGE"
  notify_add "error" "$NOTIFY_ERROR"
  notify_add "rollback" "$NOTIFY_ROLLBACK"
  notify_add "confirmed" "$NOTIFY_CONFIRM"
  notify_add "repo" "$NOTIFY_REPO"
  notify_add "deployId" "$NOTIFY_DEPLOY_ID"

  resp="$(curl -sS --max-time 15 -w '\n%{http_code}' -X POST \
    -H "X-Deploy-Token: $NOTIFY_TOKEN" \
    -H 'Content-Type: application/json' \
    --data-binary "{${NOTIFY_JSON}}" \
    "$NOTIFY_URL" 2>&1)" || resp=""
  code="$(printf '%s' "$resp" | tail -n 1)"
  body="$(printf '%s' "$resp" | sed '$d')"

  if [ "$code" = "200" ] || [ "$code" = "201" ]; then
    log "   уведомление «${event}» отправлено в Discord"
    return 0
  fi
  log "ВНИМАНИЕ: уведомление «${event}» не отправлено (HTTP ${code:-000}): $(printf '%s' "$body" | head -c 200 | tr -d '\n')"
  return 1
}

# До трёх попыток с паузой: после отката API поднимается не мгновенно.
notify_send_retry() {
  local attempt=1
  while [ "$attempt" -le 3 ]; do
    if notify_send "$1"; then
      return 0
    fi
    attempt=$((attempt + 1))
    if [ "$attempt" -le 3 ]; then
      sleep 5
    fi
  done
  return 1
}

# --- режим запуска ---------------------------------------------------------
# Первый запуск (из Plesk) — только запускает фоновую сессию и ждёт её.
# Второй запуск (DEPLOY_WORKER=1) — сама работа.
if [ "${DEPLOY_WORKER:-0}" != "1" ]; then
  rm -f "$EXIT_FILE"
  export DEPLOY_WORKER=1
  export DEPLOY_TS="$TS"
  export DEPLOY_BRANCH
  mkdir -p "$LOG_DIR" 2>/dev/null || true
  # Уведомляем о старте деплоя: сообщение уходит сразу, до фоновой сборки.
  notify_load_config
  NOTIFY_DEPLOY_ID="$TS"
  NOTIFY_COMMIT="$(detect_commit || true)"
  NOTIFY_BRANCH="$DEPLOY_BRANCH"
  notify_send start || log "ВНИМАНИЕ: уведомление о старте деплоя не отправлено"
  # setsid отделяет фоновую сессию от процесса экшена Plesk — её не убьют,
  # когда панель завершит задачу по таймауту. Если setsid недоступен — nohup.
  if command -v setsid >/dev/null 2>&1; then
    setsid nohup bash "$APP_DIR/scripts/deploy.sh" >>"$RUN_LOG" 2>&1 </dev/null &
  else
    nohup bash "$APP_DIR/scripts/deploy.sh" >>"$RUN_LOG" 2>&1 </dev/null &
  fi
  log "=== Деплой запущен в фоновой сессии, сырой вывод: logs/deploy-run.log ==="

  waited=0
  while [ "$waited" -lt "$DEPLOY_WAIT" ]; do
    if [ -f "$EXIT_FILE" ]; then
      break
    fi
    sleep 3
    waited=$((waited + 3))
  done

  if [ -f "$EXIT_FILE" ]; then
    code="$(cat "$EXIT_FILE" 2>/dev/null || echo 1)"
    log "фоновый деплой завершился с кодом $code"
    if [ "$code" = "0" ]; then
      exit 0
    fi
    exit 1
  fi

  log "деплой ещё выполняется в фоне — детали в logs/deploy-run.log и logs/deploy.log"
  exit 0
fi

# --- фоновый прогон ---------------------------------------------------------
TS="${DEPLOY_TS:-$TS}"
EXIT_FILE="$LOG_DIR/deploy-exit-$TS"
DEPLOY_START_EPOCH="$(date +%s)"

# Фоновая сессия — отдельный процесс, секрет и адрес роута читаем заново.
notify_load_config

worker_cleanup() {
  local code=$?
  rm -f "$HEALTH_OUT" "$ROOT_OUT" "$ASSET_OUT"
  # Результат ещё не отправлен — значит деплой упал: сообщаем об этом.
  if [ "$NOTIFY_SENT" != "1" ]; then
    NOTIFY_STAGE="${NOTIFY_STAGE:-неизвестный этап}"
    NOTIFY_ERROR="${NOTIFY_ERROR:-деплой завершился с кодом $code}"
    NOTIFY_DURATION="$(( $(date +%s) - DEPLOY_START_EPOCH ))"
    notify_send fail || log "ВНИМАНИЕ: уведомление о провале деплоя не отправлено"
  fi
  printf '%s\n' "$code" >"$EXIT_FILE" 2>/dev/null || true
}
trap worker_cleanup EXIT

# Блокировка: два деплоя одновременно (например, пуш + релизный коммит)
# не должны одновременно подменять dist.
if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOG_DIR/deploy.lock"
  log "ожидание блокировки деплоя (предыдущий деплой мог ещё идти)"
  flock 9
  log "блокировка получена"
fi

log "=== Деплой стартовал ==="
log "каталог: $APP_DIR"
log "ветка: ${DEPLOY_BRANCH:-не задана}"

# Plesk запускает post-deployment actions с PATH=/usr/bin:/bin — там нет ни node,
# ни yarn. Node.js лежит в /opt/plesk/node/<версия>/bin: ищем последнюю доступную.
detect_node_bin() {
  local d last=""
  for d in $(ls -1d /opt/plesk/node/*/bin 2>/dev/null | sort -V); do
    if [ -x "$d/node" ]; then
      last="$d"
    fi
  done
  [ -n "$last" ] || return 1
  echo "$last"
}

NODE_BIN="$(detect_node_bin || true)"
YARN_CMD=()
YARN_SOURCE=""
NODE_CMD="node"
if [ -n "$NODE_BIN" ]; then
  export PATH="$NODE_BIN:$PATH"
  [ -x "$NODE_BIN/node" ] && NODE_CMD="$NODE_BIN/node"
  log "node: $NODE_BIN ($("$NODE_CMD" -v 2>&1))"
elif command -v node >/dev/null 2>&1; then
  log "node: системный ($("$NODE_CMD" -v 2>&1))"
else
  log "ВНИМАНИЕ: node не найден ни в /opt/plesk/node, ни в PATH — сборка невозможна"
fi

# Yarn: сперва закоммиченный в репозитории Yarn 4 (.yarn/releases/yarn-*.cjs) —
# он не зависит от corepack и от того, какой yarn стоит в системе. Если его нет —
# corepack (в Plesk доступен только он), иначе системный yarn.
YARN_REL="$(ls -1 "$APP_DIR"/.yarn/releases/yarn-*.cjs 2>/dev/null | head -1 || true)"
if [ -n "$YARN_REL" ] && command -v node >/dev/null 2>&1; then
  YARN_CMD=("$NODE_CMD" "$YARN_REL")
  YARN_SOURCE="репозиторий ($YARN_REL)"
elif [ -n "$NODE_BIN" ] && [ -x "$NODE_BIN/corepack" ]; then
  YARN_CMD=("$NODE_BIN" corepack yarn)
  YARN_SOURCE="corepack"
elif command -v yarn >/dev/null 2>&1; then
  YARN_CMD=(yarn)
  YARN_SOURCE="системный yarn"
else
  die "не найден ни yarn в .yarn/releases, ни corepack, ни системный yarn"
fi
log "yarn: ${YARN_CMD[*]} — источник: $YARN_SOURCE"
# corepack не должен задавать интерактивный вопрос «скачать Yarn?» — деплой не интерактивный.
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COMMIT_HASH="${COMMIT_HASH:-}"
if [ -z "$COMMIT_HASH" ]; then
  COMMIT_HASH="$(detect_commit || true)"
fi
if [ -z "$COMMIT_HASH" ]; then
  COMMIT_HASH="dev"
  log "ВНИМАНИЕ: не удалось определить COMMIT_HASH — в бандл попадёт 'dev'"
else
  log "коммит: $COMMIT_HASH"
fi
export COMMIT_HASH

# Данные для уведомления о результате деплоя. deploy id общий с уведомлением
# о старте — по нему «старт» и «финиш» находят друг друга.
NOTIFY_COMMIT="$COMMIT_HASH"
NOTIFY_BRANCH="$DEPLOY_BRANCH"
NOTIFY_DEPLOY_ID="$TS"

# --- 0. синхронизация рабочей копии с коммитом -------------------------------
# Plesk к этому моменту уже разложил файлы из bare-репозитория в каталог деплоя,
# но удалённые в ветке файлы из копии не убирает. Из-за этого tsc видит модули
# старой ветки и падает. Приводим копию к состоянию коммита — иначе сборка не
# пойдёт (и dev, и main со временем накопят такие файлы).
NOTIFY_STAGE="синхронизация рабочей копии"
SYNC_REPO="$(detect_repo || true)"
if [ -n "$SYNC_REPO" ]; then
  log "0/6. синхронизация рабочей копии с коммитом $COMMIT_HASH"
  if ! sync_worktree "$SYNC_REPO" "$COMMIT_HASH"; then
    log "   ВНИМАНИЕ: синхронизация не удалась — сборка может упасть на устаревших файлах"
  fi
else
  log "0/6. синхронизация рабочей копии — bare-репозиторий не найден, пропуск"
fi

# --- 1. конфигурация Yarn ----------------------------------------------------
# .yarnrc.yml обязателен: без него Yarn 4 уходит в PnP, node_modules не появится,
# а tsc/vite собирают не то. Файл tracked в репозитории (nodeLinker: node-modules).
if [ ! -f "$APP_DIR/.yarnrc.yml" ]; then
  die ".yarnrc.yml не найден в каталоге деплоя — сборка без node_modules невозможна"
fi
if ! grep -q '^nodeLinker:[[:space:]]*node-modules' "$APP_DIR/.yarnrc.yml"; then
  die ".yarnrc.yml без 'nodeLinker: node-modules' — yarn install ушёл бы в PnP"
fi
log "1/6. .yarnrc.yml: nodeLinker: node-modules ✓"

# --- 2. зависимости ---------------------------------------------------------
NOTIFY_STAGE="зависимости (yarn install)"
if [ "${SKIP_INSTALL:-0}" = "1" ]; then
  log "2/6. yarn install — пропущен (SKIP_INSTALL=1)"
else
  log "2/6. yarn install --immutable"
  # YARN_ENABLE_PRODUCTION в Yarn 4 не существует и роняет установку;
  # dev-зависимости в Yarn 4 ставятся по умолчанию.
  if ! run_step "${YARN_CMD[@]}" install --immutable; then
    die "yarn install не прошёл — сборка не выполняется, живой dist не тронут"
  fi
fi

# --- 3. сборка в staging ----------------------------------------------------
NOTIFY_STAGE="сборка (tsc + vite build)"
if [ "${SKIP_BUILD:-0}" = "1" ]; then
  log "3/6. сборка — пропущена (SKIP_BUILD=1)"
else
  log "3/6. сборка: tsc + vite build → dist-staging/"
  rm -rf "$STAGING"
  # tsc падает при ошибках типов — это блокер деплоя, а не предупреждение.
  if ! run_step "${YARN_CMD[@]}" exec tsc; then
    die "tsc завершился с ошибкой — сборка не выполняется, живой dist не тронут"
  fi
  if ! run_step "${YARN_CMD[@]}" exec vite build --outDir dist-staging; then
    die "vite build не прошёл — живой dist не тронут"
  fi
  [ -f "$STAGING/index.html" ] || die "сборка не дала dist-staging/index.html"
  [ -d "$STAGING/assets" ] || die "в сборке нет dist-staging/assets"
  [ -f "$STAGING/.htaccess" ] || log "ВНИМАНИЕ: в сборке нет .htaccess — SPA-fallback не заработает"
fi

# --- 4. маркер сборки и подмена dist ---------------------------------------
NOTIFY_STAGE="выкладка (подмена dist)"
if [ -d "$STAGING" ]; then
  # build-info.json — маркер сборки: в ответе статики нет версии,
  # поэтому скрипт сам кладёт в dist файл с хэшем и временем сборки.
  cat >"$STAGING/build-info.json" <<EOF
{
  "commit": "$COMMIT_HASH",
  "branch": "${DEPLOY_BRANCH:-unknown}",
  "builtAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "builtBy": "scripts/deploy.sh"
}
EOF
  # Права: nginx читает каталог как отдельный пользователь — не оставляем
  # режим, зависящий от umask экшена Plesk.
  chmod 755 "$STAGING"
  chmod -R a+rX "$STAGING"

  # Имя ассета собранной сборки — по нему health-check поймёт, что отдаётся
  # именно эта сборка, а не предыдущая.
  BUILT_ASSET="$(grep -o '/assets/index-[A-Za-z0-9_-]*\.js' "$STAGING/index.html" 2>/dev/null | head -1 || true)"
  log "   собранный ассет: ${BUILT_ASSET:-не найден}"

  if [ -d "$LIVE" ]; then
    BACKUP="$APP_DIR/dist-old-$TS"
    mv "$LIVE" "$BACKUP" || die "не удалось убрать старый dist"
    log "   старый dist сохранён: dist-old-$TS"
  fi
  if ! mv "$STAGING" "$LIVE"; then
    if [ -n "$BACKUP" ] && [ -d "$BACKUP" ]; then
      mv "$BACKUP" "$LIVE" || true
    fi
    die "не удалось подменить dist — вернул старый на место"
  fi
  log "   новый dist на месте"
else
  log "4/6. подмена dist — пропущена (staging не собран)"
fi

# --- 5. health-check + откат -------------------------------------------------
NOTIFY_STAGE="проверка прода"
log "5/6. проверка прода: $HEALTH_URL"

# 4.1) build-info.json: должен отдаваться JSON с нашим хэшем.
#      Важно: SPA-fallback отдаёт на этот путь index.html, если файла нет.
#      Поэтому проверяем ТЕЛО ответа, а не только код 200: HTML — это провал.
INFO_OK=0
i=0
while [ "$i" -lt "$HEALTH_RETRIES" ]; do
  CODE="$(curl -sk --max-time 10 -o "$HEALTH_OUT" -w '%{http_code}' \
    -H 'Cache-Control: no-cache' "${HEALTH_URL}build-info.json?ts=$TS" 2>/dev/null)" || CODE=""
  [ -n "$CODE" ] || CODE="000"
  if [ "$CODE" = "200" ]; then
    # Тело должно быть JSON-объектом, а не HTML из SPA-fallback.
    if head -c 1 "$HEALTH_OUT" | grep -q '[{]'; then
      if grep -q "\"commit\"[[:space:]]*:[[:space:]]*\"$COMMIT_HASH\"" "$HEALTH_OUT"; then
        INFO_OK=1
        log "   build-info.json: HTTP 200, JSON с коммитом $COMMIT_HASH"
        break
      fi
      log "   build-info.json: JSON есть, но коммит не совпадает с $COMMIT_HASH"
    else
      log "   build-info.json: ответ не JSON (отдаётся index.html — SPA-fallback маскирует маркер)"
    fi
  else
    log "   попытка $((i + 1))/$HEALTH_RETRIES: build-info.json → HTTP $CODE"
  fi
  i=$((i + 1))
  sleep "$HEALTH_INTERVAL"
done

# 4.2) главная отдаёт 200 и ссылается на ТОТ ЖЕ ассет, что мы собрали.
ASSET_OK=0
if [ "$INFO_OK" = "1" ]; then
  ROOT_CODE="$(curl -sk --max-time 15 -o "$ROOT_OUT" -w '%{http_code}' \
    -H 'Cache-Control: no-cache' "${HEALTH_URL}?ts=$TS" 2>/dev/null)" || ROOT_CODE=""
  [ -n "$ROOT_CODE" ] || ROOT_CODE="000"
  SERVED_ASSET="$(grep -o '/assets/index-[A-Za-z0-9_-]*\.js' "$ROOT_OUT" 2>/dev/null | head -1 || true)"
  if [ "$ROOT_CODE" = "200" ] && [ -n "$SERVED_ASSET" ]; then
    log "   главная: HTTP 200, ассет $SERVED_ASSET"
    if [ -n "$BUILT_ASSET" ] && [ "$SERVED_ASSET" != "$BUILT_ASSET" ]; then
      log "   ВНИМАНИЕ: отдаётся ассет $SERVED_ASSET, а собран $BUILT_ASSET — прод отстаёт"
    fi
    # Файл качаем целиком, а не через конвейер: grep -q закрывает пайп на
    # первом совпадении, curl ловит SIGPIPE, и при pipefail проверка падает
    # даже при успешном совпадении.
    ASSET_CODE="$(curl -sk --max-time 30 -o "$ASSET_OUT" -w '%{http_code}' \
      -H 'Cache-Control: no-cache' "${HEALTH_URL}${SERVED_ASSET}?ts=$TS" 2>/dev/null)" || ASSET_CODE=""
    [ -n "$ASSET_CODE" ] || ASSET_CODE="000"
    if [ "$ASSET_CODE" = "200" ] && grep -q "$COMMIT_HASH" "$ASSET_OUT"; then
      ASSET_OK=1
      log "   ассет содержит #$COMMIT_HASH — новая сборка в обслуживании"
    else
      log "   ВНИМАНИЕ: ассет HTTP $ASSET_CODE, хэша $COMMIT_HASH в нём нет"
    fi
  else
    log "   ВНИМАНИЕ: главная отдала HTTP $ROOT_CODE${SERVED_ASSET:+, ассет $SERVED_ASSET}"
  fi
fi

# 4.3) клиентский маршрут: без .htaccess в doc root он отдаёт 404 вместо
#      index.html — SPA не работает, пользователь увидит ошибку.
SPA_OK=1
SPA_CODE="$(curl -sk --max-time 15 -o /dev/null -w '%{http_code}' \
  -H 'Cache-Control: no-cache' "${HEALTH_URL}staff?ts=$TS" 2>/dev/null)" || SPA_CODE=""
if [ "$SPA_CODE" != "200" ]; then
  SPA_OK=0
  log "   ВНИМАНИЕ: клиентский маршрут /staff → HTTP $SPA_CODE (нет SPA-fallback: .htaccess в dist?)"
else
  log "   клиентский маршрут /staff: HTTP 200 — SPA-fallback работает"
fi

if [ "$INFO_OK" = "1" ] && [ "$ASSET_OK" = "1" ] && [ "$SPA_OK" = "1" ]; then
  log "=== Деплой успешен: прод отдаёт сборку $COMMIT_HASH ==="
else
  log "   health-check не прошёл (build-info: $INFO_OK, ассет: $ASSET_OK, spa: $SPA_OK)"
  NOTIFY_ERROR="деплой не прошёл проверку (build-info: $INFO_OK, ассет: $ASSET_OK, spa: $SPA_OK)"
  if [ "${NO_ROLLBACK:-0}" = "1" ] || [ -z "$BACKUP" ]; then
    NOTIFY_ROLLBACK="откат не выполняется"
    notify_send fail || log "ВНИМАНИЕ: уведомление о провале деплоя не отправлено"
    NOTIFY_SENT=1
    die "деплой не прошёл проверку (откат не выполняется)"
  fi
  # Сообщаем до отката: после отката API поднимается не мгновенно,
  # и уведомление просто не дошло бы.
  NOTIFY_ROLLBACK="выполняется откат на dist-old-$TS"
  if notify_send fail; then
    NOTIFY_SENT=1
  fi
  log "   откат на dist-old-$TS"
  mv "$LIVE" "$APP_DIR/dist-failed-$TS" || true
  if ! mv "$BACKUP" "$LIVE"; then
    NOTIFY_ROLLBACK="откат не удался — новая сборка: dist-failed-$TS"
    notify_send fail || log "ВНИМАНИЕ: уведомление о провале деплоя не отправлено"
    NOTIFY_SENT=1
    die "откат не удался — разбирайся руками, новая сборка: dist-failed-$TS"
  fi
  # Если первая попытка не дошла — повторяем после отката.
  if [ "$NOTIFY_SENT" != "1" ]; then
    NOTIFY_ROLLBACK="выполнен откат на dist-old-$TS"
    notify_send_retry fail || log "ВНИМАНИЕ: уведомление о провале деплоя не отправлено"
    NOTIFY_SENT=1
  fi
  die "деплой не прошёл проверку, выполнен откат на предыдущий dist"
fi

# --- 6. уборка ----------------------------------------------------------------
log "6/6. уборка: оставляем 3 предыдущие сборки"
# Храним последние 3 предыдущие сборки — это готовый откат вручную.
(
  ls -1dt "$APP_DIR"/dist-old-* 2>/dev/null || true
) | tail -n +4 | while read -r old; do
  [ -n "$old" ] && rm -rf "$old"
done

NOTIFY_DURATION="$(( $(date +%s) - DEPLOY_START_EPOCH ))"
NOTIFY_CONFIRM="прод отдаёт сборку $COMMIT_HASH"
notify_send success || log "ВНИМАНИЕ: уведомление об успешном деплое не отправлено"
NOTIFY_SENT=1

log "=== Деплой успешен ==="
exit 0
