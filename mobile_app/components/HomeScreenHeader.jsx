import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";

const HomeScreenHeader = () => {
  const navigation = useNavigation(); // Access navigation object
  const route = useRoute(); // Get current route

  return (
    <View>
      {/* Header Container */}
      <View style={styles.header}>
      

        {/* Logo and App Name */}
        <TouchableOpacity onPress={() => navigation.navigate("(tabs)", { screen: "index" })} style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image style={styles.logo} source={require("../assets/images/logo_c.png")} />
          </View>
          <Text style={styles.appName}>Bazaar</Text>
        </TouchableOpacity>

        {/* Profile and Notifications */}
        <View style={styles.profileAndNotifications}>
          <FontAwesome6 name="message" size={24} style={styles.icon} />
          <FontAwesome6 name="bell" size={24} style={styles.icon} />
          <View style={styles.profileWrapper}>
            <Image style={styles.profileImage} source={require("../assets/images/profileicon.jpg")} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrapper: {
    backgroundColor: "#dfe4ea",
    padding: 5,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appName: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  profileAndNotifications: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
    color: "black",
  },
  profileWrapper: {
    backgroundColor: "#dfe4ea",
    padding: 5,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
