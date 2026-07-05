import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import ProductCard from '../components/ProductCard';

const getApiUrl = () => {
  const debuggerHost = Constants.manifest2?.extra?.expoGo?.debuggerHost || Constants.expoConfig?.hostUri;
  const localhost = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
  return `http://${localhost}:3000/api`;
};

const RemovedItemsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchArchivedProducts();
    }, [])
  );

  const fetchArchivedProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/products/archived`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const restoreProduct = async (id) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      await fetch(`${getApiUrl()}/products/${id}/restore`, { method: 'PUT' });
    } catch (error) {
      Alert.alert('Error', 'Failed to restore');
    }
  };

  const deleteProduct = async (id) => {
    Alert.alert('Delete Permanently', 'Are you sure you want to completely erase this product?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            setProducts(prev => prev.filter(p => p.id !== id));
            await fetch(`${getApiUrl()}/products/${id}`, { method: 'DELETE' });
          } catch (error) {
            Alert.alert('Error', 'Failed to delete');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <ProductCard product={item} isGrid={false} onPress={() => {}} />
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.restoreBtn]} onPress={() => restoreProduct(item.id)}>
          <Ionicons name="refresh-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Restore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => deleteProduct(item.id)}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.btnText}>Erase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Removed Items</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContainer, products.length === 0 && { flex: 1 }]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="trash-can-outline" size={80} color={theme.colors.textSecondary} style={{ marginBottom: 16 }} />
              <Text style={styles.emptyTitle}>Trash is Empty</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: { ...theme.typography.h3 },
  iconBtn: { padding: theme.spacing.xs },
  listContainer: { paddingBottom: theme.spacing.xl, paddingTop: theme.spacing.m },
  cardWrapper: {
    marginBottom: theme.spacing.l,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    marginTop: -theme.spacing.s, // Pull up slightly closer to card
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: theme.borderRadius.s,
    marginHorizontal: 4,
  },
  restoreBtn: { backgroundColor: theme.colors.accent },
  deleteBtn: { backgroundColor: theme.colors.error },
  btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  emptyTitle: { ...theme.typography.h2, color: theme.colors.textSecondary },
});

export default RemovedItemsScreen;
