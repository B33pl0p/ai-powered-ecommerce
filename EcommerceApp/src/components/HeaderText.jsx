import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HeaderText = () => {
  return (
    <View>
    <View style = {styles.container}>
      <View style = {styles.iconContainer}>
     <Image 
     source ={require("../icons/hamrobazar.png")} style = {styles.iconStyle}>
     </Image>
     </View>
      <View style = {styles.iconContainer}> 
      <Image 
      source = {require("../icons/profileicon.jpg")} style = {styles.iconStyle}>
      </Image>
      </View>
    </View>

    </View>

  )
}

export default HeaderText

const styles = StyleSheet.create({
  iconStyle : {
   height : 40,
   width : 40,
   borderRadius : 20

  },
  iconContainer: { 
    backgroundColor : "#FFFFFF",
    width: 55,
    height : 54,
   borderRadius : 32,
    alignItems : 'center',
    justifyContent: 'center',
    backgroundColor : '#dfe4ea'
  },
  container : {
    padding : 15,

  flexDirection : 'row',
  justifyContent: 'space-between' 

  },

})