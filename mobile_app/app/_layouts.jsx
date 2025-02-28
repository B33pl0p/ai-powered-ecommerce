import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper'; // Import PaperProvider
import ItemCards from './ItemCards';
import ImagePickerModal from './ImagePickerModal';
import ImageCropScreen from './ImageCropScreen';

export default function RootLayout() {
  return (
    <PaperProvider> {/* Wrap the whole stack inside PaperProvider */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />      
        <Stack.Screen name="ItemCards" component={ItemCards} />
        <Stack.Screen name="ImagePickerModal" component={ImagePickerModal} />
        <Stack.Screen name="ImageCropScreen" component={ImageCropScreen} />
      </Stack>
    </PaperProvider>
  );
}
