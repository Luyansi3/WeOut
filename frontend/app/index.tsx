import { StyleSheet } from 'react-native';
import { View, Button  } from 'tamagui'
import { NavigationBar } from '@/components/NavBar'


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Button>Welcome!</Button>
      <NavigationBar active="home" onPress={(name) => console.log(name)} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
