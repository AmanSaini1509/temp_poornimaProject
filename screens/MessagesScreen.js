import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getMessages } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const fetchUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    //console.log(storedUserId);
    setUserId(storedUserId);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (!userId) {
        // User is not logged in
        Alert.alert('Error', 'User is not logged in');
        return;
      }

      const storedUserId = await AsyncStorage.getItem('userId');
    console.log(storedUserId);
      const data = await getMessages(userId); // Pass userId to filter messages
      //console.log(data);
      setMessages(data);
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserId(); // Fetch the user ID on component mount
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMessages(); // Fetch messages when user ID is set
    }
  }, [userId]);

  const renderMessage = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageDate}>{new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.messageDetails}>
      Sent by: {item.sentBy?.username || 'Unknown'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
  messageDate: {
    fontSize: 14,
    color: '#666',
  },
  messageDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default MessagesScreen;
