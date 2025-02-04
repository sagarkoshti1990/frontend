import AppBar from "./shiksha-os/menu";
import { Center, NativeBaseProvider } from "native-base";
import Home from "./shiksha-os/home";
import Students from "./shiksha-os/modules/students/student";
import Classes from "./shiksha-os/modules/classes/classes";
import ClassDetails from "./shiksha-os/modules/classes/classDetails";
import Attendance from "./modules/attendance/attendance";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import init from "./shiksha-os/lang/init";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./shiksha-os/Login";
i18n.use(initReactI18next).init(init);

function NotFound() {
  const { t } = useTranslation();
  return (
    <SubApp title={t("404")}>
      <Center flex={1} px="3">
        <Center>
          <h1>404</h1>
        </Center>
      </Center>
    </SubApp>
  );
}

export default function App() {
  const { t } = useTranslation();
  const token = sessionStorage.getItem("token");
  if (!token) {
    return (
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <SubApp title={t("My School App")}>
                <Login />
              </SubApp>
            }
          />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SubApp title={t("My School App")}>
              <Home />
            </SubApp>
          }
        />
        <Route
          path="/classes"
          element={
            <SubApp title={t("My Classes")}>
              <Classes />
            </SubApp>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <SubApp title={t("My Classes")}>
              <ClassDetails />
            </SubApp>
          }
        />
        <Route
          path="/students"
          element={
            <SubApp title={t("My Students")}>
              <Students />
            </SubApp>
          }
        />
        <Route
          path="/attendance/:classId"
          element={
            <SubApp title={t("Attendance Sheet")}>
              <Attendance />
            </SubApp>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export function SubApp({ children, title }) {
  return (
    <NativeBaseProvider>
      <AppBar title={title} />
      {children}
    </NativeBaseProvider>
  );
}
