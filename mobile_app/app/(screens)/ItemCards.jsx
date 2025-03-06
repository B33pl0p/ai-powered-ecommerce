import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Divider, DefaultTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import HomeScreenHeader from '../../components/HomeScreenHeader';
import SearchBar from '../../components/SearchBar';
import { PaperProvider } from 'react-native-paper';

const ItemCards = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('Best Match');
  const [menuVisible, setMenuVisible] = useState(false);
  const searchQuery = route.params?.searchQuery || null;

  useEffect(() => {
    if (route.params?.products) {
      setProducts(route.params.products);
      setFilteredProducts(route.params.products);
    } else {
      console.warn("No products found in route parameters.");
    }
  }, [route]);

  const sortProducts = (option) => {
    let sortedProducts = [...filteredProducts];
  
    if (option === 'Best Match') {
      // Reset to original products when "Best Match" is selected
      setFilteredProducts(products);
    } else if (option === 'Price: Low to High') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === 'Price: High to Low') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (option === 'Rating: Low to High') {
      sortedProducts.sort((a, b) => a.rating - b.rating);
    } else if (option === 'Rating: High to Low') {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    } else if (option === 'Name: A-Z') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'Name: Z-A') {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
  
    // If not "Best Match", update the filtered products with the sorted list
    if (option !== 'Best Match') {
      setFilteredProducts(sortedProducts);
    }
  
    setSortOption(option);
    setMenuVisible(false); // Close the menu after selection
  };
  


  const renderItem = ({ item }) => (
    <View style={styles.viewContainer}>
      <Card style={styles.cardContainer}>
        <Card.Cover style={styles.card} source={{ uri: item.image_url }} />
        <Card.Content>
          <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>Rs {item.price}</Text>
          <Text style={styles.productRating}>Rating: {item.rating}</Text>
          <Text style={styles.productCategory}>Category: {item.category}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('(screens)/ProductDetails', { product: item })}>
            Buy Now
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );

  return (
    <PaperProvider theme={DefaultTheme}>
      <HomeScreenHeader />

      {searchQuery != null ? <Text style={styles.headerText}>Search Results for "{searchQuery}"</Text> : <Text style={styles.headerText}>Search Results </Text>}
   
      <SearchBar style={styles.SearchBar} />

      {/* Sorting Dropdown */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort By: </Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisible(true)}>
              {sortOption}
            </Button>
          }
        >
          <Menu.Item onPress={() => sortProducts('Best Match')} title="Best Match" />
          <Divider />
          <Menu.Item onPress={() => sortProducts('Price: Low to High')} title="Price: Low to High" />
          <Menu.Item onPress={() => sortProducts('Price: High to Low')} title="Price: High to Low" />
          <Divider />
          <Menu.Item onPress={() => sortProducts('Rating: Low to High')} title="Rating: Low to High" />
          <Menu.Item onPress={() => sortProducts('Rating: High to Low')} title="Rating: High to Low" />
          <Divider />
          <Menu.Item onPress={() => sortProducts('Name: A-Z')} title="Name: A-Z" />
          <Menu.Item onPress={() => sortProducts('Name: Z-A')} title="Name: Z-A" />
        </Menu>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatlist}
      />
    </PaperProvider>
  );
};

export default ItemCards;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    overflow: 'visible',
    position: 'relative',
  },
  viewContainer: {
    justifyContent: 'space-around',
    width: '50%',
    padding: 10,
    overflow: 'visible',
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
  productCategory: {
    fontSize: 14,
    color: 'blue',
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    marginLeft: 20,
    fontStyle : "italic",
    marginBottom : 5,
  },
  SearchBar: {
    height: 50,
    width: 50,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});
