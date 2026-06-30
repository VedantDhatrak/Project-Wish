import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleContinue = () => {
    if (!isOtpSent) {
      // Simulate sending OTP
      setIsOtpSent(true);
    } else {
      // Simulate verifying OTP and login
      navigation.replace('MainTabs');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{isOtpSent ? 'Verify OTP' : 'Welcome to Wish'}</Text>
          <Text style={styles.subtitle}>
            {isOtpSent 
              ? 'Enter the 4-digit code sent to your mobile number.' 
              : 'Enter your mobile number to sign in or create an account.'}
          </Text>

          {!isOtpSent ? (
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Enter OTP (e.g. 1234)"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
            />
          )}

          <CustomButton 
            title={isOtpSent ? 'Verify & Continue' : 'Continue'} 
            onPress={handleContinue} 
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
    color: theme.colors.textSecondary,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    fontSize: 18,
    marginBottom: theme.spacing.l,
    color: theme.colors.text,
  },
  button: {
    marginTop: theme.spacing.m,
  }
});

export default LoginScreen;
