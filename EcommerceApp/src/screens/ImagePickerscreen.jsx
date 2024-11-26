import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, PermissionsAndroid, Platform } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios'; // For sending the image to the server
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';  // Icons for the buttons

const ImagePickerscreen = () => {
  const [imageUri, setImageUri] = useState(null);  // To store the selected image's URI
  const navigation = useNavigation();

  // Request necessary permissions for Android 13+
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        if (
          granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // No need for permissions on iOS
    }
  };

  // Open the gallery and allow the user to select an image
  const selectImage = async () => {
    const hasPermissions = await requestPermissions();
    if (hasPermissions) {
      ImagePicker.openPicker({
        cropping: false,
      })
        .then(image => {
          setImageUri(image.path);  // Set the selected image URI to display it on the screen
          uploadImage(image);       // Upload the image to the Flask server
        })
        .catch(error => {
          Alert.alert('Error selecting image', error.message);
        });
    } else {
      Alert.alert('Permission denied', 'Please grant media and camera permissions.');
    }
  };

  // Open the camera and allow the user to take a picture
  const openCamera = async () => {
    const hasPermissions = await requestPermissions();
    if (hasPermissions) {
      ImagePicker.openCamera({
        cropping: false,
      })
        .then(image => {
          setImageUri(image.path);  // Set the captured image URI to display it on the screen
          uploadImage(image);       // Upload the image to the Flask server
        })
        .catch(error => {
          Alert.alert('Error capturing image', error.message);
        });
    } else {
      Alert.alert('Permission denied', 'Please grant camera permissions.');
    }
  };

  // Function to upload the image to the Flask server
  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.path,        
      type: image.mime,       
      name: 'uploaded_image.jpg', 
    });

    try {
      const response = await axios.post('http://192.168.107.216:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Image uploaded successfully!');
      navigation.navigate('ResultsScreen', { results: response.data });
    } catch (error) {
      Alert.alert('Error uploading image', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload or Capture an Image</Text>

      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <FontAwesome name="image" size={24} color="white" />
        <Text style={styles.buttonText}>Select from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <FontAwesome name="camera" size={24} color="white" />
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>

     
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.imagePreview}
        />
      )}
    </View>
  );
};

export default ImagePickerscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    resizeMode : 'contain'
  },
});