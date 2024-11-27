import { StyleSheet, Text, TextInput, TouchableOpacity, View,Button } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import HeaderText from '../components/HeaderText';
import CategoryScrollable from '../components/CategoryScrollable';
import ItemCards from '../components/ItemCards';

//{navigation} is added to add the navigation property into homescreen

export default function HomeScreen( {navigation} ) {
  //state to keep the input text
  const [InputText , setInputText] = useState('')

  const handleTextChange = (text) => {
    setInputText(text);
  };

  const sendToServer = async () => {
    if(InputText.trim === ('')) {
      Alert.alert('Please enter some text to search')
    }
  }
  try {
    const response = await fetch('http://192.168.107.216:4500/textquery', {
      method: 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({ userInput: InputText }), // Sending the input text to the server
  });
  const data = await response.json();

  if (response.ok) {
    Alert.alert('Success', 'Data sent successfully!');
    console.log('Server Response:', data);
  } else {
    Alert.alert('Error', 'Failed to send data.');
  }
} catch (error) {
  console.error('Error sending data:', error);
  Alert.alert('Error', 'An error occurred while sending data.');
}

  return (
  <LinearGradient colors = {["#cfcfe0", "#dddfdf", "#dddfdf"]} style = {styles.LinearGradient}> 
  <View>
        <Text style ={styles.matchText}>Search Your Style</Text>
        <View style = {styles.inputContainer}>
               <TouchableOpacity onPress={ () => navigation.navigate('ImagePickerscreen')}>
              <AntDesign name = {'camerao'} color = {"black"} size = {24} style = {styles.iconStyle}></AntDesign>
              </TouchableOpacity>
              <TextInput style = {styles.textInput} placeholder={'Enter text or upload image'} placeholderTextColor={"#C0C0C0"}>
               </TextInput>
              <AntDesign name = {'search1'} color = {"black"} size = {24} style = {styles.iconStyle}></AntDesign>
              
         </View>
 
  </View>
<View>
      <CategoryScrollable>
      </CategoryScrollable>
</View>
<View>
  <ItemCards></ItemCards>
</View>
   
  </LinearGradient>
  )
}

const styles = StyleSheet.create({
   LinearGradient : {
    flex : 1,
   },
   matchText : {
    fontSize : 28,
    color : '#000001',
    marginTop : 15,
    marginBottom: 5,
    marginLeft : 35,
    fontWeight : '500',
   },
   inputContainer : {
    flexDirection : 'row',
    backgroundColor : 'white',
    alignItems : 'center',
    marginHorizontal : 20,
    paddingVertical : -5,
    borderRadius : 20
   },
   textInput : {
   marginLeft : 10,
   color : "black",
   fontSize : 15
   },
   iconStyle : {
    paddingLeft : 10,
    marginRight : 5
   },
   button : {
    marginLeft : 70,
   
   }
}) 