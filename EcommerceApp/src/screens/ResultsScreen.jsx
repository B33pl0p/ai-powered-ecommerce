import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const ResultsScreen = ({ route }) => {
  const { results } = route.params; // This contains the image URLs and product details

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        style={styles.image}
        source={{ uri: item.image_url }}  // Display image using the URL from the server
      />
      <Text style={styles.productName} numberOfLines={2}>{item['Description']}</Text>
      <Text style={styles.productCategory}>Category: {item['Category']}</Text>
      <Text style={styles.productRating}>{item['Rating']}</Text>

   
    </View>
  );

  return (
    <View>
        <Text style = {styles.headingText}>Search Results</Text>
    <FlatList
      data={results}  // The data to render
      renderItem={renderItem}  // Function to render each item
      keyExtractor={(item, index) => index.toString()}  // Unique key for each item
      numColumns={2}  // Render in two columns
      contentContainerStyle={styles.mainContainer}  // Add some styling
    />
    </View>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({

    headingText : {
        fontSize : 24,
        color : "#000000",
        textAlign : 'center',
        fontWeight : 'bold',
        marginBottom : 5
        

    },
  mainContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  card: {
    width: '45%',
    backgroundColor: '#EAF0F1',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    marginLeft: 10,
    elevation: 3,
  },
  image: {
    height: 300,
    width: '90%',
    marginTop: 18,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    marginTop: -8,
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productRating: {
    marginTop: 5,
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productCategory : {
    marginTop: 5,
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
