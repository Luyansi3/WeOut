import { View, Button, Text } from 'tamagui';

export default function HomeScreen() {
  return (
    <View flex={1} justifyContent="center" alignItems="center" gap="$4">
      <Text fontSize="$6">Home page WeOut</Text>
      <Button>Click Me</Button>
    </View>
  );
}
