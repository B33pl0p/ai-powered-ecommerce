import { StyleSheet, View, ScrollView } from "react-native";
import React, { useState } from "react";
import FetchProducts from "../../components/FetchProducts";
import HomeScreenHeader from "../../components/HomeScreenHeader";
import CategoryGrid from "../../components/CategoryGrid";
import SearchBar from "../../components/SearchBar";
import { Chip } from "react-native-paper";

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ Function to update selected category
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <HomeScreenHeader />
      <CategoryGrid onSelectCategory={handleCategorySelect} />
      <SearchBar />

      <View style={styles.textContainer}>
        <Chip icon="heart" mode="outlined" elevated={true}>
          Explore our products
        </Chip>
      </View>

      {/* ✅ Pass selected category to FetchProducts */}
      <FetchProducts selectedCategory={selectedCategory} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textContainer: {
    padding: 5,
    marginLeft: 15,
    marginTop: 5,
    width: "50%",
  },
});