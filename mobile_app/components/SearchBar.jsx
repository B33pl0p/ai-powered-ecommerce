import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import IP_ADDRESSES from "./Ipaddresses";
const SearchBar = ({ onOpenModal, onCloseModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  //function to send the query to the api
  const searchText = async () => {
    try {
      const response = await axios.post(
        `${IP_ADDRESSES.PC_LOCAL}:${IP_ADDRESSES.PORT_LOCAL}/upload_text`,
        { query_text: searchQuery },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      navigation.navigate("ItemCards", { products: data.result });
    } catch (error) {
      console.error("Error uploading text:", error);
      Alert.alert("Error", "Failed to upload text. Please try again.");
    }
  };
  return (
    <View>
      <Searchbar
        style={styles.searchBar}
        placeholder="Enter Text or Upload Image"
        onChangeText={setSearchQuery}
        value={searchQuery}
        traileringIcon="camera" // Correct prop name
        onTraileringIconPress={() => navigation.navigate("ImagePickerModal")}
        onSubmitEditing={searchText} // Trigger search on text submission
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
    marginTop : 10,
  },
});
