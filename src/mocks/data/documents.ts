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
    lt(
      'Local Procedures (Read Before Panicking)',
      'Местные процедуры (читать до начала паники)',
      'Мясцовыя працэдуры (чытаць да пачатку панікі)',
    ),
    lt(
      section(
        '1. General',
        'These procedures apply to all ATC positions in the Minsk FIR, including controllers who swear they know the airspace “by heart”.',
      ) +
        section(
          '2. Transition altitude',
          'Transition altitude is <b>6000 ft</b>, transition level is <b>FL80</b>. Transition from calm to mild panic occurs at 500 ft AGL when you notice the gear is still up.',
        ),
      section(
        '1. Общие положения',
        'Процедуры распространяются на все позиции ATC в РПИ Минск, включая диспетчеров, которые клянутся, что помнят все схемы «на глаз».',
      ) +
        section(
          '2. Высота перехода',
          'Высота перехода — <b>6000 ft</b>, эшелон перехода — <b>FL80</b>. Переход от спокойствия к лёгкой панике наступает на 500 ft, когда внезапно выясняется, что шасси не выпущены.',
        ),
      section(
        '1. Агульныя палажэнні',
        'Працэдуры распаўсюджваюцца на ўсе пазіцыі ATC у РПІ Мінск, уключаючы дыспетчараў, якія клянуцца, што памятаюць усе схемы «на вока».',
      ) +
        section(
          '2. Вышыня пераходу',
          'Вышыня пераходу — <b>6000 ft</b>, эшалон пераходу — <b>FL80</b>. Пераход ад спакою да лёгкай панікі наступае на 500 ft, калі раптам высвятляецца, што шасі не выпушчаны.',
        ),
    ),
  ),
  doc(
    2,
    0,
    lt(
      'Discord Rules (Don’t Wake the Director)',
      'Правила Discord (не будите директора)',
      'Правілы Discord (не будзіце дырэктара)',
    ),
    lt(
      section(
        'Rules',
        'Be respectful. Keep channels on topic. Arguing whether MSFS or X-Plane has better volumetric clouds is strictly limited to February 29th.',
      ),
      section(
        'Правила',
        'Уважайте друг друга. Пишите по теме канала. Споры о том, где облака красивее — в MSFS или X-Plane — разрешены строго 29 февраля.',
      ),
      section(
        'Правілы',
        'Паважайце адзін аднаго. Пішыце па тэме канала. Спрэчкі пра тое, дзе хмары прыгажэйшыя — у MSFS ці X-Plane — дазволены строга 29 лютага.',
      ),
    ),
  ),
  doc(
    3,
    1,
    lt(
      'Radio Phraseology (Beyond "Roger")',
      'Фразеология радиообмена (кроме слова «принял»)',
      'Фразеалогія радыёабмену (акрамя слова «зразумеў»)',
    ),
    lt(
      section(
        'Readback',
        'Altitude, heading, and speed clearances must always be read back. Replying just <b>“Roger”</b> to a four-line IFR clearance unlocks a complimentary scenic holding pattern over Bobruisk until sunset.',
      ),
      section(
        'Квитирование',
        'Указания по высоте, курсу и скорости всегда квитируются. Ответ просто <b>«Понял, принял»</b> на четырёхстрочное разрешение IFR даёт бесплатную экскурсию в зону ожидания над Бобруйском до заката.',
      ),
      section(
        'Квітаванне',
        'Указанні па вышыні, курсе і хуткасці заўсёды квітуюцца. Адказ проста <b>«Зразумеў, прыняў»</b> на чатырохрадковы дазвол IFR дае бясплатную экскурсію ў зону чакання над Бабруйскам да захаду сонца.',
      ),
    ),
  ),
  doc(
    4,
    1,
    lt(
      'ACC Sectors & Coffee Territories',
      'Секторы РДЦ и зоны влияния кофеварки',
      'Сектары РДЦ і зоны ўплыву кававаркі',
    ),
    lt(
      section(
        'Sectorisation',
        'Minsk Control (<b>UMMV_CTR</b>) covers the entire FIR, every regional grass strip, and emotional support for lost pilots whenever lower sectors are offline.',
      ),
      section(
        'Секторизация',
        'Minsk Control (<b>UMMV_CTR</b>) покрывает весь РПИ, каждую грунтовую полосу в стране и психологическую поддержку заблудившихся пилотов, когда нижние секторы спят.',
      ),
      section(
        'Сектарызацыя',
        'Minsk Control (<b>UMMV_CTR</b>) пакрывае ўвесь РПІ, кожную грунтовую паласу ў краіне і псіхалагічную падтрымку заблукалых пілотаў, калі ніжнія сектары спяць.',
      ),
    ),
  ),
  doc(
    5,
    1,
    lt(
      'Draft: Ground Movement (Do Not Hit the Terminal)',
      'Черновик: руление (не тараньте терминал)',
      'Чарнавік: руленне (не тараньце тэрмінал)',
    ),
    lt(
      '<p>Rule 1: Taxiing straight through the terminal building is NOT an approved shortcut. (Note to self: finish writing this draft before the audit.)</p>',
      '<p>Правило 1: срезать дорогу напрямик через здание терминала — НЕ одобренный маршрут руления. (Заметка себе: дописать черновик до проверки.)</p>',
      '<p>Правіла 1: зразаць дарогу наўпрост праз будынак тэрмінала — НЕ ўхвалены маршрут рулення. (Нататка сабе: дапісаць чарнавік да праверкі.)</p>',
    ),
    false,
  ),
  doc(
    6,
    2,
    lt(
      'Flight Performance & Suspiciously Fast Cessnas',
      'Лётные характеристики и подозрительно быстрые Цессны',
      'Лётныя характарыстыкі і падазрона хуткія Цэсны',
    ),
    lt(
      section(
        'Speed limits',
        'Below FL100 the maximum speed is <b>250 kt IAS</b> — yes, even if your soup is getting cold or you promised to be done “in five minutes” half an hour ago.',
      ),
      section(
        'Ограничения скорости',
        'Ниже FL100 — не более <b>250 kt IAS</b>. Да, даже если у вас остывает суп или вы обещали закончить «через пять минут» полчаса назад.',
      ),
      section(
        'Абмежаванні хуткасці',
        'Ніжэй FL100 — не больш за <b>250 kt IAS</b>. Так, нават калі ў вас стыне суп або вы абяцалі скончыць «праз пяць хвілін» паўгадзіны таму.',
      ),
    ),
  ),
  doc(
    7,
    3,
    lt(
      'Training Policy (No Bribes Accepted*)',
      'Политика обучения (взятки не берём*)',
      'Палітыка навучання (хабар не бярэм*)',
    ),
    lt(
      section(
        'Requests',
        'Training requests are submitted through the IVAO HQ website. Offering virtual jet fuel or homemade draniki does not skip the queue (*although draniki will improve the trainer’s mood by 40%).',
      ),
      section(
        'Заявки',
        'Заявки на обучение подаются через сайт IVAO HQ. Предложение виртуального керосина или домашних драников не ускоряет очередь (*но драники повышают настроение тренера на 40%).',
      ),
      section(
        'Заяўкі',
        'Заяўкі на навучанне падаюцца праз сайт IVAO HQ. Прапанова віртуальнай газы ці хатніх дранікаў не паскарае чаргу (*але дранікі падымаюць настрой трэнера на 40%).',
      ),
    ),
  ),
  doc(
    8,
    3,
    lt(
      'Exam Policy (Survival Guide)',
      'Политика экзаменов (руководство по выживанию)',
      'Палітыка экзаменаў (дапаможнік па выжыванні)',
    ),
    lt(
      section(
        'Practical exams',
        'A practical exam is scheduled as soon as your trainer stops instinctively reaching for the mute button every time you key the microphone.',
      ),
      section(
        'Практические экзамены',
        'Практический экзамен назначается сразу после того, как ваш тренер перестанет рефлекторно тянуться к кнопке «Mute» при каждом вашем выходе в эфир.',
      ),
      section(
        'Практычныя экзамены',
        'Практычны экзамен прызначаецца адразу пасля таго, як ваш трэнер перастане рэфлекторна цягнуцца да кнопкі «Mute» пры кожным вашым выхадзе ў эфір.',
      ),
    ),
  ),
];

