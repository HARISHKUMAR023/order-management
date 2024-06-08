import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <View  >
      <Text>Tab [Home|Settings]</Text>
      <Text  >Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
