import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { useRouter } from "expo-router";
import AppwriteService from "../appwrite/service"; // Your appwrite service
const appwrite = new AppwriteService();

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Check if there's an active session before logging out
      const session = await appwrite.getSession();
      if (session) {
        await appwrite.logout();
        console.log("Existing session cleared.");
      }
    } catch (error) {
      console.log("No active session or error clearing session:", error.message);
    }

    try {
      // Create new account
      const newSession = await appwrite.createAccount({ email, password, name });
      if (newSession) {
        router.replace("/(tabs)"); // Navigate to main app
      } else {
        setErrorMessage("Error occurred while signing up.");
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
        <Text style={styles.title}>Sign Up</Text>

        {/* Name Input */}
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

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

        {/* Signup Button */}
        <Button
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          style={styles.button}
        >
          Sign Up
        </Button>

        {/* Login Redirect */}
        <View style={styles.loginContainer}>
          <Text>Already have an account? </Text>
          <Button mode="text" onPress={() => router.replace("/(auth)/LoginScreen")}>
            Login
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    alignItems: "center",
  },
});

export default SignupScreen;
