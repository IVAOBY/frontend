import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {GeneralLayout} from '../../../components/Layout';
import {IconChevronLeft} from "@tabler/icons-react";
import {useCallback} from "react";

export function NotFound() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const goBackHandler = useCallback(() => {
        navigate(-3)
    }, [navigate]);

    return (
        <div className="bg-semantic-red-500 w-screen h-screen">
            <GeneralLayout>
                <div className="flex hover:cursor-pointer mt-3 flex-row text-white font-bold" onClick={goBackHandler}>
                    <IconChevronLeft/>
                    <span className="font-['Montserrat']">Назад</span>
                </div>
                <div className="flex flex-col gap-20">
                    <div className="text-7xl mt-3 text-white font-bold md:text-6xl">
                        {t('errorpage.notfoundtext')}
                    </div>
                    <img
                        alt="404 Error"
                        className="w-7/12 -ml-2"
                        src={'https://files.by.ivao.aero/files/logos/error_404.svg'}
                    />
                </div>
            </GeneralLayout>
        </div>
    );
}
