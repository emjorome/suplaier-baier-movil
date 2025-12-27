import { NativeRouter } from 'react-router-native';
import Main from './Main.jsx'
import { AuthProvider } from './src/auth/context/AuthProvider.jsx';
import { RewardProvider } from './src/context/RewardContext.jsx';
import { registerForPushNotificationsAsync, sendTokenToServer } from './src/utils/notifications.js'; 
import { useEffect } from 'react';
import { LogBox } from "react-native"

LogBox.ignoreAllLogs(true)
export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        // Enviar token al servidor
        sendTokenToServer(token);
      })
      .catch(error => {
        console.error("Error obteniendo el token de notificación: ", error);
      });
  }, []);
  return ( 
  <AuthProvider>
    <RewardProvider>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </RewardProvider>
  </AuthProvider>
  );
}


