import { StyleSheet, Text, View,TouchableOpacity,Modal } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { enableScreens } from 'react-native-screens';
enableScreens();


import ImagePickerscreen from './src/screens/ImagePickerscreen'
import HomeScreen from './src/screens/HomeScreen';
import ResultsScreen from './src/screens/ResultsScreen'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import AntDesign from 'react-native-vector-icons/AntDesign';
import Reorder from './src/screens/Reorder';
import Cart from './src/screens/Cart';
import Account from './src/screens/Account';


//create a bottom tab navigator  object
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



//homestack .. stack navigator for homescreen and image picker screen


function HomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ImagePickerscreen" component={ImagePickerscreen} />
            <Stack.Screen name="ResultsScreen" component={ResultsScreen} />

        </Stack.Navigator>
        
    )
}


const App = () => {
  return (
    //wrap everything in navigation container
    //tab.navigator has screenoptions property which can be used to remove headers and stuff
    <NavigationContainer>
      <Tab.Navigator 
      screenOptions={{
        headerShown : false,
        tabBarShowLabel : false,
        tabBarActiveTintColor : 'red',
        tabBarActiveBackgroundColor : '#FFFF08'
      }}>

        <Tab.Screen name = {"Home"}  component={HomeStackNavigator}
        options={
            {tabBarIcon : () => {
                return (
                   
                    <AntDesign name = {"home"} color= {'black'} size = {25} ></AntDesign>
                
                )
            },
            
        }
        }
        ></Tab.Screen>

        <Tab.Screen name = {"Reorder"} component={Reorder}
        options = {
            {
                tabBarIcon : () => {
                    return (
                        <FontAwesome name = {"reorder"} color = {'black'} size = {25}></FontAwesome>
                    )
                }
            }
        }
        
        ></Tab.Screen>

        <Tab.Screen name = {"Cart"} component={Cart}
        options = {
            {tabBarIcon : () => {
                return (
                    <AntDesign name = {"shoppingcart"} color = {"black"} size = {25} ></AntDesign>
                )
            }}
        }
        >

        </Tab.Screen>
        <Tab.Screen name = {"Account"} component={Account}
        options = {
            {
                tabBarIcon : () => 
                {
                    return (
                        <MaterialCommunityIcons name = {"account"} color = {"black"} size = {25}></MaterialCommunityIcons>
                    )
                }
            }
        }
        >

        </Tab.Screen>


        </Tab.Navigator>   

    
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})