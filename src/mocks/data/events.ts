import type {
  AgendaItem,
  AtcEntity,
  EventAtcPositions,
  EventEntity,
} from '../../api/model';
import type { PublicUser } from './users';

import { airports } from './airports';
import { people } from './users';
import { at, lt, placeholder } from './utils';

const atcById = new Map<number, AtcEntity>(
  airports.flatMap((a) => a.atcPositions).map((p) => [p.id, p]),
);
// Позиция РДЦ не привязана к аэродрому, поэтому в справочнике аэродромов её нет.
atcById.set(2, {
  id: 2,
  callsign: 'UMMV_CTR',
  name: lt(
    'Minsk Control (All-Seeing)',
    'Minsk Control (Всевидящий)',
    'Minsk Control (Усёвідушчы)',
  ),
  frequency: '120.125',
  airportIcao: null,
  fra: 5,
});

const ATC = {
  UMMV_CTR: 2,
  UMMS_TWR: 1,
  UMMS_GND: 3,
  UMMS_R_APP: 4,
  UMMS_APP: 19,
  UMGG_TWR: 7,
  UMGG_APP: 8,
  UMOO_A_TWR: 5,
} as const;

export const events: EventEntity[] = [
  {
    id: 101,
    startDate: at(4, 15),
    endDate: at(4, 19),
    name: lt(
      'Belarus Online Evening: Draniki & Directs',
      'Belarus Online Evening: Драники и директы',
      'Belarus Online Evening: Дранікі і дырэкты',
    ),
    description: lt(
      'Every third Saturday from 15:00 to 19:00 UTC we test whether Minsk Approach can vector 15 aircraft simultaneously while eating draniki with sour cream. Main airfields: <b>Minsk (UMMS) and Mahiliou (UMOO)</b>.',
      'Каждую третью субботу месяца с 15:00 до 19:00 UTC проверяем, сможет ли Minsk Approach развести 15 бортов одновременно, не выпуская из рук тарелку с драниками и сметаной. Основные аэродромы: <b>Минск (UMMS) и Могилёв (UMOO)</b>.',
      'Кожную трэцюю суботу месяца з 15:00 да 19:00 UTC правяраем, ці зможа Minsk Approach развесці 15 бартоў адначасова, не выпускаючы з рук талерку з дранікамі і смятанай. Асноўныя аэрадромы: <b>Мінск (UMMS) і Магілёў (UMOO)</b>.',
    ),
    imageUrl: placeholder('Draniki & Directs', '#0D2C99'),
    infoUrl: '',
    airport: 'UMMS UMOO',
    tags: { id: 1, category: 'div', type: 'Online', hq: false },
    hidden: false,
  },
  {
    id: 102,
    startDate: at(12, 10),
    endDate: at(12, 18),
    name: lt(
      'Minsk RFE: No Slew Mode Allowed',
      'Minsk RFE: телепортация запрещена',
      'Minsk RFE: тэлепартацыя забаронена',
    ),
    description: lt(
      'Fly real-world schedules in and out of <b>Minsk National Airport</b> — complete with realistic pushback delays because the aircraft ahead of you is reprogramming its FMC for the fourth time. Full ATC from Control to Ground.',
      'Полёты по реальному расписанию в <b>Национальный аэропорт Минск</b> и обратно — с максимально реалистичным ожиданием буксировки, потому что борт перед вами четвёртый раз перебивает маршрут в FMC. Полный контроль от Control до Ground.',
      'Палёты па рэальным раскладзе ў <b>Нацыянальны аэрапорт Мінск</b> і назад — з максімальна рэалістычным чаканнем буксіроўкі, бо борт перад вамі чацвёрты раз перабівае маршрут у FMC. Поўны кантроль ад Control да Ground.',
    ),
    imageUrl: placeholder('Minsk RFE: No Slew!', '#2A4BC4'),
    infoUrl: 'https://www.ivao.aero/',
    airport: 'UMMS',
    tags: { id: 2, category: 'int', type: 'RFE', hq: true },
    hidden: false,
  },
  {
    id: 103,
    startDate: at(-10, 14),
    endDate: at(-10, 17),
    name: lt(
      'Homiel Fly-In: The Bounced Landing Cup',
      'Homiel Fly-In: Кубок двойного касания',
      'Homiel Fly-In: Кубак падвойнага дакранання',
    ),
    description: lt(
      'A relaxed afternoon of crabbing sideways into <b>Homiel (UMGG)</b> and loudly insisting on frequency that your three-bounce landing was actually a planned touch-and-go.',
      'Неспешный день заходов боком в <b>Гомель (UMGG)</b> с последующим убеждением диспетчера, что тройной «козёл» на самом деле был запланированным конвейером.',
      'Спакойны дзень заходаў бокам у <b>Гомель (UMGG)</b> з далейшым перакананнем дыспетчара, што трайны «казёл» насамрэч быў запланаваным канвеерам.',
    ),
    imageUrl: placeholder('Homiel Bounce Cup', '#1F7A4D'),
    infoUrl: '',
    airport: 'UMGG',
    tags: { id: 3, category: 'user', type: 'FlyIn', hq: false },
    hidden: false,
  },
  {
    id: 104,
    startDate: at(25, 16),
    endDate: at(25, 20),
    name: lt(
      'Viciebsk – Hrodna: The Great Bulba Airbridge',
      'Витебск – Гродно: Великий Бульба-мост',
      'Віцебск – Гродна: Вялікі Бульба-мост',
    ),
    description: lt(
      'Urgent cargo shuttles delivering strategic reserves of virtual potatoes between <b>Viciebsk (UMII)</b> and <b>Hrodna (UMMG)</b>. ATC booking opens once controllers finish rock-paper-scissors for Radar.',
      'Срочные челночные рейсы по доставке стратегических запасов виртуальной бульбы между <b>Витебском (UMII)</b> и <b>Гродно (UMMG)</b>. Бронирование ATC откроется, как только диспетчеры разыграют на «цу-е-фа», кому сидеть на Радаре.',
      'Тэрміновыя чоўнікавыя рэйсы па дастаўцы стратэгічных запасаў віртуальнай бульбы паміж <b>Віцебскам (UMII)</b> і <b>Гродна (UMMG)</b>. Браніраванне ATC адкрыецца, як толькі дыспетчары разыграюць у «камень-нажніцы-папера», каму сядзець на Радары.',
    ),
    imageUrl: placeholder('The Bulba Airbridge', '#5B2A86'),
    infoUrl: '',
    airport: 'UMII UMMG',
    tags: { id: 4, category: 'div', type: 'Airbridge', hq: false },
    hidden: false,
  },
];

