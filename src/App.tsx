import {AppShell, Container, MantineProvider} from '@mantine/core';
import {
    Route,
    BrowserRouter,
    Routes,
    Navigate,
    Outlet,
} from "react-router-dom";
import {I18nextProvider, useTranslation} from "react-i18next";
import i18n from "./i18n/i18n";
import {HeaderResponsive} from "./components/elements/header";
import {Footer} from "./components/Footer";
import {MainPage} from "./components/MainPage/MainPage";
import {StaffMain} from "./components/StaffPage/StaffMain";
import { Handler, useAuth } from "./components/Handler";
import ErrorPage from "./pages/Error404";
import {ivaoTheme} from "./ivaoTheme";
import AuthGuard from '../src/hooks/AuthGuard';
export default function App() {
    const isAuthenticated = !!localStorage.getItem('authToken');
  return (
      <MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS theme={ivaoTheme}>
          <I18nextProvider i18n={i18n}>
                  <BrowserRouter>
                      <AppShell
                          padding={0}
                          navbar={<HeaderResponsive />}
                          footer={<Footer />}
                      >
                          <Handler />
                          <Routes>
                              <Route path="/" element={<MainPage />} />
                              <Route path="/staff" element={<StaffMain />}></Route>
                              <Route path="/404" element={<ErrorPage />} />
                              <Route path="*" element={<Navigate to="/404" />} />
                          </Routes>
                      </AppShell>
                  </BrowserRouter>
          </I18nextProvider>
      </MantineProvider>
  );
}