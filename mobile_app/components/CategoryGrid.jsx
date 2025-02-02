import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import categories from "./categories"; // ✅ Import category list

const CategoryGrid = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    onSelectCategory(categoryName); // ✅ Fetch filtered products
  };

  return (
    <View style={styles.categoryContainer}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategoryClick(item.name)}
            style={[
              styles.categoryButton,
              selectedCategory === item.name && styles.selectedCategory,
            ]}
          >
            {item.icon}
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.name && styles.selectedCategoryText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// ✅ Create a reusable StyleSheet object
const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: 3,
    marginBottom: 3,
    height: 80,
  },
  flatListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  categoryButton: {
    padding: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 50,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  selectedCategory: {
    backgroundColor: "#007bff",
  },
  categoryText: {
    color: "#000",
    fontWeight: "bold",
    marginLeft: 8,
  },
  selectedCategoryText: {
    color: "#fff",
  },
});

export default CategoryGrid;