export type MockPart = {
  id: number;
  eventId: number;
  startDate: string;
  endDate: string;
  positions: EventAtcPositions[];
};

let eventPositionId = 500;
const positions = (eventId: number, atcIds: number[]): EventAtcPositions[] =>
  atcIds.map((atcPositionId) => ({
    id: ++eventPositionId,
    eventId,
    atcPositionId,
    position: atcById.get(atcPositionId),
  }));

export const parts: MockPart[] = [
  {
    id: 201,
    eventId: 101,
    startDate: at(4, 15),
    endDate: at(4, 19),
    positions: positions(101, [
      ATC.UMMV_CTR,
      ATC.UMMS_APP,
      ATC.UMMS_TWR,
      ATC.UMMS_GND,
      ATC.UMOO_A_TWR,
    ]),
  },
  {
    id: 202,
    eventId: 102,
    startDate: at(12, 10),
    endDate: at(12, 14),
    positions: positions(102, [
      ATC.UMMV_CTR,
      ATC.UMMS_R_APP,
      ATC.UMMS_APP,
      ATC.UMMS_TWR,
      ATC.UMMS_GND,
    ]),
  },
  {
    id: 203,
    eventId: 102,
    startDate: at(12, 14),
    endDate: at(12, 18),
    positions: positions(102, [
      ATC.UMMV_CTR,
      ATC.UMMS_APP,
      ATC.UMMS_TWR,
      ATC.UMMS_GND,
    ]),
  },
  {
    id: 204,
    eventId: 103,
    startDate: at(-10, 14),
    endDate: at(-10, 17),
    positions: positions(103, [ATC.UMGG_APP, ATC.UMGG_TWR]),
  },
];

