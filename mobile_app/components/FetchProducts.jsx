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
    //first fetch the products  the api
    //use axios
    axios
      .get(`${IP_ADDRESSES.PC_LOCAL}:${IP_ADDRESSES.PORT_LOCAL}/products`)
      //after successful response from axios.get
      //response is passed to the then function
      .then((response) => {
        setProducts(response.data.result)
        //now the product state variable is updated with the response from server
        isLoading(false)
      })
      //now the errors part
      .catch((err) => {
        setError(true)
        Alert.alert(`error fetching products from the db ${err}`)
      });
  }
    //pass the second component of the usestate function as an empty array
    //this ensures useeffect will run only once when this component loads
    , []
  );
  //useEffect function/hook ends here

  //function renderItem to render items for the flatlist
  //after the product info has been fetched from the api it needs to be rendered

  const renderItem = (({ item }) => (

    <View style={styles.viewContainer}>
      <Card style={styles.cardContainer} >
        <Card.Cover style={styles.card} source={{ uri: `data:image/jpeg;base64,${item.image_data}` }}></Card.Cover>
        <Card.Content>
          <Text numberOfLines={2} style={styles.productName}>{item.product_display_name}</Text>
           {item.price == null ? <Text style= {styles.productPrice}>Price : N/A</Text> : <Text style={styles.productPrice}>Price : ${item.price}</Text> }
          <Text style={styles.productRating}>Rating: {item.rating}</Text>

        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('ProductDetails', { product: item })} style={styles.button}>Buy Now</Button>
        </Card.Actions>
      </Card>
    </View>

  )
  )
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