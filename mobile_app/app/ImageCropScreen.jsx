import React, { useState } from "react";
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
import IP_ADDRESSES from "../components/Ipaddresses";

const ImageCropScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { detections, originalImageUri, detected_image_width, detected_image_height } =
    route.params || {};

  const [selectedBox, setSelectedBox] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Get screen dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height * 0.7; // 70% of the screen height to prevent overflow

  // ✅ Calculate aspect ratio
  const aspectRatio = detected_image_width / detected_image_height;

  // ✅ Adjusted image width & height to fit within the screen
  let scaledWidth = screenWidth;
  let scaledHeight = screenWidth / aspectRatio;

  if (scaledHeight > screenHeight) {
    scaledHeight = screenHeight;
    scaledWidth = screenHeight * aspectRatio;
  }

  // ✅ Scaling factors for bounding boxes
  const scaleX = scaledWidth / detected_image_width;
  const scaleY = scaledHeight / detected_image_height;

  const uploadCroppedImage = async () => {
    if (selectedBox === null) {
      Alert.alert("No Selection", "Please select an item to crop.");
      return;
    }

    setIsUploading(true);

    try {
      const box = detections[selectedBox].bbox;

      // ✅ Correct cropping coordinates based on original image
      const cropData = {
        originX: box[0],
        originY: box[1],
        width: box[2] - box[0],
        height: box[3] - box[1],
      };

      // ✅ Ensure the image URI is correctly formatted (file://)
      const fileUri = originalImageUri.startsWith("file://")
        ? originalImageUri
        : `file://${originalImageUri}`;

      // Crop the image using expo-image-manipulator
      const croppedImage = await ImageManipulator.manipulateAsync(fileUri, [{ crop: cropData }], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      const formData = new FormData();
      formData.append("image", {
        uri: croppedImage.uri,
        name: "cropped_photo.jpg",
        type: "image/jpeg",
      });

      console.log("Sending FormData:", formData);

      // ✅ Verify the backend endpoint URL
      const apiUrl = `${IP_ADDRESSES.IP}/upload_image`;
      console.log("API URL:", apiUrl);

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API Response:", response.data);

      if (response.data.result) {
        navigation.navigate("ItemCards", { products: response.data.result });
      } else {
        Alert.alert("No products found.");
      }
    } catch (error) {
      console.error("Error uploading cropped image:", error);

      if (error.response) {
        console.error("Server Response:", error.response.data);
      }

      Alert.alert("Error", "Failed to upload the cropped image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        {/* ✅ Display Resized Image */}
        <Image
          source={{ uri: originalImageUri }}
          style={{
            width: scaledWidth,
            height: scaledHeight,
            resizeMode: "contain",
          }}
        />

        {/* ✅ Overlay Bounding Boxes with Correct Scaling */}
        {detections.map((detection, index) => {
          const box = detection.bbox;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.boundingBox,
                {
                  left: box[0] * scaleX,
                  top: box[1] * scaleY, // Correctly scales to fit
                  width: (box[2] - box[0]) * scaleX,
                  height: (box[3] - box[1]) * scaleY,
                  borderColor: selectedBox === index ? "blue" : "white",
                },
              ]}
              onPress={() => setSelectedBox(index)}
            />
          );
        })}
      </View>

      {isUploading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={uploadCroppedImage}>
          <Text style={styles.buttonText}>Search Selected Item</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageCropScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  boundingBox: {
    position: "absolute",
    borderWidth: 2,
    backgroundColor: "rgba(0, 0, 255, 0.2)",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
