import {AppShell, MantineProvider} from '@mantine/core';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';
import {HeaderResponsive} from './components/header/header';
import {Footer} from './components/Footer';
import {MainPage} from './components/MainPage/MainPage';
import {StaffMain} from './components/StaffPage/StaffMain';
import {Airport} from './components/AirportPage/Airport';
import {NotFound} from './pages/Error404';
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
import {IconCircleX} from "@tabler/icons-react";
import {MessageOverlay} from "./components/MessageOverlay";
import {t} from "i18next";
import {DocumentsPilotPage} from "./pages/documents/DocumentsPilotPage";
import {DocumentsATCPage} from "./pages/documents/DocumentsATCPage";
import {EventPage} from "./pages/events/EventPage";
import {Legal} from "./pages/Legal";
import {SectorFile} from "./pages/SectorFile";
import {AuthContext, AuthProvider} from "./context/UserContext";
import {useContext} from "react";
import {ApiProvider} from "./context/ApiContext";
import {Vehicles} from "./pages/vehicles/Vehicles";
import './App.css';


export default function App() {

    const PrivateRoute: React.FC<{ path: string; element: React.ReactNode }> = ({
                                                                                    element,
                                                                                }) => {
        const {signed} = useContext(AuthContext);
        if (!signed) {
            notifications.show({
                id: 'auth-required',
                color: 'red',
                title: t('notif.auth.negative.name'),
                message: t('notif.auth.negative.description'),
                radius: 'lg',
                icon: <IconCircleX/>,
                withCloseButton: true,
                autoClose: 3000,
            });
            return <MessageOverlay message={t('notif.auth.negative.description')} link={"/"}
                                   linkTitle={"Вернуться на главную"}
                                   title={t('notif.auth.negative.name')}></MessageOverlay>;
        }
        return <>{element}</>;
    };

    return (
        <MantineProvider theme={ivaoTheme}>
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                    <AuthProvider>
                        <ApiProvider>
                            <AppShell padding={0} navbar={<HeaderResponsive/>} footer={<Footer/>}>
                                <Notifications/>
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
                                    <Route path="/legal" element={<Legal/>}/>
                                    <Route path="/staff" element={<StaffMain/>}/>
                                    <Route path="/vehicles" element={<Vehicles/>}/>

                                    {/* Документы */}
                                    <Route path="/documents" element={<DocumentsMain/>}/>
                                    <Route path="/documents/:id" element={<DocumentContentPage/>}/>
                                    <Route path="/documents/pilots" element={<DocumentsPilotPage/>}/>
                                    <Route path="/documents/atc" element={<DocumentsATCPage/>}/>

                                    {/* ATC */}
                                    <Route path="/sector" element={<SectorFile/>}/>
                                    <Route path="/atc/gca" element={<GCAPage/>}/>

                                    {/* ИВЕНТЫ */}
                                    <Route path="/event/:id" element={<EventPage/>}/>

                                    {/* NotFound */}
                                    <Route path="404" element={<NotFound/>}/>
                                    <Route path="*" element={<Navigate to="/404"/>}/>

                                    {/* Private route*/}
                                    <Route
                                        path="/contact-us/*"
                                        element={
                                            <PrivateRoute path="/contact-us" element={<GetInTouchSimple/>}/>
                                        }
                                    />
                                </Routes>
                            </AppShell>
                        </ApiProvider>
                    </ AuthProvider>
                </BrowserRouter>
            </I18nextProvider>
        </MantineProvider>
    );
}
