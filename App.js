import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import LoginScreen from './screens/LoginScreen';
import MessagesScreen from './screens/MessagesScreen';
import MeetingsScreen from './screens/MeetingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const Loader = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Meetings" component={MeetingsScreen} options={{
    headerShown: false,
    tabBarIcon: ({ color, size }) => (
      <MaterialIcons name="event" size={size} color={color} />
    ),
  }} />
    <Tab.Screen name="Messages" component={MessagesScreen} options={{
    headerShown: false,
    tabBarIcon: ({ color, size }) => (
      <MaterialIcons name="chat" size={size} color={color} />
    ),
  }} />
  </Tab.Navigator>
);

const fetchUserName = async () => {
  const userName = await AsyncStorage.getItem('userName')
  Alert.alert('Welcome! ', userName)
}
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Button title="Profile Screen" onPress={() => fetchUserName()} />
  </View>
);

const Logout = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={AppTabs} options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} />
    <Drawer.Screen name="Profile" component={ProfileScreen} options={{
        drawerIcon: ({ color, size }) => (
          <MaterialIcons name="account-circle" size={size} color={color} />
        ),
      }}/>
    <Drawer.Screen name="Logout" component={LoginScreen} options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="exit" size={size} color={color} />
        ),
      }}/>
  </Drawer.Navigator>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Failed to check login status:', error);
        setIsAuthenticated(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isAuthenticated === null) {
    return <Loader />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};


const App = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

export default App;
