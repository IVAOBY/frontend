import React, {useContext, useEffect} from 'react';

import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AirportsPage } from './components/AirportPage/AirportsPage';
import { Footer } from './components/Footer';
import { HeaderResponsive } from './components/header/header';
import { MainPage } from './components/MainPage/MainPage';
import { ApiProvider } from './context/ApiContext';
import { AuthContext, AuthProvider } from './context/UserContext';
import i18n from './i18n/i18n';
import { ivaoTheme } from './ivaoTheme';
import { AboutUs } from './pages/AboutUs';
import { GetInTouchSimple } from './pages/contact-us/ContactUs';
import { DocumentsMain } from './pages/Documents';
import { DocumentsCategory } from './pages/Documents/Category';
import { DocumentView } from './pages/Documents/View';
import { NotFound } from './pages/Error/404';
import { EventPage } from './pages/events';
import { FAQ } from './pages/Faq';
import { FirstStepP } from './pages/FirstStepPilot';
// import { MapPage } from './pages/MapPage';
import { NewsPage } from './pages/News';
import { ScenaryPage } from './pages/Scenary';
import { StaffPage } from './pages/Staff';
import { Vehicles } from './pages/vehicles/Vehicles';

import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AirportPage } from './components/AirportPage/AirportPage';
import { Centered } from './components/Layout';
import { Loader } from './components/Loader';
import { Training } from './pages/training';
import {setAuthToken} from "./utils/Http";

export default function App() {
  const PrivateRoute: React.FC<{ path: string; element: React.ReactNode }> = ({
    element,
  }) => {
    const { signed } = useContext(AuthContext);
    if (!signed) {
      window.location.href = `https://api.by.ivao.aero/auth/login?goto=${encodeURIComponent(window.location.href)}`;

      return (
        <Centered>
          <Loader />
        </Centered>
      );
    }

    return <>{element}</>;
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  return (
    <MantineProvider theme={ivaoTheme}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
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
                    <Route path="/airports" element={<AirportsPage />} />
                    <Route path="/airport/:icao" element={<AirportPage />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/scenery" element={<ScenaryPage />} />
                    <Route path="/scenery/:id" element={<ScenaryPage />} />
                    <Route path="/pilots/first-step" element={<FirstStepP />} />
                    <Route path="/news/:id" element={<NewsPage />} />
                    {/*<Route path="/map" element={<MapPage />} />*/}
                    <Route path="/staff" element={<StaffPage />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/training" element={<Training />} />

                    {/* Документы */}
                    <Route path="/documents" element={<DocumentsMain />} />
                    <Route path="/documents/:id" element={<DocumentView />} />
                    <Route
                      path="/documents/category/:id"
                      element={<DocumentsCategory />}
                    />

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
            {import.meta.env.VITE_ENV_TYPE === "DEVELOPMENT" && <ReactQueryDevtools />}
          </QueryClientProvider>
        </BrowserRouter>
      </I18nextProvider>
    </MantineProvider>
  );
}
