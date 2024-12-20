import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import IP_ADDRESSES from '../components/Ipaddresses';
import { FontAwesome6 } from '@expo/vector-icons';

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;
 
  const dummydescription = `Pellentesque molestie turpis a nunc sagittis semper. Cras a viverra erat. Vestibulum id suscipit tortor, vel pellentesque purus. Aenean a convallis urna. Donec accumsan, leo vel viverra mattis, quam neque aliquet risus, pulvinar laoreet. `


  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <FontAwesome6 onPress={() => navigation.goBack()} style={styles.shareIcon} name={'arrow-left'} size={25}/>
          <Text style={styles.headerText}>
            Product Details
          </Text>
          <FontAwesome6 style={styles.shareIcon} name={'share-square'} color={'black'} size={20}/>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.productImage}
            source={{ uri: `data:image/jpeg;base64,${product.image_data}` }}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{product.product_display_name}</Text>

          {product.price != null ? <Text style={styles.price}>NPR {product.price}</Text> : <Text style={styles.price}>Price : N/A</Text>}

          <Text style={styles.description}>{dummydescription}</Text>
          <Text style={styles.otherInfoText}>Category : {product.sub_category}</Text>
          <Text style={styles.otherInfoText}>Season : {product.season}</Text>
          <Text style={styles.otherInfoText}>Gender : {product.gender}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addToCartButton}>
              <Text style={styles.buttonTextCart}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.buttonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({

  headerSection: {
    flex: 1,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  headerText: {

    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,

  },
  shareIcon: {

    marginTop: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent : 'space-between'
  },
  otherInfoText: {
    fontSize: 20,
    marginBottom: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  productImage: {
    width: '80%',
    height: 300,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
  },
  contentContainer: {
    padding: 18,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',

  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: '#eeeeee',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonTextCart: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },


});

export default ProductDetails;
