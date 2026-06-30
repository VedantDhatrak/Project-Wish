import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulate loading time, then navigate to Login
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="cart-outline" size={80} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>Project Wish</Text>
      <Text style={styles.tagline}>One Wishlist. Every Store.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    backgroundColor: '#E0E7FF',
    padding: 24,
    borderRadius: 30,
    marginBottom: 20,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: 8,
  },
  tagline: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});

export default SplashScreen;
