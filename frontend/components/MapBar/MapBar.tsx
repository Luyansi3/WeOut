import React, { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, XStack, Select, Adapt, Sheet, Portal, YStack, SelectProps } from 'tamagui';
import { CalendarDays, Check, ChevronDown, ChevronUp, ListFilter } from '@tamagui/lucide-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'tamagui/linear-gradient';
import MapSelect from '../MapSelect/MapSelect';
import { DateExtractor } from '@/types/Extractor';


export default function MapBar({
  date,
  setDate,
  tags,
  setTags,
}: {
  date: Date;
  setDate: (date: Date) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const selectTriggerRef = useRef<any>(null);

  const openTagSelector = () => {
    if (selectTriggerRef.current) {
      selectTriggerRef.current?.press?.(); // Simulate press on the hidden trigger
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
  setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  return (
    <>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowPicker(true)}>
          <XStack gap={7} alignItems="center">
            <CalendarDays width={30} height={30} color={"#8F00FF"} />
            <Text style={styles.filterText}>
              {date.toDateString().split(' ').slice(1).join(' ')}
            </Text>
          </XStack>
        </TouchableOpacity>

        <MapSelect tags={tags} setTags={setTags} />
      </View>

      {showPicker && <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={onChange}
          minimumDate={new Date()}

        />}
    </>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    position: 'absolute',
    bottom: "5%",
    left: 0,
    right: 0,
    height: "7%",
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
  },

  filterSelect: {
    position: 'absolute',
    bottom: "50%",
  }
})