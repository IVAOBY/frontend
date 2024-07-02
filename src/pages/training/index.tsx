import { IconChevronLeft } from '@tabler/icons-react';
import { GeneralLayout } from '../../components/Layout';
import {useTranslation} from "react-i18next";

export function Training() {
    const { t } = useTranslation();

    return (
        <GeneralLayout>
            <div className="flex flex-row text-gray-300">
                <IconChevronLeft/>
                <span className="font-['Montserrat']">На главную</span>
            </div>
            <div className="text-3xl font-bold text-black md:text-5xl">
                {t('navbar.community.training')}
            </div>
            <div className="flex gap-6 mt-6 flex-row columns-3">
                <div className="bg-atmos-700 rounded-3xl h-36 w-1/3">

                </div>
                <div className="bg-atmos-700 rounded-3xl h-36 w-1/3">

                </div>
                <div className="bg-white rounded-3xl h-36 w-1/3">

                </div>
            </div>
        </GeneralLayout>
    );
}
