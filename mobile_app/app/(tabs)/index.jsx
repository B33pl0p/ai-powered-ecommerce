import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import FetchProducts from "../../components/FetchProducts";
import HomeScreenHeader from "../../components/HomeScreenHeader";
import CategoryGrid from "../../components/CategoryGrid";
import SearchBar from "../../components/SearchBar";
import { Chip } from "react-native-paper";

const HomeScreen = () => {
  return (
    <View>
      <HomeScreenHeader />
      <CategoryGrid />
      <SearchBar />
      <View style={styles.textContainer}>
        <Chip icon="heart" mode="outlined" elevated={true}>
          Explore our products
        </Chip>
      </View>
      <FetchProducts />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  textContainer: {
    padding: 5,
    marginLeft: 15,
    marginTop: 5,
    width: "50%",
  },
});
