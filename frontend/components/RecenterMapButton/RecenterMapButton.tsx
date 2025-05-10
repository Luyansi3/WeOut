import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LocateFixed } from '@tamagui/lucide-icons';


type Props = {
  onPress: () => void;
};

const RecenterButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <LocateFixed size={24} color="#8F00FF" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#F5F5F7',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    zIndex: 1000,
  },
});

export default RecenterButton;
