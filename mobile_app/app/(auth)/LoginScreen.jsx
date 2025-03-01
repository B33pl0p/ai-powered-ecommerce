import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { useRouter } from "expo-router";
import AppwriteService from "../appwrite/service";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const appwrite = new AppwriteService();
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill out both fields.");
      return;
    }
    
    setLoading(true);

    //first logout from all sessions
    
    try {
        await appwrite.logout(); // Logout from Appwrite
      } catch (error) {
        console.log("Error logging out:", error.message); // Ignore error if user wasn't logged in
      }
    try {
      const session = await appwrite.login({ email, password });
      if (session) {
        router.replace("/(tabs)")
      } else {
        setErrorMessage("Invalid credentials.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        
        {/* Email Input */}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        {/* Password Input */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />

        {/* Error Message */}
        {errorMessage && <HelperText type="error">{errorMessage}</HelperText>}
        
        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        >
          Login
        </Button>

        {/* Signup Redirect */}
        <View style={styles.signupContainer}>
          <Text>Don't have an account? </Text>
          <Button mode="text" onPress={() => router.replace("/(auth)/SignupScreen")}>
            Sign Up
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});

export default LoginScreen;
