import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme/theme';
import CustomButton from './CustomButton';

const UrlInputModal = ({ visible, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (!url.trim()) return;
    onSubmit(url);
    setUrl(''); // reset
  };

  const handleClose = () => {
    setUrl('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Add Product</Text>
            <Text style={styles.label}>Paste Product URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://amazon.in/..."
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
            
            <View style={styles.actionRow}>
              <CustomButton 
                title="Cancel" 
                variant="outline" 
                style={styles.halfBtn} 
                onPress={handleClose}
              />
              <CustomButton 
                title="Next" 
                variant="primary" 
                style={styles.halfBtn} 
                onPress={handleSubmit}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing.m,
  },
  backdrop: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  label: {
    ...theme.typography.body,
    marginBottom: theme.spacing.s,
    color: theme.colors.textSecondary,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    fontSize: 16,
    marginBottom: theme.spacing.xl,
    color: theme.colors.text,
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

export default UrlInputModal;
