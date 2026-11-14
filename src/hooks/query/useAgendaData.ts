import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { AgendaItem } from '../../api/model';

import {
  getAgendaGetCalendarQueryKey,
  getAgendaGetCalendarQueryOptions,
} from '../../api/agenda/agenda';

export type { AgendaItem };

/* ---------- Константы ---------- */
const DAY_MS = 86_400_000;
const UPCOMING_MONTHS = 3;
const FRESH_MS = 5 * 60 * 1000;
const GC_MS = 30 * 60 * 1000;

/* ---------- Типы ---------- */
export interface CalendarCursor {
  year: number;
  /** 0–11, как в Date */
  month: number;
}

interface UseAgendaDataParams {
  cursor: CalendarCursor;
  /** Ключ дня "YYYY-MM-DD" или null */
  selectedDay: string | null;
}

/** Интервал в «номерах дней» (дни от 1970-01-01, UTC), границы включительно */
type Interval = [start: number, end: number];

/* ---------- Хелперы для дат (всё в UTC) ---------- */
export const toDayKey = (d: Date) => d.toISOString().slice(0, 10);

const toDayNum = (d: Date) => Math.floor(d.getTime() / DAY_MS);
const numToKey = (n: number) => new Date(n * DAY_MS).toISOString().slice(0, 10);
const keyToNum = (key: string) => toDayNum(new Date(`${key}T00:00:00Z`));

// +N месяцев с «прижатием» дня: 30 ноября + 3 мес = 28/29 февраля, а не 2 марта
const addMonthsClamped = (d: Date, n: number) => {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return new Date(
    Date.UTC(
      target.getUTCFullYear(),
      target.getUTCMonth(),
      Math.min(d.getUTCDate(), lastDay),
    ),
  );
};

