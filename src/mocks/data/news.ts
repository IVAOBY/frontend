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
      'Minsk RFE: ATC booking open (bring snacks & spare vocal cords)',
      'Minsk RFE: бронь ATC открыта (берите чай и запасные связки)',
      'Minsk RFE: бронь ATC адкрыта (бярыце гарбату і запасныя звязкі)',
    ),
    description: lt(
      'The <b>Real Flight Event in Minsk</b> is almost here! ATC booking is open — grab a shift before Minsk Ground gets stuck untangling three lost Airbus pilots at once.<br><br>Pilots: slots arrive a week early. Clapping after a -650 fpm touchdown remains optional.',
      'Приближается <b>Real Flight Event в Минске</b>! Бронирование ATC уже открыто — успейте занять смену, пока Minsk Ground не начал распутывать три заблудившихся Airbus одновременно.<br><br>Пилотам: слоты выложим за неделю. Аплодисменты после посадки с вертикальной -650 fpm — по желанию.',
      'Набліжаецца <b>Real Flight Event у Мінску</b>! Браніраванне ATC ужо адкрыта — паспейце заняць змену, пакуль Minsk Ground не пачаў разблытваць тры заблукалыя Airbus адначасова.<br><br>Пілотам: слоты выкладзем за тыдзень. Апладысменты пасля пасадкі з вертыкальнай -650 fpm — па жаданні.',
    ),
    image_url: placeholder('Minsk RFE: Bring Snacks', '#0D2C99'),
    publishedAt: at(-1, 10),
    categories: [categories.events, categories.division],
  },
  {
    id: 20,
    userId: people.director.id,
    user: author(people.director, 'DIR'),
    name: lt(
      'Wanted: BY-PRC (must laugh at Director’s aviation puns)',
      'Ищем BY-PRC (обязательно смеяться над шутками директора)',
      'Шукаем BY-PRC (абавязкова смяяцца з жартаў дырэктара)',
    ),
    description: lt(
      'We are hiring a <b>Public Relations Coordinator</b>! Key skills: turning “the server crashed on short final” into “immersive unscheduled emergency drill” and posting memes faster than Mach 0.82. Salary: 0 BYN and infinite respect. Write to <a href="mailto:by-hq@ivao.aero">by-hq@ivao.aero</a>.',
      'В нашей команде открыта вакансия <b>координатора по связям с общественностью</b>! Нужно уметь превращать «упал сервер на глиссаде» в «внеплановые учения по нештатной ситуации» и постить мемы быстрее 0.82 Маха. Зарплата: 0 BYN и безлимитное уважение. Пишите на <a href="mailto:by-hq@ivao.aero">by-hq@ivao.aero</a>.',
      'У нашай камандзе адкрыта вакансія <b>каардынатара па сувязях з грамадскасцю</b>! Трэба ўмець ператвараць «упаў сервер на глісадзе» ў «пазапланавыя вучэнні па няштатнай сітуацыі» і посціць мемы хутчэй за 0.82 Маха. Заробак: 0 BYN і бязлімітная павага. Пішыце на <a href="mailto:by-hq@ivao.aero">by-hq@ivao.aero</a>.',
    ),
    image_url: placeholder('Wanted: Chief Memer', '#2A4BC4'),
    publishedAt: at(-6, 9),
    categories: [categories.hq, categories.recruitment, categories.division],
  },
  {
    id: 19,
    userId: people.training.id,
    user: author(people.training, 'TC'),
    name: lt(
      'New ATC training schedule: poker-face practice included',
      'Новое расписание тренировок ATC: учимся не паниковать в эфире',
      'Новы расклад трэніровак ATC: вучымся не панікаваць у эфіры',
    ),
    description: lt(
      'Practical ATC training now runs <b>every Wednesday and Friday</b>. Curriculum update: how to stay calm when a Boeing 747 requests VFR circuits at a 425-meter grass strip and forgets to switch off the mic.',
      'Практические тренировки ATC теперь проходят <b>каждую среду и пятницу</b>. В программе: как сохранять ледяное спокойствие, когда Boeing 747 просит визуальный заход на грунтовку длиной 425 метров и забывает отпустить тангенту.',
      'Практычныя трэніроўкі ATC цяпер праходзяць <b>кожную сераду і пятніцу</b>. У праграме: як захоўваць ледзяны спакой, калі Boeing 747 просіць візуальны заход на грунтоўку даўжынёй 425 метраў і забывае адпусціць тангенту.',
    ),
    image_url: placeholder('ATC Nerve Training', '#1F7A4D'),
    publishedAt: at(-14, 12),
    categories: [categories.training],
  },
  {
    id: 18,
    userId: people.webmaster.id,
    user: author(people.webmaster, 'WM'),
    name: lt(
      'Follow-Me Car permits are online (drift mode still banned)',
      'Права на Follow-Me Car уже на сайте (дрифт всё ещё запрещён)',
      'Правы на Follow-Me Car ужо на сайце (дрыфт усё яшчэ забаронены)',
    ),
    description: lt(
      'The official list of controllers legally trusted with flashing orange lights is now live! Reminder from ATC Operations: overtaking a taxiing Boeing 737 on the right and doing donuts on Apron 2 will result in immediate downgrade to bicycle.',
      'Официальный список диспетчеров, которым доверили жёлтую мигалку, теперь на сайте! Напоминание от ATC Operations: обгон рулящего Boeing 737 справа и «пятаки» на втором перроне караются переводом на служебный велосипед.',
      'Афіцыйны спіс дыспетчараў, якім даверылі жоўтую мігалку, цяпер на сайце! Напамін ад ATC Operations: абгон рулячага Boeing 737 справа і «пятакі» на другім пероне караюцца пераводам на службовы ровар.',
    ),
    image_url: placeholder('Follow-Me: No Drift!', '#B8860B'),
    publishedAt: at(-30, 16),
    categories: [categories.web],
  },
  {
    id: 17,
    userId: null,
    name: lt(
      'Belarus Online Evening: results & surviving headsets',
      'Belarus Online Evening: итоги вечера и выжившие гарнитуры',
      'Belarus Online Evening: вынікі вечара і выжылыя гарнітуры',
    ),
    description: lt(
      'Huge thanks to everyone who flew and controlled! Final tally: <b>64 flights</b>, <b>9 ATC positions</b>, 47 creative go-arounds, 12 forgotten QNH settings, and one heroic Cessna 172 that somehow climbed to FL350.',
      'Огромное спасибо всем, кто летал и диспитчил! Итоги вечера: <b>64 полёта</b>, <b>9 позиций ATC</b>, 47 художественных уходов на второй круг, 12 забытых QNH и одна героическая Cessna 172, каким-то чудом забравшаяся на FL350.',
      'Вялікі дзякуй усім, хто лятаў і дыспетчыў! Вынікі вечара: <b>64 палёты</b>, <b>9 пазіцый ATC</b>, 47 мастацкіх сыходаў на другое кола, 12 забытых QNH і адна гераічная Cessna 172, якая нейкім цудам залезла на FL350.',
    ),
    image_url: placeholder('64 Flights, 47 Go-Arounds', '#5B2A86'),
    publishedAt: at(-40, 20),
    categories: [categories.events],
  },
];
