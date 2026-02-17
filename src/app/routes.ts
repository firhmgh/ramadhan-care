import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
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
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "calendar", Component: CalendarPage },
      { path: "agenda", Component: AgendaPage },
      { path: "filantropi", Component: ZakatSedekahPage  },
      { path: "reflection", Component: ReflectionPage },
      { path: "profile", Component: ProfilePage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { index: true, Component: LoginPage },
      { path: "setup", Component: ProfileSetupPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);