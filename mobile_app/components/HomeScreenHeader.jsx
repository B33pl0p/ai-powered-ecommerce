import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";

const HomeScreenHeader = () => {
  const navigation = useNavigation(); // ✅ Hook to handle navigation

  return (
    <View>
      <View style={styles.header}>
        {/* ✅ Make Logo Clickable */}
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")} style={styles.logoandtext}>
          <View style={styles.imageIcon1}>
            <Image style={styles.topIconStyle} source={require("../assets/images/logo_c.png")} />
          </View>
          <Text style={styles.text}>Bazaar</Text>
        </TouchableOpacity>

        <View style={styles.profileandnotif}>
          <View style={styles.iconsContainer}>
            <FontAwesome6 style={styles.icons} name={"message"} size={24} />
            <FontAwesome6 style={styles.icons} name={"bell"} size={24} />
          </View>
          <View style={styles.imageIcon}>
            <Image style={styles.topIconStyle} source={require("../assets/images/profileicon.jpg")} />
          </View>
        </View>
      </View>

      <View style={styles.searchBar}></View>
      <View style={styles.category}></View>
    </View>
  );
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
    marginTop: 10,
  },
  topIconStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  imageIcon: {
    backgroundColor: "#dfe4ea",
    width: 55,
    height: 54,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  imageIcon1: {
    backgroundColor: "#dfe4ea",
    width: 55,
    height: 54,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logoandtext: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  profileandnotif: {
    flexDirection: "row",
    width: "40%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconsContainer: {
    height: 50,
    flexDirection: "row",
    paddingLeft: 5,
    width: 40,
    alignItems: "center",
  },
  icons: {
    marginLeft: 6,
    marginRight: 6,
  },
  text: {
    fontSize: 40,
    color: "black",
    marginLeft: 30,
    fontFamily: "cursive",
    fontWeight: "600",
  },
});
