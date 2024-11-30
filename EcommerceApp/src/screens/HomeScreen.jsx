import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ResultsScreen from './ResultsScreen';
import IP_ADDRESSES from '../components/IPaddresses';

export default function HomeScreen({ navigation }) {
  const [inputText, setInputText] = useState('');  // Store the input text

  // Handle text input change
  const handleTextChange = (text) => {
    setInputText(text);  // Update the state when text changes
  };

  // Send the input text to the server
  const sendToServer = async () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter some text to search.');
      return;
    }

    try {
      const response = await fetch(`${IP_ADDRESSES.PC_LOCAL}:5000/upload_text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',  // Ensure we're sending plain text
        },
        body: inputText,  // Send plain text as the body of the request
        
      });
 
      // Check if the response is successful
      const responseText = await response.text();  // Get raw response text

      if (response.ok) {
        // If the server returns valid data, navigate to the Results screen
        const data = JSON.parse(responseText);  // Parse the response JSON
        console.log("Server Response:", data);
        navigation.navigate('ResultsScreen', { results: data });  // Pass the results to the next screen
      } else {
        Alert.alert('Error', 'Failed to send data.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      Alert.alert('Error', 'An error occurred while sending data.');
    }
  };

  return (
    <LinearGradient colors={["#cfcfe0", "#dddfdf", "#dddfdf"]} style={styles.LinearGradient}>
      <View>
        <Text style={styles.matchText}>Search Your Style</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ImagePickerscreen')}>
            <AntDesign name={'camerao'} color={"black"} size={24} style={styles.iconStyle}></AntDesign>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder={'Enter text or upload image'}
            placeholderTextColor={"#C0C0C0"}
            value={inputText}
            onChangeText={handleTextChange}
          />
          <AntDesign onPress={sendToServer} name={'search1'} color={"black"} size={24} style={styles.iconStyle}></AntDesign>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  LinearGradient: {
    flex: 1,
  },
  matchText: {
    fontSize: 28,
    color: '#000001',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 35,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: -5,
    borderRadius: 20,
  },
  textInput: {
    marginLeft: 10,
    color: "black",
    fontSize: 15,
  },
  iconStyle: {
    paddingLeft: 10,
    marginRight: 5,
  },
});
