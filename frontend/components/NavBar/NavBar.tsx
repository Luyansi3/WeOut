// components/NavBar/NavBar.tsx
import React from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { XStack } from 'tamagui';
import { Compass, Map, Search } from '@tamagui/lucide-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function NavigationBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const iconMap = {
    index: Compass,
    map:   Map,
    search: Search,
  } as const;

  return (
    <XStack style={styles.navbar}>
      {state.routes.map((route, index) => {
        const Icon = (iconMap as any)[route.name];
        if (!Icon) {
          // Cette route n'est pas dans ton menu (par ex. /events/[id]), on la saute
          return null;
        }

        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

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
        const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

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
            <Icon color={isFocused ? "#8F00FF" : "#747688"} size={30} />
          </TouchableOpacity>
        );
      })}
    </XStack>
  );
}

const styles = StyleSheet.create({
  navbar: {
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26, 27, 65, 0.1)',
    zIndex: 1000,
    height: "12%",
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 50,
    paddingBottom: "5%",
    paddingTop: 11,
    shadowColor: '#9db2d6',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: '0px -3px 8px rgba(157, 178, 214, 0.1)',
      },
    }),
  },
});