/* ---------- Операции над интервалами ---------- */
// Склеивает пересекающиеся и соприкасающиеся интервалы: [1,5] + [6,9] -> [1,9]
function mergeIntervals(list: Interval[]): Interval[] {
  const sorted = [...list].sort((a, b) => a[0] - b[0]);
  const result: Interval[] = [];
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    if (last && start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}

// «from минус remove»: что из from ещё не покрыто. Оба списка склеены и отсортированы.
function subtractIntervals(from: Interval[], remove: Interval[]): Interval[] {
  const result: Interval[] = [];
  for (const [fromStart, fromEnd] of from) {
    let start = fromStart;
    for (const [removeStart, removeEnd] of remove) {
      if (removeEnd < start || removeStart > fromEnd) continue;
      if (removeStart > start) result.push([start, removeStart - 1]);
      start = Math.max(start, removeEnd + 1);
      if (start > fromEnd) break;
    }
    if (start <= fromEnd) result.push([start, fromEnd]);
  }
  return result;
}

const isCovered = (interval: Interval, loaded: Interval[]) =>
  subtractIntervals([interval], loaded).length === 0;

const retry = (failureCount: number) => failureCount <= 5;

const itemKey = (item: AgendaItem) => `${item.type}-${item.id}`;
const byStart = (a: AgendaItem, b: AgendaItem) =>
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

/* ---------- Хук ---------- */
export function useAgendaData({ cursor, selectedDay }: UseAgendaDataParams) {
  const queryClient = useQueryClient();

  const today = useMemo(() => {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }, []);
  const todayNum = toDayNum(today);
  const todayKey = toDayKey(today);
  const upcomingEndNum = toDayNum(addMonthsClamped(today, UPCOMING_MONTHS));
  const upcomingEndKey = numToKey(upcomingEndNum);

  /* ---- хранилище: все события, какие-либо загруженные за сессию ---- */
  const [store, setStore] = useState<Map<string, AgendaItem>>(new Map());
  // какие диапазоны дней уже загружены (склеенные, отсортированные)
  const [loaded, setLoaded] = useState<Interval[]>([]);
  const [fetchingCount, setFetchingCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  // диапазоны, которые запрошены прямо сейчас (чтобы не запрашивать дважды)
  const pendingRef = useRef(new Map<string, Interval>());
  // увеличивается при refresh(): ответы от «старых» запросов игнорируем
  const generationRef = useRef(0);

  /* ---- какие дни нужны для текущего вида ---- */
  const needed = useMemo(() => {
    const monthStart = new Date(Date.UTC(cursor.year, cursor.month, 1));
    // сетка: 42 клетки с понедельника — те же дни, что рисует buildMonthGrid
    const gridStart = toDayNum(monthStart) - ((monthStart.getUTCDay() + 6) % 7);
    const gridEnd = gridStart + 41;

    const list: Interval[] = [
      [gridStart, gridEnd], // видимая сетка календаря
      [todayNum, upcomingEndNum], // левый список: сегодня -> +3 месяца
    ];
    if (selectedDay) {
      const sel = keyToNum(selectedDay);
      list.push([sel, sel]);
    }
    return mergeIntervals(list);
  }, [cursor.year, cursor.month, selectedDay, todayNum, upcomingEndNum]);

  /* ---- дозагрузка только недостающих дней ---- */
  useEffect(() => {
    const busy = mergeIntervals([...pendingRef.current.values()]);
    const gaps = subtractIntervals(subtractIntervals(needed, loaded), busy);
    if (gaps.length === 0) return;

    const generation = generationRef.current;

    gaps.forEach((gap) => {
      const [start, end] = gap;
      const pendingKey = `${start}_${end}`;
      const startKey = numToKey(start);
      const endKey = numToKey(end);
      const isPast = end < todayNum;

      pendingRef.current.set(pendingKey, gap);
      setFetchingCount((n) => n + 1);

      // endDate включительно. Если бэкенд считает его исключительно — добавьте +1 день.
      queryClient
        .fetchQuery(
          getAgendaGetCalendarQueryOptions(
            { startDate: startKey, endDate: endKey },
            {
              query: {
                retry,
                // прошлое не меняется — не перезапрашиваем никогда
                staleTime: isPast ? Infinity : FRESH_MS,
                gcTime: GC_MS,
              },
            },
          ),
        )
        .then((items) => {
          if (generation !== generationRef.current) return;
          setStore((prev) => {
            const next = new Map(prev);
            items.forEach((item) => next.set(itemKey(item), item));
            return next;
          });
          setLoaded((prev) => mergeIntervals([...prev, gap]));
          setError(null);
        })
        .catch((err: unknown) => {
          if (generation !== generationRef.current) return;
          setError(err instanceof Error ? err : new Error(String(err)));
        })
        .finally(() => {
          pendingRef.current.delete(pendingKey);
          if (generation === generationRef.current) {
            setFetchingCount((n) => Math.max(0, n - 1));
          }
        });
    });
    // версия нужна, чтобы refresh() перезапускал загрузку
  }, [needed, loaded, version, queryClient, todayNum]);

  /* ---- ручной сброс: забыть всё и загрузить заново ---- */
  const refresh = useCallback(() => {
    generationRef.current += 1;
    pendingRef.current.clear();
    queryClient.removeQueries({ queryKey: getAgendaGetCalendarQueryKey() });
    setStore(new Map());
    setLoaded([]);
    setFetchingCount(0);
    setError(null);
    setVersion((v) => v + 1);
  }, [queryClient]);

  /* ---- производные данные ---- */
  const allEvents = useMemo(() => [...store.values()].sort(byStart), [store]);

  const eventsByDay = useMemo(() => {
    const byDay = new Map<string, AgendaItem[]>();
    allEvents.forEach((item) => {
      const key = toDayKey(new Date(item.startDate));
      byDay.set(key, [...(byDay.get(key) ?? []), item]);
    });
    return byDay;
  }, [allEvents]);

  // левая панель: строго сегодня -> +3 месяца, сколько бы ни подгрузили листанием
  const upcomingEvents = useMemo(
    () =>
      allEvents.filter((item) => {
        const key = toDayKey(new Date(item.startDate));
        return key >= todayKey && key <= upcomingEndKey;
      }),
    [allEvents, todayKey, upcomingEndKey],
  );

  const selectedDayEvents = useMemo(
    () => (selectedDay ? eventsByDay.get(selectedDay) ?? [] : []),
    [eventsByDay, selectedDay],
  );

  const cursorMonthKey = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}`;
  const monthEvents = useMemo(
    () =>
      allEvents.filter(
        (item) =>
          toDayKey(new Date(item.startDate)).slice(0, 7) === cursorMonthKey,
      ),
    [allEvents, cursorMonthKey],
  );

  /* ---- флаги загрузки: «не покрыто и нет ошибки» ---- */
  const monthStartNum = toDayNum(
    new Date(Date.UTC(cursor.year, cursor.month, 1)),
  );
  const monthEndNum = toDayNum(
    new Date(Date.UTC(cursor.year, cursor.month + 1, 0)),
  );

  const isUpcomingLoading =
    !error && !isCovered([todayNum, upcomingEndNum], loaded);
  const isMonthLoading =
    !error && !isCovered([monthStartNum, monthEndNum], loaded);
  const isSelectedDayLoading =
    !error &&
    selectedDay !== null &&
    !isCovered([keyToNum(selectedDay), keyToNum(selectedDay)], loaded);

  return {
    /** Левая панель: сегодня -> +3 месяца (отсортированы) */
    upcomingEvents,
    /** День "YYYY-MM-DD" -> события (для плиток календаря) */
    eventsByDay,
    /** События выбранного дня, в том числе из прошлого */
    selectedDayEvents,
    /** События месяца, открытого в календаре */
    monthEvents,
    isUpcomingLoading,
    isSelectedDayLoading,
    isMonthLoading,
    /** Идёт любая дозагрузка (можно показать лёгкий индикатор) */
    isCalendarFetching: fetchingCount > 0,
    error,
    /** Сбросить всё и загрузить заново (например, кнопка «Обновить») */
    refresh,
  };
}

export default useAgendaData;
