import type { Documents, DocumentsCategory } from '../../api/model';

import { lt } from './utils';

const doc = (
  id: number,
  category: number,
  name: Documents['name'],
  content: Documents['content'],
  published = true,
): Documents => ({ id, category, name, content, published, authorId: null });

const section = (title: string, text: string) =>
  `<h2>${title}</h2><p>${text}</p>`;

export const documents: Documents[] = [
  doc(
    1,
    0,
    lt('Local Procedures', 'Местные процедуры', 'Мясцовыя працэдуры'),
    lt(
      section(
        '1. General',
        'These procedures apply to all ATC positions within the Minsk FIR.',
      ) +
        section(
          '2. Transition altitude',
          'Transition altitude is <b>6000 ft</b>, transition level is <b>FL80</b>.',
        ),
      section(
        '1. Общие положения',
        'Процедуры распространяются на все позиции ATC в РПИ Минск.',
      ) +
        section(
          '2. Высота перехода',
          'Высота перехода — <b>6000 ft</b>, эшелон перехода — <b>FL80</b>.',
        ),
      section(
        '1. Агульныя палажэнні',
        'Працэдуры распаўсюджваюцца на ўсе пазіцыі ATC у РПІ Мінск.',
      ) +
        section(
          '2. Вышыня пераходу',
          'Вышыня пераходу — <b>6000 ft</b>, эшалон пераходу — <b>FL80</b>.',
        ),
    ),
  ),
  doc(
    2,
    0,
    lt(
      'Discord Server Rules',
      'Правила Discord-сервера',
      'Правілы Discord-сервера',
    ),
    lt(
      section(
        'Rules',
        'Be respectful. Keep channels on topic. No advertising.',
      ),
      section(
        'Правила',
        'Уважайте друг друга. Пишите по теме канала. Без рекламы.',
      ),
      section(
        'Правілы',
        'Паважайце адзін аднаго. Пішыце па тэме канала. Без рэкламы.',
      ),
    ),
  ),
  doc(
    3,
    1,
    lt(
      'Radio Communication Phraseology',
      'Фразеология радиообмена',
      'Фразеалогія радыёабмену',
    ),
    lt(
      section(
        'Readback',
        'Clearances for altitude, heading and speed must always be read back.',
      ),
      section(
        'Квитирование',
        'Указания по высоте, курсу и скорости всегда квитируются.',
      ),
      section(
        'Квітаванне',
        'Указанні па вышыні, курсе і хуткасці заўсёды квітуюцца.',
      ),
    ),
  ),
  doc(
    4,
    1,
    lt('ACC Sectors', 'Секторы РДЦ', 'Сектары РДЦ'),
    lt(
      section(
        'Sectorisation',
        'Minsk Control (UMMV_CTR) covers the whole FIR when no sectors are online.',
      ),
      section(
        'Секторизация',
        'Minsk Control (UMMV_CTR) покрывает весь РПИ, если секторы не открыты.',
      ),
      section(
        'Сектарызацыя',
        'Minsk Control (UMMV_CTR) пакрывае ўвесь РПІ, калі сектары не адкрыты.',
      ),
    ),
  ),
  doc(
    5,
    1,
    lt('Draft: Ground Movement', 'Черновик: руление', 'Чарнавік: руленне'),
    lt('<p>Draft</p>', '<p>Черновик</p>', '<p>Чарнавік</p>'),
    false,
  ),
  doc(
    6,
    2,
    lt('Flight Performance', 'Лётные характеристики', 'Лётныя характарыстыкі'),
    lt(
      section(
        'Speed limits',
        'Below FL100 the maximum speed is 250 kt IAS unless instructed otherwise.',
      ),
      section(
        'Ограничения скорости',
        'Ниже FL100 — не более 250 kt IAS, если не указано иное.',
      ),
      section(
        'Абмежаванні хуткасці',
        'Ніжэй FL100 — не больш за 250 kt IAS, калі не ўказана іншае.',
      ),
    ),
  ),
  doc(
    7,
    3,
    lt('Training Policy', 'Политика обучения', 'Палітыка навучання'),
    lt(
      section(
        'Requests',
        'Training requests are submitted through the IVAO HQ website.',
      ),
      section('Заявки', 'Заявки на обучение подаются через сайт IVAO HQ.'),
      section('Заяўкі', 'Заяўкі на навучанне падаюцца праз сайт IVAO HQ.'),
    ),
  ),
  doc(
    8,
    3,
    lt('Exam Policy', 'Политика экзаменов', 'Палітыка экзаменаў'),
    lt(
      section(
        'Practical exams',
        'A practical exam is scheduled after the trainer’s recommendation.',
      ),
      section(
        'Практические экзамены',
        'Практический экзамен назначается после рекомендации тренера.',
      ),
      section(
        'Практычныя экзамены',
        'Практычны экзамен прызначаецца пасля рэкамендацыі трэнера.',
      ),
    ),
  ),
];

const categoryNames: [number, DocumentsCategory['name']][] = [
  [0, lt('General Documents', 'Общие документы', 'Агульныя дакументы')],
  [1, lt('ATC Documentation', 'Документация УВД', 'Дакументацыя КПР')],
  [
    2,
    lt(
      'Pilots Documentation',
      'Документация для пилотов',
      'Дакументацыя для пілотаў',
    ),
  ],
  [
    3,
    lt(
      'Training Documentation',
      'Учебная документация',
      'Вучэбная дакументацыя',
    ),
  ],
  // Пустая категория — как «SO Documentation» в реальных данных.
  [4, lt('SO Documentation', 'Документация СО', 'Дакументацыя СА')],
];

export const documentCategories: DocumentsCategory[] = categoryNames.map(
  ([id, name]) => ({
    id,
    order: id,
    name,
    documents: documents.filter((d) => d.category === id),
  }),
);
