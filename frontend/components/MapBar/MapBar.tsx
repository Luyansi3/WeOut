import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, XStack } from 'tamagui';
import { CalendarDays, ListFilter } from '@tamagui/lucide-icons';

export default function MapBar () {
 return (
  <View style={styles.filterBar}>
    <TouchableOpacity style={styles.filterButton}>
      <XStack gap={7} alignItems="center">
        <CalendarDays width={30} height={30} color={"#8F00FF"} />
        <Text style={styles.filterText}>Today</Text>
      </XStack>
    </TouchableOpacity>

    <TouchableOpacity style={styles.filterButton}>
      <XStack gap={7} alignItems="center">
        <ListFilter width={30} height={30} color={"#8F00FF"} />
        <Text style={styles.filterText}>Filter</Text>
      </XStack>
    </TouchableOpacity>
  </View>
)}

const styles = StyleSheet.create({
  filterBar: {
    position: 'absolute',
    bottom: "10%",
    left: 0,
    right: 0,
    height: "5%",
    backgroundColor: '#F5F5F7',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: "5%",
    marginHorizontal: "10%",
    zIndex: 999,
    borderRadius: 125,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  filterText: {
    fontSize: 18,
    fontFamily: "Raleway-SemiBold",
    fontWeight: 'semibold',
    color: '#8F00FF',
  }
})