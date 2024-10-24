import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import HeaderText from '../components/HeaderText';
import CategoryScrollable from '../components/CategoryScrollable';
import ItemCards from '../components/ItemCards';

//{navigation} is added to add the navigation property into homescreen

export default function HomeScreen( {navigation} ) {
  return (
  <LinearGradient colors = {["#cfcfe0", "#dddfdf", "#dddfdf"]} style = {styles.LinearGradient}> 
  <View>
      <HeaderText>
      </HeaderText>
        <Text style ={styles.matchText}>Search Your Style</Text>
        <View style = {styles.inputContainer}>
               <TouchableOpacity onPress={ () => navigation.navigate('ImagePickerscreen')}>
              <AntDesign name = {'camerao'} color = {"black"} size = {24} style = {styles.iconStyle}></AntDesign>
              </TouchableOpacity>
              <TextInput style = {styles.textInput} placeholder={'Enter text or upload image'} placeholderTextColor={"#C0C0C0"}>
               </TextInput>
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
   }
}) 