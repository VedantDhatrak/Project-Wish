import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';

const ShareImportScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Simulate extraction delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Image source={require('../../assets/giphy.gif')} style={{ width: 100, height: 100, marginBottom: 16 }} contentFit="contain" />
        <Text style={styles.loadingText}>Extracting Product Information...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Save Product</Text>
          
          <View style={styles.previewCard}>
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>IMG</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.platformBadge}>Amazon</Text>
              <Text style={styles.previewTitle} numberOfLines={2}>Sample Extracted Product Name</Text>
              <Text style={styles.previewPrice}>₹9,999</Text>
            </View>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.categorySelector}>
            <Text style={styles.categoryText}>Electronics (Auto-detected)</Text>
          </View>

          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add a reason for saving..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />

          <View style={styles.actionRow}>
            <CustomButton 
              title="Cancel" 
              variant="outline" 
              style={styles.halfBtn} 
              onPress={() => navigation.goBack()}
            />
            <CustomButton 
              title="Save Product" 
              variant="primary" 
              style={styles.halfBtn} 
              onPress={handleSave}
            />
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: theme.spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    ...theme.typography.h3,
    marginTop: theme.spacing.m,
    color: theme.colors.primary,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.l,
  },
  previewCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
    ...theme.shadows.card,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
  },
  previewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  platformBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
    backgroundColor: '#E0E7FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  previewTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  label: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.s,
    fontSize: 16,
  },
  categorySelector: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  categoryText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  notesInput: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    fontSize: 16,
    marginBottom: theme.spacing.xl,
    color: theme.colors.text,
    minHeight: 100,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
  },
  halfBtn: {
    flex: 1,
  }
});

export default ShareImportScreen;
