import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  WheelEvent,
} from 'react';

import { NewsEntity } from '../../../api/model/newsEntity';

/* ---------- Настройки ---------- */
const AUTOPLAY_MS = 6000;
const SWIPE_PX = 40; // минимальный сдвиг, чтобы считать жест свайпом
const WHEEL_MIN = 30; // минимальный горизонтальный сдвиг колеса/тачпада
const WHEEL_LOCK_MS = 600; // пауза между переключениями колесом
const DOTS_VISIBLE = 5; // точек в окне всегда 5
const DOT_STEP = 20; // ширина одной точки вместе с отступами, px
// Сколько карточек по каждую сторону от активной держим в DOM. Дальше карточки
// не рендерим: их всё равно не видно (закрыты соседями). Три нужно, чтобы карточка
// уже стояла спрятанной позади и плавно выезжала, когда её очередь становиться видимой.
const RENDER_RANGE = 2;

const MOVE_MS = 800;
const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

const SIDE_SCALE = 0.94; // соседняя карточка
const SECOND_SCALE = 0.9; // вторая карточка от активной на первой/последней новости
const HIDDEN_SCALE = 0.8; // спрятанные: заметно меньше видимых соседей
// Спрятанные отодвигаются от края к центру на эту долю ширины карточки.
// Размытие делает край соседа полупрозрачным, и карточка, стоящая ровно на краю,
// проглядывает сквозь него. Отступ уводит её край под плотную часть соседа.
const HIDDEN_INSET = 0.08;

// Строка под стадией (точки). Высота h-10 = нижний отступ, который родитель резервирует через lg:pb-10.
const BOTTOM_ROW = 'flex h-10 shrink-0 items-center justify-center';

// Карточка: высота = высоте стадии (lg), ширина из пропорции 8:9.
// 8:9 = картинка 16:9 + текстовый блок 16:9 друг под другом.
// Все карточки лежат в left:0, а по горизонтали их двигает только transform.
const CARD_BOX =
  'absolute left-0 top-1/2 aspect-[8/9] w-[80%] lg:h-full lg:w-auto';

/* ---------- Раскладка карточек ---------- */
type Mode = 'single' | 'start' | 'middle' | 'end';
type Anchor = 'left' | 'center' | 'right';
interface Size {
  stage: number;
  card: number;
}

function getMode(active: number, count: number): Mode {
  if (count < 2) return 'single';
  if (active === 0) return 'start'; // активная слева, дальше «лесенка» вправо
  if (active === count - 1) return 'end'; // зеркально: активная справа
  return 'middle'; // как на макете: активная по центру
}

function anchorFor(offset: number, mode: Mode, count: number): Anchor {
  if (offset === 0) {
    return mode === 'start' ? 'left' : mode === 'end' ? 'right' : 'center';
  }
  if (offset > 0) {
    // на первой новости вторая стоит на месте будущей активной, то есть по центру
    if (mode === 'start')
      return offset === 1 && count >= 3 ? 'center' : 'right';
    return 'right';
  }
  if (mode === 'end') return offset === -1 && count >= 3 ? 'center' : 'left';
  return 'left';
}

interface Slot {
  x: number;
  scale: number;
  blur: number;
  veil: number; // белая вуаль поверх карточки: 0 — нет, 1 — сплошной белый
  shadow: number; // сила тени: 0 — нет, 1 — полная
  z: number;
  active: boolean;
  interactive: boolean;
}

