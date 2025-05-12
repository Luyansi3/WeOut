// IMPORTS
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  TextCursorInput,
  User,
} from '@tamagui/lucide-icons';
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
  background: "#F5F5F7",
  pink: "#FF3C78",
  purple: "#8F00FF",
  textSecond: "#747688",
  textMain: "#1A1B41"
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
    fontFamily: 'Raleway-Regular',
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
  let IconLeft = TextCursorInput;
  let placeholder: string;
  let secure: boolean = false;



  switch (inputType) {
    case 'email':
      IconLeft = Mail;
      placeholder = 'Your email';
      break;
    case 'password':
      IconLeft = LockKeyhole;
      placeholder = 'Your password';
      secure = true;
      break;
    case 'fullName':
      IconLeft = User;
      placeholder = 'Full name';
      break;
    case 'username':
      IconLeft = User;
      placeholder = 'Username';
      break;
    case 'confirmPassword':
      IconLeft = LockKeyhole;
      placeholder = 'Confirm password';
      secure = true;
      break;
    default:
      IconLeft = TextCursorInput;
      placeholder = rest.placeholder || '';
  }

  return (
    <View style={[styles.container, style] as any}>
      <IconLeft size={20} color={customColors.textSecond} style={styles.iconLeft} marginRight={10}/>
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
      
      { (inputType === 'password' || inputType === 'confirmPassword') && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Eye size={20} color={customColors.textSecond} style={styles.iconRight} />
          ) : (
            <EyeOff size={20} color={customColors.textSecond} style={styles.iconRight} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};





export default CustomInput;