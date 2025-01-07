import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getMeetings } from '../services/api';

const MeetingsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('Pending');
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const data = await getMeetings(selectedFilter);
      //console.log('Fetched data:', data); // Debugging
      setMeetings(data.meetings); // Extracting 'meetings' array
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch meetings');
      //console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMeetings();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMeetings();
  }, [selectedFilter]);

  const renderMeeting = ({ item }) => (
    <View style={styles.meetingItem}>
      <Text style={styles.meetingTitle}>{item.title}</Text>
      <Text style={styles.meetingDate}>
        {new Date(item.date).toLocaleString()} {/* Formatting date */}
      </Text>
      <Text style={styles.meetingDetails}>{item.agenda}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meetings</Text>
      <View style={styles.filters}>
        {['Pending', 'Postponed', 'Completed'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {meetings.length === 0 && (
            <Text style={styles.emptyMessage}>No meetings found.</Text>
          )}
          <FlatList
            data={meetings}
            renderItem={renderMeeting}
            keyExtractor={(item) => item._id} // Ensure a unique key
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  filters: { flexDirection: 'row', marginBottom: 16 },
  filterButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 8,
  },
  activeFilterButton: { backgroundColor: '#007bff' },
  filterText: { color: '#333', fontSize: 16 },
  activeFilterText: { color: '#ffffff' },
  meetingItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  meetingTitle: { fontSize: 18, fontWeight: 'bold' },
  meetingDate: { fontSize: 14, color: '#666' },
  meetingDetails: { fontSize: 14, color: '#666' },
  emptyMessage: { textAlign: 'center', color: '#888', fontSize: 16 },
});

export default MeetingsScreen;
