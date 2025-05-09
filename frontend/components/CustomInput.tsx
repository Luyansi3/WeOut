// IMPORTS
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

// COMPONENTS:
import { CustomInputType } from '../types/CustomTypeInput';




// global var
const customColors = {
  background : "#F5F5F7",
  pink : "#FF3C78",
  purple : "#8F00FF",
  textSecond : "#747688",
  textMain : "#1A1B41"
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: customColors.textSecond,
  },
  iconRight: {
    marginLeft: 8,
  },
});


interface CustomInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  /** Determines which icon, placeholder, and behavior to use */
  inputType?: CustomInputType;
}

const CustomInput: React.FC<CustomInputProps> = ({ inputType = 'default', style, ...rest }) => {
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Configure per-type
  let iconName: string;
  let placeholder: string;
  let secure: boolean = false;



  switch (inputType) {
    case 'email':
      iconName = 'mail-outline';
      placeholder = 'Your email';
      break;
    case 'password':
      iconName = 'lock-outline';
      placeholder = 'Your password';
      secure = true;
      break;
    default:
      iconName = 'text-fields';
      placeholder = rest.placeholder || '';
  }

  return (
    <View style={[styles.container, style] as any}>
      <MaterialIcons name={iconName} size={20} color={customColors.textSecond} style={styles.iconLeft} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        keyboardType={inputType === 'email' ? 'email-address' : 'default'}
        autoCapitalize={inputType === 'email' ? 'none' : 'sentences'}
        secureTextEntry={secure && !showPassword}
        {...rest}
      />
      {inputType === 'password' && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color={customColors.textSecond}
            style={styles.iconRight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};





export default CustomInput;