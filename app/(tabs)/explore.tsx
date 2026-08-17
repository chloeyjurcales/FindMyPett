import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../../constants/theme';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.tanBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textDark,
  },
});