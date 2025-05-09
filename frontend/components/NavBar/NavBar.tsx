import React from 'react';
import { StyleSheet, Platform, View, TouchableOpacity} from 'react-native';
import { XStack, Text, TabsContentProps } from 'tamagui';
import { Compass, Map, PlusCircle } from '@tamagui/lucide-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function NavigationBar ({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <XStack style={styles.navbar}>
      {state.routes.map((route, index) => {
        const iconMap = {
          index: Compass,
          map: Map,
          post: PlusCircle,
        };
        
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const Icon = iconMap[route.name as keyof typeof iconMap];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Icon color={isFocused ? "#8F00FF" : "#747688" } size={30}/>
          </TouchableOpacity>
        );
      })}
    </XStack>
  )
};

const styles = StyleSheet.create({
    navbar: {
      elevation: 10,
      zIndex: 1,
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
      ...Platform.select({
        web: {
          boxShadow: '0px -3px 8px rgb(157, 178, 214, 0.1)',
        },
      }),
    },
  })