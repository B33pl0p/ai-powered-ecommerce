import { Stack } from 'expo-router';
import ItemCards from './ItemCards';
import ImagePickerModal from './ImagePickerModal';
import ImageCropScreen from './ImageCropScreen';
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />      
      <Stack.Screen name="ItemCards" component = {ItemCards} />
      <Stack.Screen name="ImagePickerModal" component = {ImagePickerModal}/>
      <Stack.Screen name="ImageCropScreen" component = {ImageCropScreen}/>


      
    </Stack>
  );
}
