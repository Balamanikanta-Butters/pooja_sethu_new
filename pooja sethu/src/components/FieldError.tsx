import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface FieldErrorProps {
  message: string;
}

/**
 * Small red error hint that appears below an input when validation fails.
 * Usage:  <FieldError message={errors.name} />
 */
export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 12,
    color: '#C0392B',
    fontWeight: '500',
    lineHeight: 18,
  },
});
