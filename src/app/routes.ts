import { createElement } from "react"; 
import { createBrowserRouter } from "react-router-dom";
import GlobalLayout from "./layouts/GlobalLayout";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import AuthGuard from "./components/auth/AuthGuard";
import GuestGuard from "./components/auth/GuestGuard";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import ZakatSedekahPage from "./pages/FilantropiPage";
import AgendaPage from "./pages/AgendaPage";
import ReflectionPage from "./pages/ReflectionPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: createElement(GlobalLayout),
    children: [
      {
        path: "/",
        element: createElement(AuthGuard, null, createElement(RootLayout)),
        children: [
          { index: true, Component: DashboardPage },
          { path: "calendar", Component: CalendarPage },
          { path: "agenda", Component: AgendaPage },
          { path: "filantropi", Component: ZakatSedekahPage },
          { path: "reflection", Component: ReflectionPage },
          { path: "profile", Component: ProfilePage },
          { path: "settings", Component: SettingsPage },
        ],
      },
      {
        path: "/auth",
        element: createElement(GuestGuard, null, createElement(AuthLayout)),
        children: [
          { index: true, Component: LoginPage },
        ],
      },
      {
        path: "/auth/setup",
        element: createElement(AuthGuard, null, createElement(AuthLayout)),
        children: [
          { index: true, Component: ProfileSetupPage },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);