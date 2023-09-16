import {Container, MantineProvider} from '@mantine/core';
import {
    Route,
    BrowserRouter,
    Routes,
    Navigate,
    Outlet,
} from "react-router-dom";
import {I18nextProvider, useTranslation} from "react-i18next";
import i18n from "./i18n/i18n";
import {HeaderResponsive} from "./components/header";
import {Footer} from "./components/Footer";
import {MainPage} from "./components/MainPage/MainPage";
import { Handler, useAuth } from "./components/Handler";
import UserProfile from "./pages/ProfilePage";
import BookingMain from "./components/Booking/Main";
import Arrival from "./components/Booking/Arrival";
import Departure from "./components/Booking/Departure";
import ErrorPage from "./pages/Error404";
import Briefing from "./pages/BriefingPage";

const linksData=[
        { link: "/", label: "homeButton" },
{ link: "/briefing", label: "briefingButton" },
{ link: "/booking", label: "bookingButton" },
]

function PrivateOutlet() {
    const auth = useAuth();
    return auth ? <Outlet /> : <Navigate to="/" />;
}

export default function App() {
  return (
      <MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS theme={{
          colorScheme: 'light',
          fontFamily: 'Montserrat, sans-serif',
          colors: {
              brand: ['#0D2C99', '#3C55AC', '#D7D7DC', '#2EC662', '#F9CC2C', '#E93434', '#7EA2D6'],
          },

          shadows: {
              md: '1px 1px 3px rgba(0, 0, 0, .25)',
              xl: '5px 5px 3px rgba(0, 0, 0, .25)',
          },

          globalStyles: (theme) => ({
              '*, *::before, *::after': {
                  boxSizing: 'border-box',
              },

              body: {
                  backgroundColor: '#f8f8f8',
                  color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                  lineHeight: theme.lineHeight,
              },

          }),

          headings: {
              fontFamily: 'Montserrat, sans-serif',
              sizes: {
                  h1: { fontSize: '2rem' },
              },
          },
      }}>
          <I18nextProvider i18n={i18n}>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <BrowserRouter>
                      <HeaderResponsive links={linksData} />
                      <Handler />
                      <Container pt={200}>
                          <Routes>
                              <Route path="/" element={<MainPage />} />
                              <Route path="/booking" element={<BookingMain />} />
                              <Route path="/booking/arrivals" element={<Arrival />} />
                              <Route path="/booking/departures" element={<Departure />} />
                              <Route path="/briefing" element={<Briefing />} />
                              <Route path="/profile" element={<PrivateOutlet />}>
                                  <Route path="" element={<UserProfile />} />
                              </Route>
                              <Route path="/404" element={<ErrorPage />} />
                              <Route path="*" element={<Navigate to="/404" />} />
                          </Routes>
                      </Container>
                      <Footer />
                  </BrowserRouter>
              </div>
          </I18nextProvider>
      </MantineProvider>
  );
}