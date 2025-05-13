import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native'
import { Check, ListFilter } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'

const options = ['Music', 'Food', 'Tech', 'Ar', 'Musi', 'Foo', 'Tec']

export default function MapSelect() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((val) => val !== item)
        : [...prev, item]
    )
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
            <XStack gap={7} alignItems="center">
            <ListFilter width={30} height={30} color={"#8F00FF"} />
            <Text style={styles.filterText}>Filter</Text>
            </XStack>
        </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select categories</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = selectedItems.includes(item)
                return (
                  <TouchableOpacity
                    style={[styles.item, selected && styles.itemSelected]}
                    onPress={() => toggleItem(item)}
                  >
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{item}</Text>
                    {selected && <Check color={"#FF3C78"} />}
                  </TouchableOpacity>
                )
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modalOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#F5F5F7',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    maxHeight: 400,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
  },
  itemSelected: {
    borderRadius: 15,
    backgroundColor: 'rgba(255, 60, 120, 0.12)',
    borderWidth: 0,
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Raleway-medium",
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FF3C78',
    borderRadius: 15,
  },
  closeText: {
    color: '#F5F5F7',
    fontSize: 16,
    fontFamily: "Raleway-SemiBold",
  },
  filterText: {
    fontSize: 18,
    fontFamily: "Raleway-SemiBold",
    fontWeight: 'semibold',
    color: '#8F00FF',
  },
  filterButton: {
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: "Raleway-SemiBold"
  },
  itemTextSelected: {
    color: '#FF3C78',
  },
})
