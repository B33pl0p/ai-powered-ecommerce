import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppwriteProvider } from './appwrite/AppwriteContext';

export default function RootLayout() {
  return (
    <AppwriteProvider>
      <PaperProvider>
        <Stack>
          {/* Define main stack groups */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </AppwriteProvider>
  );
}
