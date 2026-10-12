import { Stack } from 'expo-router';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import AnalyticsTracker from '../components/AnalyticsTracker';

export default function Layout() {
  return (
    <LanguageProvider>
      <UserProvider>
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <AnalyticsTracker />
        </>
      </UserProvider>
    </LanguageProvider>
  );
}
