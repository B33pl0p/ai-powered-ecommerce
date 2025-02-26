import { StyleSheet, Text, View, Image, FlatList, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import IP_ADDRESSES from "./Ipaddresses";

const FetchProducts = ({ selectedCategory }) => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ✅ Fetch products when the component mounts or when category changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const endpoint = selectedCategory
          ? `${IP_ADDRESSES.IP}/products?random=true&master_category=${encodeURIComponent(selectedCategory)}`
          : `${IP_ADDRESSES.IP}/products?random=true`;

        const response = await axios.get(endpoint);
        if (isMounted) {
          setProducts(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          Alert.alert("Error", `Failed to fetch products: ${err.message}`);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]); // ✅ Fetches new products when category changes

  // ✅ Function to render each product card
  const renderItem = ({ item }) => (
    <View style={styles.viewContainer}>
      <Card style={styles.cardContainer}>
        <Card.Cover source={{ uri: item.image_url }} style={styles.image} />
        <Card.Content>
          <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>
            {item.price ? `Price: Rs. ${item.price}` : "Price: N/A"}
          </Text>
          <Text style={styles.productCategory}>Category: {item.category}</Text>
          <Text style={styles.productRating}>Rating: {item.rating || "N/A"}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => navigation.navigate("ProductDetails", { product: item })}
            style={styles.button}
          >
            View Details
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.product_id.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatlist}
        />
      ) : (
        <Text style={styles.noProductsText}>No products found.</Text>
      )}
    </View>
  );
};

export default FetchProducts;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    margin: 10,
    elevation: 3, // Adds a shadow effect on Android
    backgroundColor: "#fff",
  },
  viewContainer: {
    flex: 1,
    padding: 10,
  },
  image: {
    height: 150,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "green",
    marginTop: 4,
  },
  productCategory: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  productRating: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  noProductsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
});
