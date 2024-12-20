import { Tabs } from "expo-router";
import discoverScreen from "./discoverScreen";
import profileScreen from "./profileScreen";


import { Octicons } from "@expo/vector-icons";
import FetchProducts from "../../components/FetchProducts";
import ProductDetails from "../ProductDetails";
//stack navigation for the homescreen
//contains product details screen 

//create a stack navigator object first


//stack nav function
export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index"
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon :  ({color , focused} ) => ( <Octicons name= {focused ? "home" : "home"} color = {focused ? "green" : "black"} size = {20}></Octicons>)
                }}> 
            </Tabs.Screen>
           
            {/* now to add the stack add it here like */}
                
            <Tabs.Screen name="discoverScreen" 
            options={{ 
                headerShown: false,
                title : "Discover",
                tabBarIcon :  ({color , focused} ) => ( <Octicons name= {focused ? "globe" : "globe"} color = {focused ? "green" : "black"} size = {20}></Octicons>)

                 }}>

            </Tabs.Screen>

            <Tabs.Screen name="profileScreen" 
            options={{ 
                headerShown: false,
                title : "Profile",
                tabBarIcon :  ({color , focused} ) => ( <Octicons name= {focused ? "person" : "person"} color = {focused ? "green" : "black"}  size = {20}></Octicons>)

                 }}>

            </Tabs.Screen>


        </Tabs>
    )
}