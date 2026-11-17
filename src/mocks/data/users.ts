import type {
  DepartmentWithPositions,
  StaffDepartment,
  StaffPosition,
  User,
} from '../../api/model';

import { lt } from './utils';

// Публичные эндпоинты отдают пользователя урезанным: только VID и имя.
export type PublicUser = { id: number; name: { first: string } };

const person = (id: number, first: string): PublicUser => ({
  id,
  name: { first },
});

export const people = {
  director: person(700101, 'Andrei'),
  atcOps: person(700102, 'Mikita'),
  flightOps: person(700103, 'Dzianis'),
  training: person(700104, 'Siarhei'),
  trainingAdvisor: person(700105, 'Volha'),
  events: person(700106, 'Yauhen'),
  eventsAssistant: person(700107, 'Hanna'),
  prAssistant: person(700108, 'Kiryl'),
  membership: person(700109, 'Maksim'),
  membershipAssistant: person(700110, 'Darya'),
  webmaster: person(700111, 'Uladzimir'),
  // Текущий пользователь в профиле «staff» — он же BY-AWM.
  me: person(712345, 'Ales'),
  // Участники событий, не входящие в staff.
  controllerA: person(720001, 'Artsiom'),
  controllerB: person(720002, 'Palina'),
  controllerC: person(720003, 'Ihar'),
};

const departments: StaffDepartment[] = [
  { id: 'HQ', order: 1, name: 'Headquarters', email: 'by-hq@ivao.aero' },
  {
    id: 'AO',
    order: 2,
    name: 'ATC Operations Department',
    email: 'by-atcops@ivao.aero',
  },
  {
    id: 'FO',
    order: 3,
    name: 'Flight Operations Department',
    email: 'by-flightops@ivao.aero',
  },
  {
    id: 'SO',
    order: 4,
    name: 'Special Operations Department',
    email: 'by-specialops@ivao.aero',
  },
  {
    id: 'TD',
    order: 5,
    name: 'Training Department',
    email: 'by-training@ivao.aero',
  },
  {
    id: 'ED',
    order: 6,
    name: 'Events Department',
    email: 'by-events@ivao.aero',
  },
  {
    id: 'PR',
    order: 7,
    name: 'Public Relations Department',
    email: 'by-publicrelations@ivao.aero',
  },
  {
    id: 'MD',
    order: 8,
    name: 'Membership Department',
    email: 'by-membership@ivao.aero',
  },
  { id: 'WD', order: 9, name: 'Web Department', email: 'by-web@ivao.aero' },
];

const titles = {
  director: lt('Director', 'Директор', 'Дырэктар'),
  coordinator: lt('Coordinator', 'Координатор', 'Каардынатар'),
  assistant: lt(
    'Assistant Coordinator',
    'Ассистент координатора',
    'Асістэнт каардынатара',
  ),
  advisor: lt('Advisor', 'Советник', 'Дарадца'),
  trainer: lt('Trainer', 'Тренер', 'Трэнер'),
  webmaster: lt('Webmaster', 'Вебмастер', 'Вэбмайстар'),
  assistantWebmaster: lt(
    'Assistant Webmaster',
    'Ассистент вебмастера',
    'Асістэнт вэбмайстра',
  ),
};

const position = (
  departmentId: string,
  id: string,
  order: number,
  name: StaffPosition['name'],
  user: PublicUser | null,
): StaffPosition => ({
  departmentId,
  prefix: 'BY',
  id,
  order,
  name,
  description: name,
  userId: user?.id ?? null,
  user: user as User,
  is_vacant: user ? 0 : 1,
});

const positions: StaffPosition[] = [
  position('HQ', 'DIR', 0, titles.director, people.director),
  position('AO', 'AOC', 0, titles.coordinator, people.atcOps),
  position('FO', 'FOC', 0, titles.coordinator, people.flightOps),
  position('SO', 'SOC', 0, titles.coordinator, null),
  position('TD', 'TC', 0, titles.coordinator, people.training),
  position('TD', 'TA1', 1, titles.advisor, people.trainingAdvisor),
  position('TD', 'T01', 2, titles.trainer, null),
  position('TD', 'T02', 3, titles.trainer, null),
  position('ED', 'EC', 0, titles.coordinator, people.events),
  position('ED', 'EAC', 1, titles.assistant, people.eventsAssistant),
  position('PR', 'PRC', 0, titles.coordinator, null),
  position('PR', 'PRAC', 1, titles.assistant, people.prAssistant),
  position('MD', 'MC', 0, titles.coordinator, people.membership),
  position('MD', 'MAC', 1, titles.assistant, people.membershipAssistant),
  position('WD', 'WM', 0, titles.webmaster, people.webmaster),
  position('WD', 'AWM', 1, titles.assistantWebmaster, people.me),
];

export const staff: DepartmentWithPositions[] = departments.map((d) => ({
  ...d,
  positions: positions.filter((p) => p.departmentId === d.id),
}));

const department = (id?: string) => departments.find((d) => d.id === id);

// Профили текущего пользователя для mock-режима.
export const profiles = {
  // BY-AWM: есть доступ к админ-режиму /vehicles, рейтинг ATC — APC.
  staff: {
    id: people.me.id,
    name: { first: 'Ales', last: 'Kavalenka' },
    centerId: null,
    countryId: 'BY',
    divisionId: 'BY',
    ratings: { atc: 6, pilot: 4 },
    email: 'ales.kavalenka@example.com',
    staffPositions: positions
      .filter((p) => p.user?.id === people.me.id)
      .map(({ user: _user, ...p }) => ({
        ...p,
        staffDepartment: department(p.departmentId),
      })),
  },
  // Обычный участник: без staff-позиций, рейтинг ATC — AS2 (на TWR/APP не хватает).
  member: {
    id: 712346,
    name: { first: 'Iryna', last: 'Savich' },
    centerId: null,
    countryId: 'BY',
    divisionId: 'BY',
    ratings: { atc: 3, pilot: 3 },
    email: 'iryna.savich@example.com',
    staffPositions: [],
  },
} satisfies Record<string, User>;

export type MockProfile = keyof typeof profiles;
