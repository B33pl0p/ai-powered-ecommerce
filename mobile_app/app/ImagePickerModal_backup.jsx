import { CameraView, CameraType, useCameraPermissions, Camera } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image } from "react-native";
import { FontAwesome6, AntDesign, FontAwesome, EvilIcons, Entypo } from "@expo/vector-icons"; // Default import if it exists
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import React from "react";
import IP_ADDRESSES from "../components/Ipaddresses";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import HomeScreenHeader from "../components/HomeScreenHeader";
import * as FileSystem from 'expo-file-system';


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
  if (!photoUri) {
    Alert.alert("Error", "No photo selected.");
    return;
  }

  setIsUploading(true);

  try {
    // Ensure the file has the correct URI format
    const fileUri = photoUri.startsWith("file://") ? photoUri : `file://${photoUri}`;

    // Get file info to ensure it exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("image", {
      uri: fileUri,
      name: "photo.jpg",
      type: "image/jpeg", // Change type accordingly if needed
    });

   // console.log("Uploading image:", formData);

    // Send the file using Axios
    const response = await axios.post(`${IP_ADDRESSES.IP2}/upload_image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

   // console.log("Server Response:", response.data);

    if (response.data.result) {
      navigation.navigate("ItemCards", { products: response.data.result });
    } else {
      console.error("No products found.");
    }
  } catch (error) {
    console.error("Error uploading photo:", error);
    Alert.alert("Error", "Failed to upload photo. Please try again.");
  } finally {
    setIsUploading(false);
  }
};

  

  // Request permissions on component mount
  useEffect(() => {
    requestPermission();
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);

  // Handle permission status
  if (!permission) {
    return <View />; // Permissions loading
  }

  // Toggle camera facing direction
  const toggleCameraFacing = () => {
    setFacing(facing === "front" ? "back" : "front");
  };

  // Capture image and navigate to capture options screen
  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ ImageType: "jpeg", quality: 0.5, base64: false});
      setPhotoUri(photo.uri);
      setShowCaptureOptions(true); // Show capture options screen
    }
  };
 
     // Select image from gallery
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaType : 'images',
      allowsEditing: true,
      aspect: [20, 20],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setShowCaptureOptions(true); // Show capture options screen
    }
  };

  // Handle "Use Photo" button
  const usePhoto = () => {
    setShowCaptureOptions(false); // Close capture options screen
    uploadImage();
  };

  // Render capture options screen (fullscreen with captured image)
  const renderCaptureOptions = () => (
    <View style = {styles.container}>
      <HomeScreenHeader></HomeScreenHeader>
      <Text style={styles.conftext}>Continue With Image or Cancel.</Text>
      <View style={styles.captureOptionsContainer}>
        <Image source={{ uri: photoUri }} style={styles.capturedImage} />
        <View style={styles.options}>
          <TouchableOpacity>
            <Entypo name="cross" size={34} color={"#2F363F"} onPress={() => setShowCaptureOptions(false)}></Entypo>
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="check" size={34} color="#2F363F" onPress={usePhoto} />
          </TouchableOpacity>
        </View>
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
    marginBottom : 25,
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
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",

  },
  capturedImage: {
    width: "95%",
    height: "85%",
    borderRadius : 25,

  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    alignItems: "center",
    marginTop : 20,
  },
  conftext : {
    marginLeft : 20,
    marginBottom : -2,
    fontSize : 20,

  }
});

export default ImagePickerModal;
