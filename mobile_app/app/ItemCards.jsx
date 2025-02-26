import { StyleSheet, Text, View, Image, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-native-paper'; // Optional, for styled cards
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import HomeScreenHeader from '../components/HomeScreenHeader';
import SearchBar from '../components/SearchBar';
// Start of the component ItemCards
const ItemCards = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [products, setProducts] = useState([]);
  const [loading, isLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (route.params?.products) {
      // If products are passed as route parameters, use them directly
      setProducts(route.params.products);
      isLoading(false); 
    } else {
      // Handle the case where no products are passed via route parameters
      // (e.g., display an error message or fetch default data)
      console.warn("No products found in route parameters."); 
      setError(true); 
      isLoading(false); 
    }
  }, [route]); 

  // Function renderItem to render items for the flatlist
  const renderItem = ({ item }) => (
    <View style={styles.viewContainer}>
      <Card style={styles.cardContainer}>
        <Card.Cover
          style={styles.card}
          source={{ uri: item.image_url }}
        />
        <Card.Content>
          <Text numberOfLines={2} style={styles.productName}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>Rs{item.price}</Text>
          <Text style={styles.productRating}>Rating: {item.rating}</Text>
          <Text style={styles.productRating}>Category: {item.category}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
            style={styles.button}
          >
            Buy Now
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );

  // Finally after rendering items return a flatlist
  return (
    <View>
      <HomeScreenHeader></HomeScreenHeader>
    <Text style = {styles.headerText}>Search Results</Text>
      <SearchBar style= {styles.SearchBar}></SearchBar>
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.product_id.toString()}
      numColumns={2}
      contentContainerStyle={styles.flatlist}
    />
    </View>
  );
};

export default ItemCards;

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
  headerText : {
    fontSize : 24,
    color : 'black',
    fontWeight : '600',
    marginLeft : 20,
  },
  SearchBar : {
    height: 50,
    width: 50,
  },

})