const categoryNames: [number, DocumentsCategory['name']][] = [
  [
    0,
    lt(
      'General Sacred Scrolls',
      'Общие священные свитки',
      'Агульныя свяшчэнныя скруткі',
    ),
  ],
  [
    1,
    lt(
      'ATC Documentation (Read or Vector)',
      'Документация УВД (читай или вектори)',
      'Дакументацыя КПР (чытай ці вектары)',
    ),
  ],
  [
    2,
    lt(
      'Pilots Survival Manuals',
      'Пособия по выживанию пилотов',
      'Дапаможнікі па выжыванні пілотаў',
    ),
  ],
  [
    3,
    lt(
      'Training & Exam Lore',
      'Учебные и экзаменационные байки',
      'Вучэбныя і экзаменацыйныя байкі',
    ),
  ],
  // Пустая категория — как «SO Documentation» в реальных данных.
  [
    4,
    lt(
      'SO Documentation [REDACTED]',
      'Документация СО [ЗАСЕКРЕЧЕНО]',
      'Дакументацыя СА [ЗАСАКРЭЧАНА]',
    ),
  ],
];

export const documentCategories: DocumentsCategory[] = categoryNames.map(
  ([id, name]) => ({
    id,
    order: id,
    name,
    documents: documents.filter((d) => d.category === id),
  }),
);
