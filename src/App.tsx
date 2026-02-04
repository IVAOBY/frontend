import React, { useContext } from 'react';

import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AirportsPage } from './components/AirportPage/AirportsPage';
import { Footer } from './components/Footer';
import { HeaderResponsive } from './components/header/header';
import { MainPage } from './components/MainPage/MainPage';
import { getAuthLoginUrl } from './constants/app';
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
import { VehiclesPage } from './pages/vehicles/Vehicles';
import { NewsPage } from './pages/News';
import { StaffPage } from './pages/Staff';

import './App.css';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { AirportPage } from './components/AirportPage/AirportPage';
import { Centered } from './components/Layout';
import { Loader } from './components/Loader';
import { Training } from './pages/training';
import ScrollToTop from './utils/ScrollToTop';

export default function App() {
  const CONTACT_US_ENABLED = 0;
  const PrivateRoute: React.FC<{ path: string; element: React.ReactNode }> = ({
                                                                                element,
                                                                              }) => {
    const { signed } = useContext(AuthContext);
    if (!signed) {
      window.location.href = getAuthLoginUrl();

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
      queries: {},
    },
  });

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <MantineProvider theme={ivaoTheme}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AuthProvider>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{ persister }}
            >
              <AppShell
                padding={0}
                navbar={<HeaderResponsive />}
                footer={<Footer />}
              >
                <Notifications />
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/airports" element={<AirportsPage />} />
                  <Route path="/airport/:icao" element={<AirportPage />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/pilots/first-step" element={<FirstStepP />} />
                  <Route path="/news/:id" element={<NewsPage />} />
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/vehicles" element={<VehiclesPage />} />
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
                  {CONTACT_US_ENABLED && (
                    <Route
                      path="/contact-us/*"
                      element={
                        <PrivateRoute
                          path="/contact-us"
                          element={<GetInTouchSimple />}
                        />
                      }
                    />
                  )}
                  )
                </Routes>
              </AppShell>
              {import.meta.env.VITE_ENV_TYPE === 'DEVELOPMENT' && (
                <ReactQueryDevtools />
              )}
            </PersistQueryClientProvider>
          </AuthProvider>
        </BrowserRouter>
      </I18nextProvider>
    </MantineProvider>
  );
}
