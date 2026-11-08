import { useCallback, useState } from 'react';

import {
  IconBooks,
  IconCalendarEvent,
  IconCertificate,
  IconChevronLeft,
  IconChevronRight,
  IconInfoSquareRounded,
  IconSettings,
} from '@tabler/icons-react';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type {
  AgendaItem,
  CalendarCursor,
} from '../../hooks/query/useAgendaData';

import { BreadcrumbLayout } from '../../components/Layout';
import { Notification } from '../../components/Notification/Notification';
import useAgendaData from '../../hooks/query/useAgendaData';
import { useEventDetails } from '../../hooks/query/useEvents';

/* ---------- 1. Конфиг типов: один источник правды для цветов, иконок и переводов ---------- */
// type: 0 = мероприятие, 1 = тренировка, 2 = экзамен, 3 = тех. работы
// bg — фон плитки, fg — цвет цифры на этом фоне (на жёлтом цифра тёмная)
const TYPES = {
  0: {
    bg: 'bg-green-500',
    fg: 'text-white',
    Icon: IconCalendarEvent,
    labelKey: 'agenda.types.event',
  },
  1: {
    bg: 'bg-yellow-400',
    fg: 'text-white',
    Icon: IconBooks,
    labelKey: 'agenda.types.training',
  },
  2: {
    bg: 'bg-red-500',
    fg: 'text-white',
    Icon: IconCertificate,
    labelKey: 'agenda.types.exam',
  },
  3: {
    bg: 'bg-neutral-700',
    fg: 'text-white',
    Icon: IconSettings,
    labelKey: 'agenda.types.maintenance',
  },
} as const;

type TypeId = keyof typeof TYPES;
const getType = (t: number) => TYPES[(t in TYPES ? t : 3) as TypeId];

// приоритет типов: первый найденный красит плитку, остальные идут в полоску снизу
const PRIORITY = [0, 2, 3, 1] as const;

// кольца: белый зазор + цветная обводка (box-shadow не меняет размер плитки)
const RING_TODAY = '0 0 0 1px #fff, 0 0 0 3px #D7D7DC';
const RING_SELECTED = '0 0 0 2px #fff, 0 0 0 4px #000';
const RING_BOTH =
  '0 0 0 2px #fff, 0 0 0 4px #D7D7DC, 0 0 0 5px #fff, 0 0 0 7px #000';

// что показывает левый список
type ListMode = 'upcoming' | 'month' | 'day';

/* ---------- 2. Хелперы для дат (всё в UTC, как в вашей плашке) ---------- */
// ключ дня вида "2024-06-05" — по нему сопоставляем ивенты и клетки календаря
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

// сетка месяца: 6 недель по 7 дней, неделя начинается с понедельника
function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Пн = 0
  const start = Date.UTC(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => new Date(start + i * 86400000));
}

