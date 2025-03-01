import React, { useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AppwriteContext from './appwrite/AppwriteContext';
export default function Index() {
  const { isLoggedIn } = useContext(AppwriteContext);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)'); // Navigate to the main app
      } else {
        router.replace('/(auth)/LoginScreen'); // Navigate to the login screen
      }
    }, 100); // Delay navigation slightly

    return () => clearTimeout(timer); // Cleanup in case component unmounts
  }, [isLoggedIn]); 

  return null; // No UI needed
}
