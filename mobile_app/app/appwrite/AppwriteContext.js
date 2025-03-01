import { View, Text } from 'react-native';
import React, { createContext, useState, useEffect } from 'react';
import AppwriteService from './service';

// Create a context with default values
export const AppwriteContext = createContext({
  appwrite: new AppwriteService(),
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isLoading: true, // Add isLoading to the default context
  setIsLoading: () => {},
});

// The provider component for context
export const AppwriteProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true); // Start loading
      try {
        const user = await appwrite.getCurrentUser(); // Replace with your auth logic
        setIsLoggedIn(!!user); // Update isLoggedIn based on the user
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    checkAuth(); // Call the function to check authentication
  }, []);

  const defaultValue = {
    appwrite: new AppwriteService(),
    isLoggedIn,
    setIsLoggedIn,
    isLoading, // Include isLoading in the context value
    setIsLoading,
  };

  return (
    <AppwriteContext.Provider value={defaultValue}>
      {children}
    </AppwriteContext.Provider>
  );
};

export default AppwriteContext;