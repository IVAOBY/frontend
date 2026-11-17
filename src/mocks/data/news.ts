import type { NewsCategory, NewsEntity, User } from '../../api/model';
import type { PublicUser } from './users';

import { people } from './users';
import { at, lt, placeholder } from './utils';

const types = {
  department: {
    id: 1,
    slug: 'department',
    name: lt('Department', 'Отдел', 'Аддзел'),
    order: 0,
  },
  location: {
    id: 2,
    slug: 'location',
    name: lt('Location', 'Место', 'Месца'),
    order: 1,
  },
  other: {
    id: 3,
    slug: 'other',
    name: lt('Other', 'Другое', 'Іншае'),
    order: 2,
  },
};

const category = (
  id: number,
  type: keyof typeof types,
  slug: string,
  name: NewsCategory['name'],
): NewsCategory => ({
  id,
  slug,
  typeId: types[type].id,
  type: types[type],
  name,
  order: 0,
});

const categories = {
  hq: category(2, 'department', 'hq', lt('HQ', 'HQ', 'HQ')),
  events: category(
    5,
    'department',
    'events',
    lt('Events', 'События', 'Падзеі'),
  ),
  training: category(
    6,
    'department',
    'training',
    lt('Training', 'Обучение', 'Навучанне'),
  ),
  web: category(7, 'department', 'web', lt('Web', 'Веб', 'Вэб')),
  division: category(
    4,
    'location',
    'div',
    lt('Division', 'Дивизион', 'Дывізіён'),
  ),
  recruitment: category(
    3,
    'other',
    'recruitment',
    lt('Recruitment', 'Набор', 'Набор'),
  ),
};

// В новостях автор приходит со списком своих позиций — по ним строится подпись «BY-…».
const author = (user: PublicUser, ...positionIds: string[]) =>
  ({
    ...user,
    staffPositions: positionIds.map((id) => ({ prefix: 'BY', id })),
  }) as unknown as User;

export const news: NewsEntity[] = [
  {
    id: 21,
    userId: people.events.id,
    user: author(people.events, 'EC'),
    name: lt(
      'Minsk RFE: ATC booking is open',
      'Minsk RFE: открыто бронирование ATC',
      'Minsk RFE: адкрыта браніраванне ATC',
    ),
    description: lt(
      'The <b>Real Flight Event in Minsk</b> is coming. ATC booking is now open on the event page — choose a shift and a position matching your rating.<br><br>Pilots: slots will be published a week before the event.',
      'Приближается <b>Real Flight Event в Минске</b>. На странице события открыто бронирование позиций ATC — выберите смену и позицию по своему рейтингу.<br><br>Пилотам: слоты опубликуем за неделю до события.',
      'Набліжаецца <b>Real Flight Event у Мінску</b>. На старонцы падзеі адкрыта браніраванне пазіцый ATC — абярыце змену і пазіцыю па сваім рэйтынгу.<br><br>Пілотам: слоты апублікуем за тыдзень да падзеі.',
    ),
    image_url: placeholder('Minsk RFE', '#0D2C99'),
    publishedAt: at(-1, 10),
    categories: [categories.events, categories.division],
  },
  {
    id: 20,
    userId: people.director.id,
    user: author(people.director, 'DIR'),
    name: lt(
      'We are looking for a BY-PRC',
      'Мы ищем BY-PRC',
      'Мы шукаем BY-PRC',
    ),
    description: lt(
      'A vacancy is open in our team — we are looking for a <b>Public Relations Coordinator</b>. If you love aviation and communication, write to <a href="mailto:by-hq@ivao.aero">by-hq@ivao.aero</a>.',
      'В нашей команде открыта вакансия — мы ищем <b>координатора по связям с общественностью</b>. Если вы любите авиацию и общение, пишите на <a href="mailto:by-hq@ivao.aero">by-hq@ivao.aero</a>.',
      'У нашай камандзе адкрыта вакансія — мы шукаем <b>каардынатара па сувязях з грамадскасцю</b>. Калі вы любіце авіяцыю і зносіны, пішыце на <a href="mailto:by-hq@ivao.aero">by-hq@ivao.aero</a>.',
    ),
    image_url: placeholder('BY-PRC', '#2A4BC4'),
    publishedAt: at(-6, 9),
    categories: [categories.hq, categories.recruitment, categories.division],
  },
  {
    id: 19,
    userId: people.training.id,
    user: author(people.training, 'TC'),
    name: lt(
      'New training schedule for ATC students',
      'Новое расписание тренировок для ATC',
      'Новы расклад трэніровак для ATC',
    ),
    description: lt(
      'Practical ATC training now takes place <b>every Wednesday and Friday</b>. The schedule is available in the agenda; sign up through your trainer.',
      'Практические тренировки ATC теперь проходят <b>каждую среду и пятницу</b>. Расписание — в агенде, записывайтесь через своего тренера.',
      'Практычныя трэніроўкі ATC цяпер праходзяць <b>кожную сераду і пятніцу</b>. Расклад — у агендзе, запісвайцеся праз свайго трэнера.',
    ),
    image_url: placeholder('Training', '#1F7A4D'),
    publishedAt: at(-14, 12),
    categories: [categories.training],
  },
  {
    id: 18,
    userId: people.webmaster.id,
    user: author(people.webmaster, 'WM'),
    name: lt(
      'Follow-Me Car permissions are now online',
      'Разрешения на Follow-Me Car теперь онлайн',
      'Дазволы на Follow-Me Car цяпер анлайн',
    ),
    description: lt(
      'The list of controllers allowed to use vehicles is now published on the website. Permissions are issued by the ATC Operations Department.',
      'Список диспетчеров с допуском к технике теперь опубликован на сайте. Разрешения выдаёт отдел ATC Operations.',
      'Спіс дыспетчараў з допускам да тэхнікі цяпер апублікаваны на сайце. Дазволы выдае аддзел ATC Operations.',
    ),
    image_url: placeholder('Vehicles', '#B8860B'),
    publishedAt: at(-30, 16),
    categories: [categories.web],
  },
  {
    id: 17,
    userId: null,
    name: lt(
      'Belarus Online Evening: results',
      'Belarus Online Evening: итоги',
      'Belarus Online Evening: вынікі',
    ),
    description: lt(
      'Thank you to everyone who flew and controlled with us! <b>64 flights</b> and <b>9 ATC positions</b> online during the evening.',
      'Спасибо всем, кто летал и управлял вместе с нами! За вечер — <b>64 полёта</b> и <b>9 позиций ATC</b> онлайн.',
      'Дзякуй усім, хто лятаў і кіраваў разам з намі! За вечар — <b>64 палёты</b> і <b>9 пазіцый ATC</b> анлайн.',
    ),
    image_url: placeholder('Online Evening', '#5B2A86'),
    publishedAt: at(-40, 20),
    categories: [categories.events],
  },
];
