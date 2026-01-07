import { NativeRouter } from "react-router-native";
import Main from "./Main.jsx";
import { AuthProvider } from "./src/auth/context/AuthProvider.jsx";
import { RewardProvider } from "./src/context/RewardContext.jsx";
import RecompensasDataProvider from "./src/hooks/RecompensasDataProvider.jsx";
import DescuentosDataProvider from "./src/compradores/hooks/DescuentosDataProvider.jsx";
import { registerForPushNotificationsAsync, sendTokenToServer } from "./src/utils/notifications.js";
import { useEffect } from "react";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => sendTokenToServer(token))
      .catch((error) =>
        console.error("Error obteniendo el token de notificación: ", error)
      );
  }, []);

  return (
    <AuthProvider>
      <RewardProvider>
        <RecompensasDataProvider>
          <DescuentosDataProvider>
            <NativeRouter>
              <Main />
            </NativeRouter>
          </DescuentosDataProvider>
        </RecompensasDataProvider>
      </RewardProvider>
    </AuthProvider>
  );
}
