// IMPORTS
import {
  Eye,
  EyeOff,
} from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';;
import { Text } from 'tamagui';
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
  value: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  inputType?: CustomInputType; // password, email or text default is text
  onChangeText: (text: string) => void; // function to update the state of the input
}

/* Pour vous aider a faire un input voici quelques templates: */

// const inputConfig = {
//   email: { IconLeft: Mail, placeholder: 'Your email', secure: false },
//   password: { IconLeft: LockKeyhole, placeholder: 'Your password', secure: true },
//   fullName: { IconLeft: User, placeholder: 'Full name', secure: false },
//   username: { IconLeft: User, placeholder: 'Username', secure: false },
//   confirmPassword: { IconLeft: LockKeyhole, placeholder: 'Confirm password', secure: true },
//   text: { IconLeft: TextCursorInput, placeholder: '', secure: false },
// };

const CustomInput: React.FC<CustomInputProps> = ({ value = '', placeholder = '', leftIcon = null, inputType = 'text', style, onChangeText, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Configure per-type
  let secure: boolean = inputType === 'password'; // only needed for password

  return (
    <View style={[styles.container] as any}>
      {leftIcon &&
        (React.isValidElement(leftIcon)
          ? React.cloneElement(leftIcon, {
            paddingRight: 8,
            color: customColors.textSecond,
          })
          : <Text style={{ paddingRight: 8, color: customColors.textSecond }}>{leftIcon}</Text>
        )
      }
      <TextInput
        style={[styles.input]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={inputType === 'email' ? 'email-address' : 'default'}
        autoCapitalize={inputType === 'email' ? 'none' : 'sentences'}
        secureTextEntry={secure && !showPassword}
        // fontFamily is already handled in the styles.input
        {...rest}
      />

      {(inputType === 'password') && (
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