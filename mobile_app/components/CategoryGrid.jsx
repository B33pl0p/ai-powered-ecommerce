import { FontAwesome6, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const categories = [
  { id: "1", name: "Electronics", icon : "microchip", provider : 'FontAwesome6' },
  { id: "2", name: "Foods & Drinks", icon: "bowl-food", provider :'FontAwesome6' },
  { id: "3", name: "Beauty" , icon: "face-smile-beam", provider :'FontAwesome6' },
  { id: "4", name: "Furnitures" , icon: "table-furniture", provider :'MaterialCommunityIcons' },
  { id: "5", name: "Fashion" , icon: "shirt", provider :'FontAwesome6' },
  { id: "6", name: "Health" , icon: "medkit", provider :'FontAwesome' },
  { id: "7", name: "Stationery" , icon: "book-atlas", provider :'FontAwesome6' },
  { id: "7", name: "Vehicles" , icon: "car-side", provider :'FontAwesome6' },

];

const CategoryGrid = () => {


  const renderIcon = (provider, icon) => {
    switch (provider) {
      case "FontAwesome6":
        return <FontAwesome6 name={icon} size={25} color="#000" />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={icon} size={25} color="#000" />;
      case "FontAwesome":
        return <FontAwesome name={icon} size={25} color="#000" />;
      default:
        return null; // Fallback for unsupported providers
    }
  }

  return (
    <FlatList
      scrollEnabled = {false}
      data={categories}
      keyExtractor={(item) => item.id}
      numColumns={4} 
      contentContainerStyle={styles.gridContainer}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.categoryItem}>
          <View style={styles.iconContainer}>
            <View style={styles.circle} >{renderIcon(item.provider, item.icon)}
           </View>
          </View>
          <Text numberOfLines={1} style={styles.label}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    height : '220',

  },
  categoryItem: {
    flex: 1,
    alignItems: "center",
    
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0", // Placeholder color
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});

export default CategoryGrid;
