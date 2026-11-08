import { BreadcrumbLayout } from '../components/Layout';

// TODO: вынести текст страницы в переводы (по ключам, а не целиком одним HTML-блоком)
const subtitleClass = 'mt-6 text-2xl font-bold text-atmos-700 first:mt-0';
const paragraphClass = 'mt-2 text-[15px] leading-6';

export function FirstStepP() {
  return (
    <BreadcrumbLayout>
      <div className="mt-[30px] flex flex-col gap-[50px]">
        <h4 className="text-3xl font-bold leading-8 text-black md:text-[55px]">
          Первые шаги пилота
        </h4>
        <div className="squircle-3xl shadow-figma bg-white px-[32px] py-[41px] text-[#494949]">
          <h2 className={subtitleClass}>Регистрация в IVAO</h2>
          <p className={paragraphClass}>
            В данном руководстве изложена пошаговая инструкция, которая поможет
            вам подключиться к IVAO в качестве виртуального пилота. Здесь
            представлен краткий обзор используемого программного обеспечения, а
            также некоторые основные инструкции о правилах поведения в
            виртуальном сообществе IVAO.
          </p>
          <p className={paragraphClass}>
            Первое что требуется сделать –{' '}
            <a
              href="https://ivao.aero/members/person/register.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-atmos-700 hover:underline"
            >
              зарегистрироваться на сайте IVAO
            </a>
          </p>
          <p className={paragraphClass}>
            Обращаем внимание, что у вас должна быть только одна учетная запись,
            которая будет действительна для участия в сети IVAO как в качестве
            пилота, так и в качестве авиадиспетчера.
          </p>
          <p className={paragraphClass}>
            Более подробно остановимся на следующих аспектах:
          </p>
          <ul className="mt-2 list-disc pl-8 text-sm leading-6">
            <li>
              загрузка, установка и настройка требуемого программного
              обеспечения
            </li>
            <li>подключение к виртуальной сети IVAO</li>
            <li>подача полетного плана (основы)</li>
            <li>
              взаимодействие с виртуальным авиадиспетчером (ATC), а также работа
              при отсутствии виртуального авиадиспетчера
            </li>
            <li>получение дополнительной информации и тренинг</li>
          </ul>

          <h2 className={subtitleClass}>Загрузка программы клиента Altitude</h2>
          <div className="mt-2 grid gap-5 md:grid-cols-2">
            <div>
              <p className={paragraphClass}>
                Первое, что вам необходимо сделать, это загрузить клиент
                виртуального пилота программу ALTITUDE, с помощью которой вы
                сможете подключаться к сети. Данный клиент может быть загружен
                со страницы Pilot Client: Altitude.
              </p>
              <p className={paragraphClass}>
                После загрузки клиента вам необходимо запустить исполняемый файл
                и установить программу.
              </p>
            </div>
            <img
              src="https://media.discordapp.net/attachments/757343581408329729/1158130098713665706/image.png?ex=651b2034&is=6519ceb4&hm=3a5b2bcdcd6f216287ef0b8459a7f03b28592dd765e5565d7a3339a97cb94b10&="
              alt="Изображение"
              className="md:ml-auto md:max-w-[50%]"
            />
          </div>

          <h2 className={subtitleClass}>MTL (Multiplayer Traffic Library)</h2>
          <p className={paragraphClass}>
            MTL (Multiplayer Traffic Library) позволяет видеть находящиеся радом
            с вами воздушные суда путем установки сотен моделей и их ливрей в
            ваш симулятор полетов.
          </p>
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
