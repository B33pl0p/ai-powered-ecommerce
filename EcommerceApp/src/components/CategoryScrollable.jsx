import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const CategoryScrollable = () => {

  const categories = [
    {
      id: 1,
      name: 'Apparels & Accessories',
      icon : 'tshirt',
      iconCategory : 'FontAwesome5'
      
    },
    {
      id: 2,
      name: 'Automobiles',
      icon : 'motorcycle',
      iconCategory : 'FontAwesome5'
    },
    {
      id: 3,
      name: 'Beauty & Health',
      icon : 'air-freshener',
      iconCategory : 'FontAwesome5'

      
    },
    {
      id: 4,
      name: 'Books & Learning',
      icon : 'book-open',
      iconCategory : 'FontAwesome5'
      
    },
    {
      id: 5,
      name: 'Business & Industrial',
      icon : 'industry',
      iconCategory : 'FontAwesome5'
    },
    {
      id: 6,
      name: 'Computers & Peripherals',
      icon : 'laptop-code',
      iconCategory : 'FontAwesome5'
      
    },
    {
      id: 7,
      name: 'Electronics, TVs, & More',
      icon : 'tv',
      iconCategory : 'FontAwesome5'

      
    },

    {
      id: 8,
      name: 'Fresh Veggies & Meat',
      icon :'lemon',
      iconCategory : 'FontAwesome5'
      
    },
    {
      id: 9,
      name: 'Furnishings & Appliances',
      icon : 'sofa',
      iconCategory: 'MaterialCommunityIcons'
      
    },
  ];
  const getIconComponent = (icon,iconCategory) => {
    switch (iconCategory) {
      case  'FontAwesome5' :
        return <FontAwesome5 name = {icon} size = {15} color = {"black"} ></FontAwesome5>;
      case  'MaterialCommunityIcons' :
        return <MaterialCommunityIcons name = {icon} size = {15} color = {"black"} ></MaterialCommunityIcons>;  

    }
 
  }


  return (
  
    <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false} >

      <View style = {styles.categoryButtonsContainer}>
            {categories.map( ({id,name,icon,iconCategory}) => (
         <View key = {id} style={styles.textButton}>
              {getIconComponent(icon,iconCategory)}
            <TouchableOpacity> 
              <Text style= {styles.trendingText}>{name}</Text>
            </TouchableOpacity>
          </View>
           ) )}
      </View>
   </ScrollView>

    
   
  )
}

export default CategoryScrollable

const styles = StyleSheet.create({


  trendingText : {
    marginLeft : 3,
    color: '#333333'
  },
  textButton : {
    backgroundColor : '#EAF0F1',
    fontSize : 16,
    padding : 15,
    marginLeft : 15,
    marginTop : 15,
    height : 50,
    borderRadius : 25,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center'
    

  },
  categoryButtonsContainer : {
    flexDirection: 'row',
   
   
    
  }



})