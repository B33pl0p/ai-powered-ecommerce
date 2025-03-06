import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AppwriteContext from '../appwrite/AppwriteContext';

const ProfileScreen = () => {
  const { appwrite, isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = useContext(AppwriteContext); // Use context values
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  // Fetch user data after context has loaded
  useEffect(() => {
    if (isLoggedIn && !userData) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const user = await appwrite.getCurrentUserDetails(); // Get user data from AppwriteService
          setUserData(user); // Store user data
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isLoggedIn, userData, appwrite, setIsLoading]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await appwrite.logout(); // Call logout method from AppwriteService
      setIsLoggedIn(false); // Update isLoggedIn state to false
      navigation.replace('Login'); // Navigate to login screen after logout
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userData.avatar_url || 'https://www.example.com/default-avatar.jpg' }} style={styles.profileImage} />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
