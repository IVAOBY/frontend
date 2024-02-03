import React, { useContext } from 'react';

import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Airport } from './components/AirportPage/Airport';
import { Index as Footer } from './components/Footer';
import { HeaderResponsive } from './components/header/header';
import { MainPage } from './components/MainPage/MainPage';
import { StaffMain } from './components/StaffPage/StaffMain';
import { ApiProvider } from './context/ApiContext';
import { AuthContext, AuthProvider } from './context/UserContext';
import i18n from './i18n/i18n';
import { ivaoTheme } from './ivaoTheme';
import { AboutUs } from './pages/AboutUs';
import { GCAPage } from './pages/atc/GCAPage';
import { GetInTouchSimple } from './pages/contact-us/ContactUs';
import { DocumentContentPage } from './pages/documents/DocumentContentPage';
import { DocumentsATCPage } from './pages/documents/DocumentsATCPage';
import { DocumentsMain } from './pages/documents/DocumentsPage';
import { DocumentsPilotPage } from './pages/documents/DocumentsPilotPage';
import { NotFound } from './pages/Error404';
import { EventPage } from './pages/events';
import { FAQ } from './pages/Faq';
import { FirstStepP } from './pages/FirstStepPilot';
import { MapPage } from './pages/MapPage';
import { NewsPage } from './pages/News';
import { ScenaryPage } from './pages/Scenary';
import { Vehicles } from './pages/vehicles/Vehicles';

import './App.css';

import { Centered } from './components/Layout';
import { Loader } from './components/Loader';
import { DiscordPage } from './pages/Discord';

export default function App() {
  const PrivateRoute: React.FC<{ path: string; element: React.ReactNode }> = ({
    element,
  }) => {
    const { signed } = useContext(AuthContext);
    if (!signed) {
      window.location.href = `https://api.ivao.systems/auth/login?goto=${encodeURIComponent(window.location.href)}`;

      return (
        <Centered>
          <Loader />
        </Centered>
      );
    }

    return <>{element}</>;
  };

  return (
    <MantineProvider theme={ivaoTheme}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AuthProvider>
            <ApiProvider>
              <AppShell
                padding={0}
                navbar={<HeaderResponsive />}
                footer={<Footer />}
              >
                <Notifications />
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/airport" element={<Airport />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/scenery" element={<ScenaryPage />} />
                  <Route path="/scenery/:id" element={<ScenaryPage />} />
                  <Route path="/pilots/first-step" element={<FirstStepP />} />
                  <Route path="/news/:id" element={<NewsPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/staff" element={<StaffMain />} />
                  <Route path="/vehicles" element={<Vehicles />} />

                  <Route
                    path="/discord/*"
                    element={
                      <PrivateRoute path="/discord" element={<DiscordPage />} />
                    }
                  />

                  {/* Документы */}
                  <Route path="/documents" element={<DocumentsMain />} />
                  <Route
                    path="/documents/:id"
                    element={<DocumentContentPage />}
                  />
                  <Route
                    path="/documents/pilots"
                    element={<DocumentsPilotPage />}
                  />
                  <Route path="/documents/atc" element={<DocumentsATCPage />} />

                  {/* ATC */}
                  <Route path="/atc/gca" element={<GCAPage />} />

                  {/* ИВЕНТЫ */}
                  <Route path="/event/:id" element={<EventPage />} />

                  {/* NotFound */}
                  <Route path="404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" />} />

                  {/* Private route*/}
                  <Route
                    path="/contact-us/*"
                    element={
                      <PrivateRoute
                        path="/contact-us"
                        element={<GetInTouchSimple />}
                      />
                    }
                  />
                </Routes>
              </AppShell>
            </ApiProvider>
          </AuthProvider>
        </BrowserRouter>
      </I18nextProvider>
    </MantineProvider>
  );
}
