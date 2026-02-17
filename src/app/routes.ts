import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import ZakatPage from "./pages/ZakatPage";
import SedekahPage from "./pages/SedekahPage";
import JournalPage from "./pages/JournalPage";
import ChatbotPage from "./pages/ChatbotPage";
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
      { path: "zakat", Component: ZakatPage },
      { path: "sedekah", Component: SedekahPage },
      { path: "journal", Component: JournalPage },
      { path: "chatbot", Component: ChatbotPage },
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