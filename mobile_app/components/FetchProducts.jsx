import { StyleSheet, Text, View, Image, FlatList, Alert } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Button } from 'react-native-paper'; // Optional, for styled cards
import { useNavigation } from '@react-navigation/native';

//initialize the navigation hook
//ip address for global use

import IP_ADDRESSES from './Ipaddresses'

//start of the component FetchProduct
const FetchProducts = () => {


  //state variables

  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, isLoading] = useState(true)
  const [error, setError] = useState(false);

  //useEffect to fetch the data when this fetch product component loads in the app

  useEffect(() => {
    let isMounted = true; // Flag to check if component is mounted
  
    // Set loading to true before the fetch starts
    isLoading(true);
  
    axios
      .get(`${IP_ADDRESSES.PC_LOCAL}:${IP_ADDRESSES.PORT_LOCAL}/products`)
      .then((response) => {
        // Only update the state if the component is still mounted
        if (isMounted) {
          setProducts(response.data);
          isLoading(false); // Set loading to false after data is fetched
        }
      })
      .catch((err) => {
        // Only update the state if the component is still mounted
        if (isMounted) {
          setError(true);
          Alert.alert(`Error fetching products from the DB: ${err.message}`);
        }
      });
  
    // Cleanup function to set the flag to false when the component is unmounted
    return () => {
      isMounted = false;
    };
  }, []);
  //useEffect function/hook ends here

  //function renderItem to render items for the flatlist
  //after the product info has been fetched from the api it needs to be rendered


  const renderItem = (({ item }) => (
    <View style={styles.viewContainer}>
      <Card style={styles.cardContainer}>
        {/* Using the image_url field from the server response */}
        <Card.Cover style={styles.card} source={{ uri: item.image_url }}></Card.Cover>
        <Card.Content>
          {/* Using the name field from the server response */}
          <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
          
          {/* Handling the price, if it's null */}
          {item.price == null ? 
            <Text style={styles.productPrice}>Price : N/A</Text> : 
            <Text style={styles.productPrice}>Price : ${item.price}</Text>
          }
          
          {/* Using the rating field */}
          <Text style={styles.productRating}>Rating: {item.rating}</Text>
        </Card.Content>
        
        <Card.Actions>
          {/* Passing the product data to the 'ProductDetails' screen */}
          <Button onPress={() => navigation.navigate('ProductDetails', { product: item })} style={styles.button}>Buy Now</Button>
        </Card.Actions>
      </Card>
    </View>
  ));
  //finally after rendering items return a flatlist

  return (
 
      <FlatList

        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatlist}
      >
      </FlatList>

  )



}

export default FetchProducts

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    overflow: 'visible',
    position : 'relative',
   

  },
  viewContainer: {
    justifyContent: 'space-around',
    width: '50%',
    padding: 10,
    overflow : 'visible',
    
 
  },
  card: {
    margin: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
  },
  productRating: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    flex: 1,
    alignItems: 'center'
  },

})