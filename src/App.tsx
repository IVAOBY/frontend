import {AppShell, MantineProvider} from '@mantine/core';
import {Route, BrowserRouter, Routes, Navigate} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';
import {HeaderResponsive} from './components/elements/header';
import {Footer} from './components/Footer';
import {MainPage} from './components/MainPage/MainPage';
import {StaffMain} from './components/StaffPage/StaffMain';
import {Airport} from './components/AirportPage/Airport';
import {Handler} from './components/Handler';
import NotFound from './pages/Error404';
import {ivaoTheme} from './ivaoTheme';
import {AboutUs} from './pages/AboutUs';
import {FAQ} from './pages/FAQ';
import {ScenaryPage} from './pages/Scenary';
import {GetInTouchSimple} from './pages/contact-us/ContactUs';
import {FirstStepP} from './pages/FirstStepPilot'; // Correct the import statement
import {NewsPage} from './pages/News';
import {DocumentsMain} from './pages/documents/DocumentsPage';
import {DocumentContentPage} from './pages/documents/DocumentContentPage';
import {MapPage} from './pages/MapPage';
import {GCAPage} from './pages/atc/GCAPage';
import {Notifications, notifications} from '@mantine/notifications';
import React from 'react';
import {IconCircleX} from "@tabler/icons-react";
import {MessageOverlay} from "./components/MessageOverlay";

export default function App() {
    const isAuthenticated = !!localStorage.getItem('authToken');

    const PrivateRoute: React.FC<{ path: string; element: React.ReactNode }> = ({
                                                                                    element,
                                                                                }) => {
        if (!isAuthenticated) {
            notifications.show({
                id: 'denied',
                loading: false,
                title: 'Authentication Required',
                message: 'Please log in to access this page.',
                icon: <IconCircleX/>,
                color: 'red',
                radius: 'lg',
                autoClose: false,
                withCloseButton: false,
            });
            return <MessageOverlay message={"Forrbiden"} link={"/"} linkTitle={"Вернуться на главную"}
                                   title={"Forrbiden"}></MessageOverlay>;
        }
        return <>{element}</>;
    };

    return (
        <MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS theme={ivaoTheme}>
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                    <AppShell padding={0} navbar={<HeaderResponsive/>} footer={<Footer/>}>
                        <Notifications/>
                        <Handler/>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/airport" element={<Airport/>}/>
                            <Route path="/about-us" element={<AboutUs/>}/>
                            <Route path="/faq" element={<FAQ/>}/>
                            <Route path="/scenery" element={<ScenaryPage/>}/>
                            <Route path="/scenery/:id" element={<ScenaryPage/>}/>
                            <Route path="/pilots/first-step" element={<FirstStepP/>}/>
                            <Route path="/news/:id" element={<NewsPage/>}/>
                            <Route path="/map" element={<MapPage/>}/>

                            <Route path="/staff" element={<StaffMain/>}/>

                            {/* Документы */}
                            <Route path="/documents" element={<DocumentsMain/>}/>
                            <Route path="/documents/:id" element={<DocumentContentPage/>}/>

                            {/* ATC */}
                            <Route path="/atc/gca" element={<GCAPage/>}/>

                            <Route path="404" element={<NotFound/>}/>

                            {/* Private route*/}
                            <Route
                                path="/contact-us/*"
                                element={
                                    <PrivateRoute path="/contact-us" element={<GetInTouchSimple/>}/>
                                }
                            />
                        </Routes>
                    </AppShell>
                </BrowserRouter>
            </I18nextProvider>
        </MantineProvider>
    );
}
