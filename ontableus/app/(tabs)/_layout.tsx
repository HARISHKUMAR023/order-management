import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
// import '../../global.css';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ff8100",
        tabBarInactiveTintColor: "black",
        tabBarStyle: {
          backgroundColor: "white",
          height: 60,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 11,
          },
          shadowOpacity:  0.23,
          shadowRadius: 11.78,
          elevation: 15
          
          
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="AllOrdersScreen"
        options={{
          title: 'order',
          tabBarIcon: ({ color }) => <Entypo name="shopping-cart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: "white",
    padding: 10,
  },
});
