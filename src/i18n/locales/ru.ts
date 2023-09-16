import {Translations} from '../../types/Translition'

const ruTranslations: { translations: Translations } = {
    translations: {
        navbar: {
            division: {
                index: 'Дивизион',
                about: 'О нас',
                faq: 'FAQ',
                staff: 'Руководство дивизиона',
                discord: 'Дискорд',
                contact: 'Связь с нами',
                rules: 'Правила IVAO'
            },
            atc: {
                index: 'Диспетчеру',
                start: 'Первые шаги',
                fra: 'Ограничения (FRAs)',
                gca: 'GCA Программа',
                charts: 'Схемы аэропортов',
                docs: 'Документы'
            },
            pilots: {
                index: 'Пилоту',
                start: 'Первые шаги',
                scenarios: 'Сценарии',
                charts: 'Схемы аэропортов',
                airlines: 'Виртуальные авиакомпании',
                tours: 'Туры'
            },
            community: {
                index: 'Сообщество',
                events: 'Ивенты',
                forum: 'Форум BY',
                webeye: 'WebEye',
                ivao: 'Сайт IVAO',
                tracker: 'Трекер'
            }
        },
        footer: {
            copyrightMessage: '© 2023 International Virtual Aviation Organisation - IVAO Belarus. All Rights Reserved.',
            privacyPolicyName: 'Privacy Policy',
            termsOfUseName: 'Terms of Use',
        },
        errors: {
        }
    },
};

export default ruTranslations;