function getSlot(offset: number, mode: Mode, count: number, size: Size): Slot {
  const depth = Math.abs(offset);
  const edgeMode = mode === 'start' || mode === 'end';

  let scale = 1;
  let blur = 0;
  let veil = 0;
  let shadow = 1;
  let z = 30;

  // Тень только у активной и (слабая) у соседней. У остальных её нет,
  // иначе тени стопки карточек складываются и получается тёмное пятно.
  if (depth === 1) {
    scale = SIDE_SCALE;
    blur = 1.5;
    veil = 0.5;
    shadow = 0.35;
    z = 20;
  } else if (depth === 2 && edgeMode) {
    scale = SECOND_SCALE;
    blur = 2.5;
    veil = 0.65;
    shadow = 0;
    z = 10;
  } else if (depth >= 2) {
    scale = HIDDEN_SCALE;
    veil = 0.65;
    shadow = 0;
    z = 0;
  }

  // Масштаб идёт от центра карточки, поэтому x подбираем так,
  // чтобы видимый край карточки лежал ровно на краю стадии.
  const { stage, card } = size;
  const anchor = anchorFor(offset, mode, count);
  const hidden = depth >= (edgeMode ? 3 : 2);
  const inset = hidden ? card * HIDDEN_INSET : 0;
  const x =
    anchor === 'left'
      ? -((1 - scale) * card) / 2 + inset
      : anchor === 'right'
        ? stage - (card * (1 + scale)) / 2 - inset
        : (stage - card) / 2;

  return {
    x,
    scale,
    blur,
    veil,
    shadow,
    z,
    active: depth === 0,
    interactive: depth <= (edgeMode ? 2 : 1),
  };
}

// HTML из админки -> чистый текст (для заголовка и описания на карточке)
const toText = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ??
  '';

