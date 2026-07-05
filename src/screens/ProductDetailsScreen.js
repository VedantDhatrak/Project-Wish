import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={typeof product.image === 'string' ? { uri: product.image } : product.image} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.platformBadge}>{product.platform}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.savedPrice}</Text>
          
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.date}>Added {new Date(product.createdAt).toLocaleDateString()}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>My Notes</Text>
          <Text style={styles.notes}>{product.notes || 'No notes added.'}</Text>

          <View style={styles.actionsContainer}>
            <CustomButton 
              title="Visit Store" 
              variant="primary" 
              style={styles.actionBtn} 
              onPress={async () => {
                if (product.url) {
                  const supported = await Linking.canOpenURL(product.url);
                  if (supported) {
                    await Linking.openURL(product.url);
                  } else {
                    Alert.alert('Error', 'Cannot open this URL.');
                  }
                } else {
                  Alert.alert('Error', 'No URL available for this product.');
                }
              }}
            />
            <CustomButton 
              title="Edit Notes" 
              variant="outline" 
              style={styles.actionBtn} 
            />
            <TouchableOpacity style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
              <Text style={styles.deleteText}>Delete Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.card,
  },
  backBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h3,
  },
  imageContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 300,
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: theme.spacing.m,
  },
  platformBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
    backgroundColor: '#E0E7FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  date: {
    ...theme.typography.caption,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.s,
  },
  notes: {
    ...theme.typography.body,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xl,
  },
  actionsContainer: {
    gap: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
  },
  actionBtn: {
    width: '100%',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  deleteText: {
    ...theme.typography.h3,
    color: theme.colors.error,
    marginLeft: 8,
    fontSize: 16,
  }
});

export default ProductDetailsScreen;
