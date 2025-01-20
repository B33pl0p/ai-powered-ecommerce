import { CameraView, CameraType, useCameraPermissions, Camera } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image } from "react-native";
import { FontAwesome6, AntDesign, FontAwesome, EvilIcons, Entypo } from "@expo/vector-icons"; // Default import if it exists
import {  requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { launchImageLibrary } from "react-native-image-picker";
import React from "react";
import IP_ADDRESSES from "../components/Ipaddresses";
import axios from "axios";
import { ActivityIndicator } from "react-native";

const ImagePickerModal = () => {
  // State variables
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const navigation = useNavigation();
  const [facing, setFacing] = useState("back"); // Camera facing direction
  const [permission, requestPermission] = useCameraPermissions(); // Camera permission
  const [photoUri, setPhotoUri] = useState(null); // Captured image URI
  const [showCaptureOptions, setShowCaptureOptions] = useState(false); // Flag for capture options screen
  // useRef for camera reference
  const cameraRef = useRef(null);

  //function to upload image to the server
  const uploadImage = async () => {
    setIsUploading(true); // Show loading indicator
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: photoUri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      const response = await axios.post(`${IP_ADDRESSES.PC_LOCAL}:${IP_ADDRESSES.PORT_LOCAL}/upload_image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      navigation.navigate("ItemCards", { products: data.result });
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "Failed to upload photo. Please try again.");
    }
    finally {
      setIsUploading(false); // Hide loading indicator
    }
  };

  // Request permissions on component mount
  useEffect(() => {
    requestPermission();
    requestMediaLibraryPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        Alert.alert("Permission Denied", "You need to allow media library access to select a photo.");
      }
    });
  }, []);

  // Handle permission status
  if (!permission) {
    return <View />; // Permissions loading
  }
  if (!permission.granted) {
    return Alert.alert("Camera permission not granted");
  }

  // Toggle camera facing direction
  const toggleCameraFacing = () => {
    setFacing(facing === "front" ? "back" : "front");
  };

  // Capture image and navigate to capture options screen
  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ ImageType: "jpg", quality: 1, base64: false });
      setPhotoUri(photo.uri);
      setShowCaptureOptions(true); // Show capture options screen
    }
  };
 
  const selectImage = async () => {
    try {
      const options = {
        mediaType: 'photo', // Only allow photos
        quality: 1, // Maximum quality
        includeBase64: false, // Do not include base64 encoding of the image
      };
      
      const result = await launchImageLibrary(
        {
          mediaType: 'photo', // Only allow photos
          quality: 1, // Maximum quality
          includeBase64: false, // Do not include base64 encoding of the image
        }
      );

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('Error picking image: ', result.errorMessage);
      } else {
        // Use the URI of the selected image
        const selectedImageUri = result.assets[0].uri;
        setPhotoUri(selectedImageUri);
        console.log('Image URI:', selectedImageUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };


  // Handle "Use Photo" button
  const usePhoto = () => {
    setShowCaptureOptions(false); // Close capture options screen
    uploadImage();
  };

  // Render capture options screen (fullscreen with captured image)
  const renderCaptureOptions = () => (
    <View style={styles.captureOptionsContainer}>
      <Image source={{ uri: photoUri }} style={styles.capturedImage} />
      <View style={styles.options}>
        <TouchableOpacity>
          <Entypo name="cross" size={54} color={"white"} onPress={() => setShowCaptureOptions(false)}></Entypo>
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="check" size={54} color="white" onPress={usePhoto} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#ff00aa" />
      <Text style={styles.loadingText}>Uploading...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isUploading ? (
        // Show loading indicator when uploading
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      ) : showCaptureOptions ? (
        // Show capture options if photo is selected or captured
        renderCaptureOptions()
      ) : (
        // Show camera if not uploading and no photo is selected
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <Text style={styles.text}> Capture an image or select from gallery </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={selectImage}>
              <FontAwesome name="photo" size={30} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={captureImage}>
              <FontAwesome name="dot-circle-o" color="white" size={65} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <FontAwesome6 name="arrows-rotate" color={"white"} size={30} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: 200,
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  text: {
    color: "white",
    fontSize: 15,
    marginBottom: -15,
    top: 10,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: 200,
    height: 200,
  },
  captureOptionsContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  capturedImage: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "60%",
    alignItems: "center",
  },
});

export default ImagePickerModal;