/* ---------- Точки: окно из 5 штук ---------- */
// Синяя точка стоит на 1-й, 2-й позиции в начале, на 3-й в середине,
// на 4-й и 5-й в конце. В середине сами точки «листаются» внутри окна.
function Dots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  const visible = Math.min(count, DOTS_VISIBLE);
  const start =
    count <= DOTS_VISIBLE
      ? 0
      : Math.max(0, Math.min(active - 2, count - DOTS_VISIBLE));

  return (
    <div className="overflow-hidden" style={{ width: visible * DOT_STEP }}>
      <div
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(${-start * DOT_STEP}px)` }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const pos = i - start;
          const isEdge =
            count > DOTS_VISIBLE &&
            ((pos === 0 && start > 0) ||
              (pos === DOTS_VISIBLE - 1 && start < count - DOTS_VISIBLE));

          return (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1} / ${count}`}
              aria-current={i === active}
              onClick={() => onSelect(i)}
              style={{ width: DOT_STEP }}
              className="flex h-5 shrink-0 items-center justify-center"
            >
              <span
                className={`block size-2 rounded-full transition-all duration-700 ${
                  i === active ? 'bg-atmos-700' : 'bg-gray-300'
                } ${isEdge ? 'scale-50' : ''}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Скелет ---------- */
export function NewsCarouselSkeleton() {
  const body = (
    <>
      <div className="aspect-video w-full shrink-0 bg-gray-200" />
      <div className="flex aspect-video w-full flex-col gap-3 p-5">
        <div className="h-5 w-16 rounded-md bg-gray-200" />
        <div className="h-5 w-4/5 rounded-md bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
      </div>
    </>
  );
  const card = `${CARD_BOX} flex animate-pulse flex-col overflow-hidden squircle-3xl bg-white -translate-y-1/2`;

  return (
    <div className="flex h-full min-h-0 flex-col" aria-hidden>
      <div className="relative aspect-[20/19] w-full lg:aspect-auto lg:min-h-0 lg:flex-1">
        <div className={`${card} left-auto right-0 z-0 opacity-60`}>{body}</div>
        <div className={`${card} left-1/2 z-10 -translate-x-1/2 opacity-80`}>
          {body}
        </div>
        <div className={`${card} shadow-figma z-20`}>{body}</div>
      </div>
      <div className={BOTTOM_ROW} />
    </div>
  );
}

/* ---------- Карточка ---------- */
function NewsCard({
  item,
  slot,
  transition,
  cardIndex,
  onSelect,
  onRead,
}: {
  item: NewsEntity;
  slot: Slot;
  transition: string;
  cardIndex: number;
  /** клик по неактивной карточке: сделать её активной */
  onSelect: () => void;
  /** клик по активной карточке: открыть новость */
  onRead: () => void;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const title = useMemo(
    () => toText(item.name[lang] ?? item.name.en ?? ''),
    [item.name, lang],
  );
  const description = useMemo(
    () => toText(item.description[lang] ?? item.description.en ?? ''),
    [item.description, lang],
  );

  const style: CSSProperties = {
    transform: `translate3d(${slot.x}px, -50%, 0) scale(${slot.scale})`,
    filter: slot.blur ? `blur(${slot.blur}px)` : 'none',
    zIndex: slot.z,
    pointerEvents: slot.interactive ? 'auto' : 'none',
    transition,
    willChange: 'transform',
    // текст и отступы ниже заданы в cqw (% ширины карточки), поэтому всё масштабируется вместе с ней
    containerType: 'inline-size',
  };

  const fade = transition === 'none' ? 'none' : `opacity ${MOVE_MS}ms ${EASE}`;

  return (
    <div
      aria-hidden={!slot.interactive}
      role={slot.interactive ? 'button' : undefined}
      tabIndex={slot.active ? 0 : -1}
      data-card-index={cardIndex}
      onClick={slot.active ? onRead : onSelect}
      onKeyDown={(e) => {
        if (slot.active && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onRead();
        }
      }}
      style={style}
      className={`${CARD_BOX} cursor-pointer`}
    >
      {/* тень вынесена в отдельный слой: её прозрачность плавно меняется,
          а у спрятанных карточек тени нет, поэтому они не складываются в тёмное пятно */}
      <div
        className="squircle-3xl shadow-figma pointer-events-none absolute inset-0"
        style={{ opacity: slot.shadow, transition: fade }}
      />

      <div className="squircle-3xl relative flex size-full flex-col overflow-hidden bg-white text-black">
        <div className="aspect-video w-full shrink-0 bg-gray-200">
          <img
            src={item.image_url}
            alt={title}
            decoding="async"
            draggable={false}
            className="size-full object-cover"
          />
        </div>

        <div className="flex aspect-video w-full shrink-0 flex-col gap-[1.8cqw] overflow-hidden p-[4.5cqw]">
          <span className="w-fit rounded-lg bg-neutral-900 px-[3cqw] pb-[0.5cqw] pt-[0.6cqw] text-[3.2cqw] font-semibold leading-[1.5] text-white">
            {format(new Date(item.publishedAt), 'dd.MM.yyyy')}
          </span>

          <h3 className="line-clamp-2 text-[6cqw] font-bold leading-[1.4]">
            {title}
          </h3>

          <p className="line-clamp-3 break-words text-justify text-[3.5cqw] font-medium leading-[1.45] text-neutral-600">
            {description}
          </p>
        </div>

        {/* белая вуаль: карточка остаётся непрозрачной, но выглядит светлее */}
        <div
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ opacity: slot.veil, transition: fade }}
        />
      </div>
    </div>
  );
}

/* ---------- Карусель ---------- */
export function NewsCarousel({
  news,
  isLoading,
  onOpen,
}: {
  /** Уже отфильтрованные и отсортированные новости (новые первыми). Показываются все. */
  news: NewsEntity[];
  isLoading: boolean;
  onOpen: (item: NewsEntity) => void;
}) {
  const { t } = useTranslation();

  const count = news.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = Math.min(index, Math.max(count - 1, 0));
  const mode = getMode(active, count);

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // направление автоплея: идёт вперёд до конца, потом назад до начала и так далее
  const dirRef = useRef<1 | -1>(1);

  const go = (next: number) => {
    const target = Math.max(0, Math.min(count - 1, next));
    // автоплей продолжает в ту сторону, куда пользователь листал последний раз
    if (target !== active) dirRef.current = target > active ? 1 : -1;
    setIndex(target);
  };

  /* ---- размеры в пикселях: двигаем карточки только через transform ---- */
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ stage: 0, card: 0 });
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let timer: ReturnType<typeof setTimeout>;
    const measure = () => {
      const card = stage.firstElementChild as HTMLElement | null;
      setSize({ stage: stage.clientWidth, card: card?.offsetWidth ?? 0 });
      // при ресайзе и первой отрисовке анимацию выключаем, чтобы карточки не «ехали» следом
      setAnimate(false);
      clearTimeout(timer);
      timer = setTimeout(() => setAnimate(true), 150);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [count, isLoading]);

  const transition =
    animate && !reduceMotion
      ? `transform ${MOVE_MS}ms ${EASE}, filter ${MOVE_MS}ms ${EASE}`
      : 'none';

  /* ---- автоплей: стоит на паузе при наведении, фокусе и свайпе ---- */
  useEffect(() => {
    if (paused || count < 2 || reduceMotion) return;
    const id = setInterval(() => {
      let dir = dirRef.current;
      // дошли до края: разворачиваемся и листаем обратно
      if (active + dir >= count || active + dir < 0) dir = dir === 1 ? -1 : 1;
      dirRef.current = dir;
      setIndex(active + dir);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count, reduceMotion, active]);

  /* ---- листание: свайп и перетаскивание мышью ---- */
  const startX = useRef<number | null>(null);
  // setPointerCapture перенаправляет click на стейдж, поэтому target записываем
  // в pointerdown (до захвата) и используем в pointerup для определения карточки
  const tapTarget = useRef<Element | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    tapTarget.current = e.target as Element;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setPaused(true);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;

    if (Math.abs(dx) > SWIPE_PX) {
      go(active + (dx < 0 ? 1 : -1));
      tapTarget.current = null;
      return;
    }

    // тап без свайпа: открываем новость или выводим карточку вперёд
    const target = tapTarget.current;
    tapTarget.current = null;
    const cardEl = target?.closest('[data-card-index]') as HTMLElement | null;
    if (!cardEl) return;

    const idx = parseInt(cardEl.dataset.cardIndex ?? '-1', 10);
    if (idx < 0) return;

    if (idx === active) {
      onOpen(news[idx]);
    } else {
      go(idx);
    }
  };

  /* ---- листание: горизонтальная прокрутка колесом и тачпадом ---- */
  const wheelLock = useRef(false);
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (wheelLock.current) return;
    if (
      Math.abs(e.deltaX) < WHEEL_MIN ||
      Math.abs(e.deltaX) < Math.abs(e.deltaY)
    ) {
      return;
    }
    go(active + (e.deltaX > 0 ? 1 : -1));
    wheelLock.current = true;
    setTimeout(() => {
      wheelLock.current = false;
    }, WHEEL_LOCK_MS);
  };

  /* ---- листание: стрелки на клавиатуре ---- */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  };

  if (isLoading) return <NewsCarouselSkeleton />;
  if (count === 0) return null;

  const from = Math.max(0, active - RENDER_RANGE);
  const to = Math.min(count - 1, active + RENDER_RANGE);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t('news.title', 'Новости')}
      className="flex h-full min-h-0 flex-col"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={stageRef}
        className="relative aspect-[20/19] w-full touch-pan-y select-none lg:aspect-auto lg:min-h-0 lg:flex-1"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
          tapTarget.current = null;
        }}
        onWheel={onWheel}
      >
        {news.slice(from, to + 1).map((item, k) => {
          const i = from + k;
          return (
            <NewsCard
              key={item.id}
              item={item}
              slot={getSlot(i - active, mode, count, size)}
              transition={transition}
              cardIndex={i}
              onSelect={() => go(i)}
              onRead={() => onOpen(item)}
            />
          );
        })}
      </div>

      <div className={BOTTOM_ROW}>
        {count > 1 && <Dots count={count} active={active} onSelect={go} />}
      </div>
    </div>
  );
}

export default NewsCarousel;
