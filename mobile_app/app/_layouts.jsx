import { Stack } from 'expo-router';
import ProductDetails from './ProductDetails';
import HomeScreen from './(tabs)';
import ItemCards from './ItemCards';
import ImagePickerModal from './ImagePickerModal';
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />      
      <Stack.Screen name="ImagePickerModal" component = {ImagePickerModal}/>
      <Stack.Screen name="ItemCards" component = {ItemCards} />

      
      
    </Stack>
  );
}