export const BookingStatus = { pending: 0, accepted: 1, rejected: 2 } as const;

export type MockBooking = {
  id: number;
  partId: number;
  eventPositionId: number;
  user: PublicUser;
  status: number;
};

const slot = (partId: number, callsign: string) =>
  parts
    .find((p) => p.id === partId)
    .positions.find((p) => p.position.callsign === callsign).id;

// Все три статуса на одном событии; у профиля «staff» есть собственная заявка.
export const bookings: MockBooking[] = [
  {
    id: 901,
    partId: 201,
    eventPositionId: slot(201, 'UMMS_APP'),
    user: people.controllerA,
    status: BookingStatus.accepted,
  },
  {
    id: 902,
    partId: 201,
    eventPositionId: slot(201, 'UMMS_GND'),
    user: people.controllerB,
    status: BookingStatus.rejected,
  },
  {
    id: 903,
    partId: 201,
    eventPositionId: slot(201, 'UMMS_TWR'),
    user: people.controllerC,
    status: BookingStatus.pending,
  },
  {
    id: 904,
    partId: 201,
    eventPositionId: slot(201, 'UMOO_A_TWR'),
    user: people.me,
    status: BookingStatus.pending,
  },
  {
    id: 905,
    partId: 202,
    eventPositionId: slot(202, 'UMMV_CTR'),
    user: people.atcOps,
    status: BookingStatus.accepted,
  },
  {
    id: 906,
    partId: 204,
    eventPositionId: slot(204, 'UMGG_APP'),
    user: people.controllerA,
    status: BookingStatus.accepted,
  },
  {
    id: 907,
    partId: 204,
    eventPositionId: slot(204, 'UMGG_TWR'),
    user: people.controllerB,
    status: BookingStatus.accepted,
  },
];

export const agenda: AgendaItem[] = [
  ...events.map((e) => ({
    id: e.id,
    type: 0 as const,
    startDate: e.startDate,
    endDate: e.endDate,
    title: e.name.en,
    annotation: e.description.en,
    airport: e.airport,
  })),
  {
    id: 301,
    type: 1,
    startDate: at(1, 16),
    endDate: at(1, 18),
    title: 'ATC Training: "Say Again" Endurance Test',
    annotation: `${people.controllerC.name.first} ${people.controllerC.id}, UMMS_TWR (bring spare coffee)`,
    airport: 'UMMS_TWR',
    link: 'https://discord.com/',
  },
  {
    id: 302,
    type: 1,
    startDate: at(3, 17),
    endDate: at(3, 19),
    title: 'Advanced ATC Training: Surviving 5 Go-Arounds',
    annotation: `${people.controllerB.name.first} ${people.controllerB.id}, UMMS_APP`,
    airport: 'UMMS_APP',
    link: 'https://discord.com/',
  },
  {
    id: 303,
    type: 2,
    startDate: at(8, 18),
    endDate: at(8, 20),
    title: 'ADC Practical Exam (No 747s Promised)',
    annotation: `${people.controllerA.name.first} ${people.controllerA.id}, UMGG_TWR`,
    airport: 'UMGG_TWR',
  },
  {
    id: 304,
    type: 3,
    startDate: at(6, 22),
    endDate: at(7, 1),
    title: 'Website Maintenance (Hamster Wheel Upgrade)',
    annotation:
      'The website and booking will be unavailable for up to 3 hours while we feed the server hamsters and hunt a missing semicolon.',
  },
];
