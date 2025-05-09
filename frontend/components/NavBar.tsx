import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { XStack } from 'tamagui';
import { Compass, Map, PlusCircle } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';

type IconName = 'home' | 'map' | 'post'

type NavbarProps = {
    active: IconName
    onPress?: (name: IconName) => void
  }

export const NavigationBar = ({ active, onPress }: NavbarProps) => {
    const icons: { name: IconName; Icon: React.ElementType }[] = [
      { name: 'home', Icon: Compass },
      { name: 'map', Icon: Map },
      { name: 'post', Icon: PlusCircle },
    ]

    return (
        <XStack 
          style={styles.navbar}
        >
            {
                icons.map(({ name, Icon }) => (
                    <TouchableOpacity accessibilityRole="button" key={name} onPress={() => onPress?.(name)}>
                        <Icon testID={`icon-${name}`} color={active === name ? '#8F00FF' : '#747688'} size={30} />
                    </TouchableOpacity>
                ))
            }
        </XStack>
    ) 
};

const styles = StyleSheet.create({
    navbar: {
      position:'absolute',
      height:90,
      bottom:0,
      width:'100%',
      alignItems:'center',
      borderBottomWidth:1,
      justifyContent:"space-around",
      backgroundColor:"#F5F5F7",
      paddingHorizontal: 50,
      paddingBottom: 24,
      paddingTop: 11,
      shadowColor:  '#9db2d6',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 100,
      ...Platform.select({
        web: {
          boxShadow: '0px -3px 8px rgb(157, 178, 214, 0.1)',
        },
      }),
    },
  })