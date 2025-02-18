import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';

import { ActivityIndicator, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import LoginScreen from './screens/LoginScreen';
import MessagesScreen from './screens/MessagesScreen';
import MeetingsScreen from './screens/MeetingsScreen';
import { logout } from './services/api';

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
    <Tab.Screen
      name="Meetings"
      component={MeetingsScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="event" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Messages"
      component={MessagesScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="chat" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const fetchUserName = async () => {
  const userName = await AsyncStorage.getItem('userName');
  Alert.alert('Welcome!', userName);
};

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Button title="Profile Screen" onPress={() => fetchUserName()} />
  </View>
);

const DrawerNavigator = ({ navigation, onLogout }) => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen
      name="Home"
      component={AppTabs}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <MaterialIcons name="account-circle" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
  name="Logout"
  component={() => null}
  options={{
    drawerLabel: () => (
      <Button
        title="Logout"
        onPress={() => onLogout(navigation)}
        color="#d9534f"
      />
    ),
    drawerIcon: ({ color, size }) => (
      <Ionicons name="exit" size={size} color={color} />
    ),
  }}
/>

  </Drawer.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Failed to check login status:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = async (navigation) => {
    setIsAuthenticated(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleLogout = async (navigation) => {
    try {
      await logout();
      await AsyncStorage.clear();
      setIsAuthenticated(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (isAuthenticated === null) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen
            name="Home"
            component={(props) => <DrawerNavigator {...props} onLogout={handleLogout} />}
          />
        ) : (
          <Stack.Screen
            name="LoginScreen"
            component={(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;