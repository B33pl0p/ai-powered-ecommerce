import { ScrollView, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'

const ItemCards = () => {
  
  // using state to dynamically render items from the database
    const[items , setItems] = useState([])


  const fetchItems = async () => {
    try{
      // const response = await fetch('http://192.168.100.53:3000/products')
      const response = await fetch('http://192.168.107.216:3400/products')
      const data = await response.json();
      setItems(data)
    }
    catch(error){
      console.error('Error fetching items', error.message)
    }
  };  



//useEffect hook to fetch the data from database when the app loads
  useEffect(
    () => {
      fetchItems(); //rendered for the first time when app loads
    },
    [] //[] means it will run only once
  );

//function to render items when needed only 

const renderItem = ({ item }) => (
  <View style={styles.card} key={item.product_id.toString()}>
    <Image
      source={{ uri: `http://192.168.107.216:3400/images/${item.product_id}.jpg` }}
      style={styles.image}
    />
    <Text style={styles.productName} numberOfLines={2}>{item.product_display_name}</Text>
    <Text style={styles.productDescription} numberOfLines={2}>
      {item.description}
    </Text>
    <Text style={styles.productPrice}>Price: ${item.price}</Text>
    <Text style={styles.productRating}>Rating: {item.rating}</Text>
  </View>
);



return (

<FlatList
  data = {items}
  renderItem = {renderItem}
  keyExtractor = { (item) => item.product_id.toString() }
  numColumns={2}

  contentContainerStyle = {styles.mainContainer}
  initialNumToRender={10}
  >

</FlatList>
)


}

export default ItemCards

const styles = StyleSheet.create({


  mainContainer : {

   justifyContent :'space-between',

   paddingHorizontal : 10,
   paddingVertical : 10

    },
  innerCard : {
      height : '80%',
      width : '100%',
      marginTop : 4,
      alignItems : 'center',
      justifyContent : 'center',
      marginTop : 10,
    },
card : {

  width : '45%',
   backgroundColor : '#EAF0F1',
   alignItems : 'center',
   marginBottom : 20,
   borderRadius : 15,
   marginLeft : 10,
   elevation : 3,
  

  },
  image : {
      height :300,
      width : '90%',
      marginTop : 18,
      resizeMode : 'cover',
      borderRadius : 10,
      

      
    },
    productName : {
      color : '#000000',
      fontSize : 15,
      fontWeight : 'bold',
      textAlign : 'center'

    },


    productPrice : {
      marginTop : -8,
      color : '#000000',
      fontSize : 13,
      fontWeight : 'bold',
      textAlign : 'center'
      
    },
    productRating : {
      marginTop : 5,
      color : '#000000',
      fontSize : 13,
      fontWeight : 'bold',
      textAlign : 'center'
    },

})