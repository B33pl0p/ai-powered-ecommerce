import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import IP_ADDRESSES from "../../components/Ipaddresses";

const ImageCropScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const {
    detections = [],
    originalImageUri,
    detected_image_width,
    detected_image_height,
  } = route.params || {};

  const defaultBox =
    detections.length > 0
      ? 0
      : {
          bbox: [0, 0, detected_image_width, detected_image_height],
        };

  const [selectedBox, setSelectedBox] = useState(
    detections.length > 0 ? 0 : defaultBox
  );
  const [isUploading, setIsUploading] = useState(false);

  const screenWidth = Dimensions.get("window").width * 0.95;
  const screenHeight = Dimensions.get("window").height * 0.75;

  const aspectRatio = detected_image_width / detected_image_height;
  
  let scaledWidth = screenWidth;
  let scaledHeight = screenWidth / aspectRatio;
  
  if (scaledHeight > screenHeight) {
    scaledHeight = screenHeight;
    scaledWidth = screenHeight * aspectRatio;
  }

  const scaleX = scaledWidth / detected_image_width;
  const scaleY = scaledHeight / detected_image_height;

  const uploadCroppedImage = async (isFullImage = false) => {
    setIsUploading(true);
    
    try {
      let fileUri = originalImageUri.startsWith("file://")
        ? originalImageUri
        : `file://${originalImageUri}`;
  
      let croppedImageUri = fileUri;
  
      if (!isFullImage) {
        if (selectedBox === null) {
          Alert.alert("No Selection", "Please select an item to crop.");
          return;
        }
  
        const box =
          typeof selectedBox === "number"
            ? detections[selectedBox].bbox
            : selectedBox.bbox;
  
        const cropData = {
          originX: box[0],
          originY: box[1],
          width: box[2] - box[0],
          height: box[3] - box[1],
        };
  
        const croppedImage = await ImageManipulator.manipulateAsync(
          fileUri,
          [{ crop: cropData }],
          {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );
  
        croppedImageUri = croppedImage.uri;
      }
  
      const formData = new FormData();
      formData.append("image", {
        uri: croppedImageUri,
        name: "cropped_photo.jpg",
        type: "image/jpeg",
      });
  
      const apiUrl = `${IP_ADDRESSES.IP}/upload_image?similarity_threshold=0.8`;
  
      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.result) {
        navigation.navigate("(screens)/ItemCards", { products: response.data.result });
      } else {
        Alert.alert("No products found with sufficient similarity.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: originalImageUri }}
          style={{ width: scaledWidth, height: scaledHeight, resizeMode: "contain" }}
        />

        {detections.length > 0 ? (
          detections.map((detection, index) => {
            const box = detection.bbox;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.boundingBox,
                  {
                    left: box[0] * scaleX,
                    top: box[1] * scaleY,
                    width: (box[2] - box[0]) * scaleX,
                    height: (box[3] - box[1]) * scaleY,
                    borderColor: selectedBox === index ? "blue" : "white",
                  },
                ]}
                onPress={() => setSelectedBox(index)}
              />
            );
          })
        ) : (
          <TouchableOpacity
            style={[
              styles.boundingBox,
              { left: 0, top: 0, width: scaledWidth, height: scaledHeight, borderColor: "blue" },
            ]}
            onPress={() => setSelectedBox(defaultBox)}
          />
        )}
      </View>

      {isUploading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => uploadCroppedImage(false)}>
            <Text style={styles.buttonText}>Search Selected</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => uploadCroppedImage(true)}>
            <Text style={styles.buttonText}>Search Entire Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageCropScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#000",
  },
  imageWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  boundingBox: {
    position: "absolute",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    margin: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
