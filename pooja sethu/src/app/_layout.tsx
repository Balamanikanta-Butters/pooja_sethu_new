import { Stack } from 'expo-router';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';

export default function Layout() {
  return (
    <LanguageProvider>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </UserProvider>
    </LanguageProvider>
  );
}