/* ---------- 3. Плитка дня в календаре ---------- */
// Главный тип (по приоритету) красит плитку, остальные типы дня — полоска снизу.
// Кольцо «сегодня» — серое, «выбран» — чёрное, оба сразу — двойное.
function DayTile({
  day,
  inMonth,
  types,
  isToday,
  isSelected,
  onClick,
}: {
  day: Date;
  inMonth: boolean;
  types?: number[];
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const present = PRIORITY.filter((tp) => types?.includes(tp));
  const [main, ...rest] = present;

  const boxShadow =
    isSelected && isToday
      ? RING_BOTH
      : isSelected
        ? RING_SELECTED
        : isToday
          ? RING_TODAY
          : undefined;

  const colors =
    main !== undefined
      ? `${TYPES[main].bg} ${TYPES[main].fg}`
      : inMonth
        ? 'text-black'
        : 'text-neutral-400 font-semibold';

  return (
    <button
      type="button"
      disabled={!types}
      onClick={onClick}
      style={{ boxShadow }}
      className={[
        'squircle-xl relative mx-auto flex size-10 items-center justify-center overflow-hidden text-xl font-bold transition',
        colors,
        types ? 'cursor-pointer hover:scale-110' : 'cursor-default',
      ].join(' ')}
    >
      <span>{day.getUTCDate()}</span>

      {/* полоска остальных типов: белый зазор сверху и между сегментами */}
      {rest.length > 0 && (
        <span className="absolute inset-x-0 bottom-0 flex h-2 gap-0.5 bg-white pt-0.5">
          {rest.map((tp) => (
            <span key={tp} className={`flex-1 ${TYPES[tp].bg}`} />
          ))}
        </span>
      )}
    </button>
  );
}

/* ---------- 4. Отдельная плашка ---------- */
// Хуки нельзя вызывать в цикле .map(), поэтому у каждой плашки свой компонент:
// внутри него можно вызвать useEventDetails для конкретного ивента.
// React Query кэширует ответ по id, так что страница ивента потом откроется мгновенно.
function AgendaCard({
  item,
  onOpen,
}: {
  item: AgendaItem;
  onOpen: (item: AgendaItem) => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { bg, Icon } = getType(item.type);
  const date = new Date(item.startDate);
  const isEvent = item.type === 0;

  // Данные ивента (картинка, название, описание) — только для type === 0.
  // Для остальных типов передаём undefined, чтобы запрос не уходил.
  const { data: event, isLoading: eventLoading } = useEventDetails(
    isEvent ? String(item.id) : undefined,
  );

  const title = (isEvent && event?.name?.[lang]) || item.title;
  const imageUrl = isEvent ? event?.imageUrl : undefined;
  const description = isEvent ? event?.description?.[lang] ?? '' : '';

  // Пока данные ивента грузятся, считаем что картинка будет — так макет не «прыгает».
  // Если после загрузки картинки нет, карточка переключается на компактный вид.
  const hasImage = Boolean(imageUrl) || (isEvent && eventLoading);

  return (
    <div
      className={`squircle-3xl shadow-figma flex flex-col bg-white text-black transition md:flex-row`}
    >
      {/* Баннер слева — только если есть картинка (размеры и скругления как раньше) */}
      {hasImage && (
        <div className="md:h-full lg:w-[45%]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="squircle-3xl shadow-figma size-full object-cover"
            />
          ) : (
            <div className="squircle-3xl size-full animate-pulse bg-gray-200" />
          )}
        </div>
      )}

      {/* Контент справа (без картинки — на всю ширину, слева) */}
      <div
        className={`flex flex-1 flex-col gap-3 p-5 ${hasImage ? 'lg:max-w-[55%]' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`squircle-2xl flex size-[60px] shrink-0 items-center justify-center text-white ${bg}`}
          >
            <Icon size={38} />
          </div>

          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-black">
              {date.toLocaleString(lang, { timeZone: 'UTC', day: '2-digit' })}
            </div>
            <div className="text-lg font-bold uppercase text-neutral-600 lg:-mt-1 lg:text-lg">
              {date
                .toLocaleString(lang, { timeZone: 'UTC', month: 'short' })
                .slice(0, 3)}
            </div>
          </div>

          <div className="mt-1.5 flex min-w-0 flex-col">
            <div className="truncate text-2xl font-bold text-black lg:text-3xl">
              {title}
            </div>
            <div className="-mt-1.5 flex gap-2 text-[15px] font-medium leading-7 text-neutral-600 lg:text-xl lg:leading-8">
              <span className="shrink-0 whitespace-nowrap">
                {date.toLocaleTimeString('eu', {
                  timeZone: 'UTC',
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                {t('UTC')}
              </span>
              {isEvent && item.airport && (
                <span className="min-w-0 truncate text-neutral-400">
                  {item.airport}
                </span>
              )}
              {!isEvent && item.annotation && (
                <span className="min-w-0 truncate text-neutral-400">
                  {item.annotation}
                </span>
              )}
            </div>
          </div>
        </div>

        {hasImage && description && (
          <div
            className="line-clamp-5 break-words text-justify text-base font-medium leading-6 text-neutral-600 md:line-clamp-2 lg:line-clamp-2 xl:line-clamp-3 2xl:line-clamp-4 [&_*]:!text-inherit"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          />
        )}

        {/* mt-auto прижимает кнопку к низу плашки; без картинки кнопки нет */}
        {hasImage && (
          <div
            onClick={() => onOpen(item)}
            className="mt-auto flex w-fit gap-3 rounded-xl bg-atmos-700 px-1.5 pr-4 text-lg font-semibold text-white backdrop-blur-[5px] transition duration-300 hover:scale-105 hover:cursor-pointer hover:opacity-90"
          >
            <IconInfoSquareRounded className="mt-0.5" />
            <div className="my-auto flex-auto">{t('agenda.more')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- 5. Страница ---------- */
export function Agenda() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  const now = new Date();
  const currentMonth = { year: now.getUTCFullYear(), month: now.getUTCMonth() };

  // какой месяц показываем в календаре
  const [cursor, setCursor] = useState<CalendarCursor>(currentMonth);
  // выбранный день (клик по календарю фильтрует список)
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const changeMonth = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(Date.UTC(year, month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });

  // «Сегодня»: возвращает текущий месяц и снимает выбранный день
  const resetToToday = () => {
    setCursor(currentMonth);
    setSelectedDay(null);
  };

  const {
    upcomingEvents,
    eventsByDay,
    selectedDayEvents,
    monthEvents,
    isUpcomingLoading,
    isSelectedDayLoading,
    isMonthLoading,
    error,
  } = useAgendaData({ cursor, selectedDay });

  /* ---- режим списка ---- */
  // приоритет: день > прошлый месяц > предстоящие
  // (текущий и будущие месяцы список не меняют)
  const isPastMonth =
    cursor.year * 12 + cursor.month <
    currentMonth.year * 12 + currentMonth.month;
  const mode: ListMode = selectedDay
    ? 'day'
    : isPastMonth
      ? 'month'
      : 'upcoming';

  const visibleEvents =
    mode === 'day'
      ? selectedDayEvents
      : mode === 'month'
        ? monthEvents
        : upcomingEvents;

  const isLoading =
    mode === 'day'
      ? isSelectedDayLoading
      : mode === 'month'
        ? isMonthLoading
        : isUpcomingLoading;

  // кнопка «Сегодня» нужна, только когда ушли из режима «предстоящие»
  const showReset = mode !== 'upcoming';

  const openItem = useCallback(
    (item: AgendaItem) => {
      if (item.type === 0) {
        navigate(`/event/${item.id}`);
        window.scrollTo(0, 0);
      } else if (item.link) {
        window.open(item.link, '_blank');
      }
    },
    [navigate],
  );

  /* ---- подписи ---- */
  const monthTitle = new Date(
    Date.UTC(cursor.year, cursor.month, 1),
  ).toLocaleString(lang, { timeZone: 'UTC', month: 'long' });

  // "29 ноября 2026" (без "г." из стандартного формата)
  const selectedDayTitle = selectedDay
    ? `${new Date(`${selectedDay}T00:00:00Z`).toLocaleString(lang, {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'long',
      })} ${selectedDay.slice(0, 4)}`
    : '';

  const subtitle = {
    upcoming: t('agenda.upcoming'),
    month: `${monthTitle} ${cursor.year}`,
    day: selectedDayTitle,
  }[mode];

  const emptyText = {
    upcoming: t('agenda.emptyUpcoming', 'Новых событий пока нет'),
    month: t('agenda.emptyMonth', 'В этом месяце событий не было'),
    day: t('agenda.empty', 'В этот день ничего не запланировано'),
  }[mode];

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.UTC(2024, 0, 1 + i)) // 1 января 2024 — понедельник
      .toLocaleString(lang, { timeZone: 'UTC', weekday: 'short' }),
  );
  const grid = buildMonthGrid(cursor.year, cursor.month);
  const todayKey = dayKey(now);

  return (
    <BreadcrumbLayout>
      {error && (
        <Notification
          type="error"
          message={error.message}
          notificationId="events-calendar-error"
        />
      )}

      {/* Заголовок + кнопка «Сегодня» */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="text-3xl font-bold text-black md:text-5xl">
          {t('agenda.title')}{' '}
          <span className="ml-2 text-neutral-400">{subtitle}</span>
        </div>

        {showReset && (
          <button
            type="button"
            onClick={resetToToday}
            className="mb-1 text-lg font-semibold text-neutral-400 transition hover:text-black"
          >
            {t('agenda.today')}
          </button>
        )}
      </div>

      {/* Двухколоночная сетка: список слева, календарь справа */}
      <div className="grid grid-cols-1 gap-6 font-['Montserrat'] text-black lg:grid-cols-[1fr_420px] lg:items-start [&>div]:min-w-0">
        {/* ===== ЛЕВАЯ КОЛОНКА ===== */}
        <div className="flex flex-col gap-5">
          {isLoading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="squircle-3xl h-[275px] animate-pulse bg-gray-200"
              />
            ))}

          {!isLoading && visibleEvents.length === 0 && (
            <div className="squircle-3xl shadow-figma bg-white p-8 text-xl text-neutral-500">
              {emptyText}
            </div>
          )}

          {visibleEvents.map((item) => (
            <AgendaCard
              key={`${item.type}-${item.id}`}
              item={item}
              onOpen={openItem}
            />
          ))}
        </div>

        {/* ===== ПРАВАЯ КОЛОНКА: календарь + цветовые коды ===== */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-36">
          <div className="squircle-3xl shadow-figma bg-white p-6">
            <div className="-mt-1 mb-4 flex items-center justify-between">
              <div className="text-2xl font-bold capitalize text-black">
                {monthTitle}{' '}
                <span className="font-semibold text-neutral-500">
                  {cursor.year}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label={t('agenda.prevMonth', 'Предыдущий месяц')}
                  onClick={() => changeMonth(-1)}
                >
                  <IconChevronLeft size={20} className="text-black" />
                </button>
                <button
                  type="button"
                  aria-label={t('agenda.nextMonth', 'Следующий месяц')}
                  onClick={() => changeMonth(1)}
                >
                  <IconChevronRight size={20} className="text-black" />
                </button>
              </div>
            </div>

            {/* grid-cols-7 = 7 колонок по числу дней в неделе */}
            <div className="grid grid-cols-7 gap-y-3 text-center">
              {weekdays.map((w) => (
                <div
                  key={w}
                  className="text-sm font-semibold capitalize text-neutral-600"
                >
                  {w}
                </div>
              ))}

              {grid.map((day) => {
                const key = dayKey(day);
                const types = eventsByDay.get(key)?.map((i) => i.type);
                return (
                  <DayTile
                    key={key}
                    day={day}
                    inMonth={day.getUTCMonth() === cursor.month}
                    types={types}
                    isToday={key === todayKey}
                    isSelected={selectedDay === key}
                    onClick={() =>
                      setSelectedDay(selectedDay === key ? null : key)
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="squircle-3xl shadow-figma bg-white p-6">
            <div className="-mt-1 mb-4 text-2xl font-bold text-black">
              {t('agenda.colors')}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {([2, 1, 3, 0] as const).map((tp) => (
                <div
                  key={tp}
                  className="flex items-center gap-3 text-lg font-semibold text-black"
                >
                  <span
                    className={`squircle-lg size-9 shrink-0 ${TYPES[tp].bg}`}
                  />
                  {t(TYPES[tp].labelKey)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
