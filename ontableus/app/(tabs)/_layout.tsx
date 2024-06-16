import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
// import '../../global.css';
export default function TabLayout() {
  return (

        <Tabs screenOptions={{headerShown:false, tabBarActiveTintColor: 'black',tabBarStyle:{backgroundColor:'white',padding:10}  }} >
      <Tabs.Screen
        name="index"
        
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
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
