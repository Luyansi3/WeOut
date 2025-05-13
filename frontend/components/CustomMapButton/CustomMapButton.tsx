import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';


interface Props extends TouchableOpacityProps {
  onPress: () => void;
  Icon: React.FC<{ size: number; color: string }>;
};

const CustomMapButton: React.FC<Props> = ({ onPress, Icon, style, ...other}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Icon size={30} color="#8F00FF" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F5F5F7',
    borderRadius: 50,
    padding: 12,
    elevation: 5,
    zIndex: 1000,
  },
});

export default CustomMapButton;
