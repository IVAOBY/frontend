import React, { lazy, Suspense, useContext, useMemo } from 'react';

import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Footer } from './components/Footer';
import { HeaderResponsive } from './components/header/header';
import { getAuthLoginUrl } from './constants/app';
import { AuthContext, AuthProvider } from './context/UserContext';
import i18n from './i18n/i18n';
import { ivaoTheme } from './ivaoTheme';
// import { MapPage } from './pages/MapPage';
import './App.css';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { AirportPage } from './components/AirportPage/AirportPage';
import { Centered } from './components/Layout';
import { Loader } from './components/Loader';
import ScrollToTop from './utils/ScrollToTop';

const MainPage = lazy(() =>
  import('./components/MainPage/MainPage').then((module) => ({
    default: module.MainPage,
  })),
);
const AirportsPage = lazy(() =>
  import('./components/AirportPage/AirportsPage').then((module) => ({
    default: module.AirportsPage,
  })),
);
const AboutUs = lazy(() =>
  import('./pages/AboutUs').then((module) => ({
    default: module.AboutUs,
  })),
);
const FAQ = lazy(() =>
  import('./pages/Faq').then((module) => ({
    default: module.FAQ,
  })),
);
const ScenaryPage = lazy(() =>
  import('./pages/Scenary').then((module) => ({
    default: module.ScenaryPage,
  })),
);
const FirstStepP = lazy(() =>
  import('./pages/FirstStepPilot').then((module) => ({
    default: module.FirstStepP,
  })),
);
const NewsPage = lazy(() =>
  import('./pages/News').then((module) => ({
    default: module.NewsPage,
  })),
);
const StaffPage = lazy(() =>
  import('./pages/Staff').then((module) => ({
    default: module.StaffPage,
  })),
);
const VehiclesPage = lazy(() =>
  import('./pages/vehicles/Vehicles').then((module) => ({
    default: module.VehiclesPage,
  })),
);
const Training = lazy(() =>
  import('./pages/training').then((module) => ({
    default: module.Training,
  })),
);
const DocumentsMain = lazy(() =>
  import('./pages/Documents').then((module) => ({
    default: module.DocumentsMain,
  })),
);
const DocumentView = lazy(() =>
  import('./pages/Documents/View').then((module) => ({
    default: module.DocumentView,
  })),
);
const DocumentsCategory = lazy(() =>
  import('./pages/Documents/Category').then((module) => ({
    default: module.DocumentsCategory,
  })),
);
const EventPage = lazy(() =>
  import('./pages/events').then((module) => ({
    default: module.EventPage,
  })),
);
const NotFound = lazy(() =>
  import('./pages/Error/404').then((module) => ({
    default: module.NotFound,
  })),
);
const GetInTouchSimple = lazy(() =>
  import('./pages/contact-us/ContactUs').then((module) => ({
    default: module.GetInTouchSimple,
  })),
);

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

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {},
        },
      }),
    [],
  );

  const persister = useMemo(
    () =>
      createSyncStoragePersister({
        storage: window.localStorage,
      }),
    [],
  );

  return (
    <MantineProvider theme={ivaoTheme}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
          >
            <AuthProvider>
              <AppShell
                padding={0}
                navbar={<HeaderResponsive />}
                footer={<Footer />}
              >
                <Notifications />
                <ScrollToTop />
                <Suspense
                  fallback={
                    <Centered>
                      <Loader />
                    </Centered>
                  }
                >
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
                  </Routes>
                </Suspense>
              </AppShell>
              {import.meta.env.VITE_ENV_TYPE === 'DEVELOPMENT' && (
                <ReactQueryDevtools />
              )}
            </AuthProvider>
          </PersistQueryClientProvider>
        </BrowserRouter>
      </I18nextProvider>
    </MantineProvider>
  );
}
