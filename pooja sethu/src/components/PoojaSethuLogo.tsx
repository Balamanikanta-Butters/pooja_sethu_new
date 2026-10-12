import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface PoojaSethuLogoProps {
  /** Additional styles for the outer wrapper */
  style?: object;
}

export default function PoojaSethuLogo({ style }: PoojaSethuLogoProps) {
  return (
    <Image
      source={require('../../assets/pooja-sethu-wordmark.png')}
      style={[styles.logo, style]}
      resizeMode="contain"
      accessibilityLabel="Pooja Sethu"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 210,
    height: 62,
  },
});
