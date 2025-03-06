import { StyleSheet, View, Alert } from "react-native";
import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import IP_ADDRESSES from "./Ipaddresses";

const SearchBar = ({ onOpenModal, onCloseModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  // ✅ Function to validate the input
  const isValidQuery = (query) => {
    // Prevent empty queries
    if (!query.trim()) {
      Alert.alert("Invalid Query", "Please enter a search query.");
      return false;
    }

    // ✅ Prevent special characters (except letters, numbers, and spaces)
    const specialCharRegex = /[^a-zA-Z0-9\s]/;
    if (specialCharRegex.test(query)) {
      Alert.alert("Invalid Query", "Special characters are not allowed.");
      return false;
    }

    // ✅ Ensure at least 3 letters (not just words)
    const letterCount = query.replace(/[^a-zA-Z]/g, "").length; // Count only letters
    if (letterCount < 3) {
      Alert.alert("Invalid Query", "Please enter at least 3 letters.");
      return false;
    }

    return true;
  };

  // ✅ Function to send the query to the API
  const searchText = async () => {
    if (!isValidQuery(searchQuery)) return; // Stop if query is invalid

    try {
      const response = await axios.post(
        `${IP_ADDRESSES.IP}/upload_text?similarity_threshold=0.8&top_k=10`,
        { query_text: searchQuery },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      navigation.navigate("(screens)/ItemCards", { products: data.result, searchQuery: searchQuery });
    } catch (error) {
      console.error("Error uploading text:", error);
      Alert.alert("Product not found with sufficient similarity.");
    }
  };

  return (
    <View>
      <Searchbar
        style={styles.searchBar}
        placeholder="Enter Text or Upload Image"
        onChangeText={setSearchQuery}
        value={searchQuery}
        traileringIcon="camera"
        onTraileringIconPress={() => navigation.navigate("(screens)/ImagePickerModal")}
        onSubmitEditing={searchText} // ✅ Trigger search when Enter is pressed
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    marginTop: 3,
  },
});
