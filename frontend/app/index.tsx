import { StyleSheet } from 'react-native';
import { View, Button  } from 'tamagui'


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Button >Welcome!</Button >
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
