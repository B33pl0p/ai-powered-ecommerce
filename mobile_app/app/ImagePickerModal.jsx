import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
}from "react-native";
import { FontAwesome6, AntDesign, FontAwesome, EvilIcons, Entypo } from "@expo/vector-icons"; // Default import if it exists
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import React from "react";
import IP_ADDRESSES from "../components/Ipaddresses";
import axios from "axios";



const ImagePickerModal = () => {
  
  
  
  
  // State variables
  const navigation = useNavigation();
  const [facing, setFacing] = useState("back"); // Camera facing direction
  const [permission, requestPermission] = useCameraPermissions(); // Camera permission
  const [photoUri, setPhotoUri] = useState(null); // Captured image URI
  const [showCaptureOptions, setShowCaptureOptions] = useState(false); // Flag for capture options screen
  // useRef for camera reference
  const cameraRef = useRef(null);

  //function to upload image to the server
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post(
        `${IP_ADDRESSES.PC_LOCAL}:${IP_ADDRESSES.PORT_LOCAL}/upload_image`,
         formData,
         {
         headers : {
          'Content-Type': 'multipart/form-data',
         }
        }
      );

      const data = response.data;
      navigation.navigate('ItemCards', {products : data.result})

    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    }
      
  }


  // Request permissions on component mount
  useEffect(() => {
    requestPermission();
    requestMediaLibraryPermissionsAsync();
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
      const photo = await cameraRef.current.takePictureAsync( {ImageType : 'jpg',
        quality : 1,
        base64 : false,
      });
      setPhotoUri(photo.uri);
      setShowCaptureOptions(true); // Show capture options screen
    }
  };
  const selectImage = async () => {
    try {
      // Launch the image library asynchronously
      const galleryPhoto = await launchImageLibraryAsync({
        quality: 1,
        base64: false, // base64 should be a boolean, not a string
        mediaTypes: 'Images', // Ensure we're only getting images
      });
  
      // Log the full response to inspect the structure
      console.log("Full galleryPhoto response:", galleryPhoto);
  
      // Check if the user canceled the selection
      if (galleryPhoto.cancelled) {
        Alert.alert("No photo selected", "You canceled the photo selection.");
        return; // Exit if no image was selected
      }
  
      // Decode URI if it's URL-encoded
      if (galleryPhoto.uri) {
        const decodedUri = decodeURIComponent(galleryPhoto.uri);
        console.log("Decoded Photo URI:", decodedUri); // Log the decoded URI
  
        // Validate the decoded URI
        if (decodedUri.startsWith('file://')) {
          setPhotoUri(decodedUri); // Set the decoded URI for the selected image
          setShowCaptureOptions(true); // Show the capture options
        } else {
          // Handle the case where the URI is invalid
          Alert.alert("Error", "The selected photo is invalid. Please try again.");
          console.error("Invalid photo URI:", decodedUri);
        }
      } else {
        // Handle the case where the URI is missing
        Alert.alert("Error", "No photo URI was returned. Please try again.");
      }
    } catch (error) {
      console.error("Error selecting image:", error); // Log the error to the console
      Alert.alert("Error", "An error occurred while selecting the photo. Please try again.");
    }
  };
  
  
  

  // Handle "Use Photo" button press (replace with your logic)
  const usePhoto = () => {
    // Implement your logic to use the captured photo (e.g., upload to server, save locally)
    setShowCaptureOptions(false); // Close capture options screen
    uploadImage()
  };

  // Render capture options screen (fullscreen with captured image)
  const renderCaptureOptions = () => (
    <View style={styles.captureOptionsContainer}>
      <Image source={{ uri: photoUri }} style={styles.capturedImage} />
      <View style={styles.options}>
      <TouchableOpacity>
        <Entypo name = 'cross' size={54} color={'white'} onPress={() => setShowCaptureOptions(false)}></Entypo>
        </TouchableOpacity>
        <TouchableOpacity>
        <AntDesign name="check" size={54} color="white" onPress={usePhoto} />
        </TouchableOpacity>

      </View>
    </View>
  );

  // Main camera view
  return (
    <View style={styles.container}>
      {showCaptureOptions ? (
        renderCaptureOptions()
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <Text style={styles.text}> Capture an image or select from gallery </Text>
          <View style={styles.buttonContainer}>
            {/* Gallery Button (Left) */}
            <TouchableOpacity onPress={selectImage}>
              <FontAwesome name="photo" size={30} color={"white"} />
            </TouchableOpacity>

            {/* Capture Button (Middle) */}
            <TouchableOpacity onPress={captureImage}>
              <FontAwesome name="dot-circle-o" color="white" size={65} />
            </TouchableOpacity>

            {/* Flip Camera Button (Right) */}
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

  text: {
    color: "white",
    fontSize: 15,
    marginBottom: -15,
    top: 10,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: 200,
    height: 200,
  },
  captureOptionsContainer: {
    flex: 1,
    backgroundColor: 'black', 
    justifyContent: 'center', 
    alignItems: 'center', 
   
  },
  capturedImage: {
    width: '85%', 
    height: '85%', 
    resizeMode: 'contain', 
  },
  options: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20,
    width : '60%' ,
    alignItems: 'center'
  },
});

export default ImagePickerModal;
