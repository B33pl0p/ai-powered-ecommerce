import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image } from "react-native";
import { FontAwesome6, AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import HomeScreenHeader from "../components/HomeScreenHeader";
import IP_ADDRESSES from "../components/Ipaddresses";

const ImagePickerModal = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [showCaptureOptions, setShowCaptureOptions] = useState(false);
  const [facing, setFacing] = useState("back");
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);

  useEffect(() => {
    if (photoUri) {
      const fileUri = photoUri.startsWith("file://") ? photoUri : `file://${photoUri}`;
      detectClothes(fileUri);
    }
  }, [photoUri]);

  const detectClothes = async (fileUri) => {
    // if (!photoUri) {
    //   Alert.alert("Error", "No photo selected.");
    //   return;
    // }

     setIsUploading(true);

  
 

      // Prepare form data without modifying the image
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      // Send image to backend
      const response = await axios.post(`${IP_ADDRESSES.IP_HF}/detect/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      setIsUploading(false);
      console.log(data)
      navigation.navigate("ImageCropScreen", {
        detectedImageUri: data.detected_image_uri, // Processed image with bounding boxes
        originalImageUri: fileUri, // The original image for cropping
        detections: data.detections,
        detected_image_width: data.detected_image_width, // ✅ Pass detected image width
        detected_image_height: data.detected_image_height, // ✅ Pass detected image height
    
      });
   
    
  
    
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7, 
        base64: false,
      });
      setPhotoUri(photo.uri);
      setShowCaptureOptions(false)
    }
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: "images",
      allowsEditing: false,
      quality: 0.7, // Ensuring no compression
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setShowCaptureOptions(false)
      detectClothes(photoUri)
    }
  };

  // Render confirmation screen
  const renderCaptureOptions = () => (
    <View style={styles.container}>
      <HomeScreenHeader />
      <Text style={styles.conftext}>Continue With This Image?</Text>
      <Image source={{ uri: photoUri }} style={styles.capturedImage} />
      <View style={styles.options}>
        <TouchableOpacity onPress={() => setShowCaptureOptions(false)}>
          <Entypo name="cross" size={34} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={detectClothes}>
          <AntDesign name="check" size={34} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <Text style={styles.text}>Capture or Select an Image</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={selectImage}>
            <FontAwesome name="photo" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={captureImage}>
            <FontAwesome name="dot-circle-o" size={65} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFacing(facing == "front" ? "back" : "front")}>
            <FontAwesome6 name="arrows-rotate" size={30} color="white" />
          </TouchableOpacity>
        </View>
  
        {/* Blurred overlay when uploading */}
        {isUploading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.infoText}>If there are clothes in the image, they will be detected.</Text>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Processing Image...</Text>
          </View>
        )}
      </CameraView>
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
    marginBottom: 25,
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
    height: "75%",
    borderRadius: 25,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    alignItems: "center",
    marginTop: 20,
  },
  conftext: {
    marginLeft: 20,
    marginBottom: -2,
    fontSize: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark transparent overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Ensures it's above the camera
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    width: "80%",
  },
});

export default ImagePickerModal;
