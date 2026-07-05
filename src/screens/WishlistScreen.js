import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { theme } from '../theme/theme';
import { dummyCategories } from '../data/dummyData';

const getApiUrl = () => {
  const debuggerHost = Constants.manifest2?.extra?.expoGo?.debuggerHost || Constants.expoConfig?.hostUri;
  const localhost = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
  return `http://${localhost}:3000/api`;
};
import ProductCard from '../components/ProductCard';

const WishlistScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${getApiUrl()}/products`);
          const data = await res.json();
          setProducts(data);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }, [])
  );

  const archiveProduct = async (id) => {
    try {
      // Optimistic update
      setProducts(prev => prev.filter(p => p.id !== id));
      
      const res = await fetch(`${getApiUrl()}/products/${id}/archive`, {
        method: 'PUT'
      });
      if (!res.ok) throw new Error('Failed to archive');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to remove product');
    }
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="shopping-search" size={80} color={theme.colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
        <Text style={styles.emptySubtitle}>Start adding products from your favorite stores to track prices and keep them organized!</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('RemovedItems')} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsGridView(!isGridView)} style={styles.iconBtn}>
            <Ionicons name={isGridView ? "list" : "grid"} size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {dummyCategories.map((cat, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.categoryPill, activeCategory === cat && styles.activeCategoryPill]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <SwipeListView
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          key={isGridView ? 'G' : 'L'} 
          numColumns={isGridView ? 2 : 1}
          renderItem={({ item }) => (
            <View style={isGridView ? styles.gridItem : styles.listItem}>
              <ProductCard 
                product={item} 
                isGrid={isGridView}
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
              />
            </View>
          )}
          renderHiddenItem={({ item }) => (
            !isGridView ? ( // Disable swipe in grid view for now
              <View style={styles.rowBack}>
                <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                  <TouchableOpacity onPress={() => archiveProduct(item.id)} style={styles.archiveAction}>
                    <Ionicons name="trash" size={24} color="#fff" />
                    <Text style={styles.archiveText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          )}
          disableRightSwipe
          rightOpenValue={-80}
          contentContainerStyle={[styles.listContainer, filteredProducts.length === 0 && { flex: 1 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
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
    paddingVertical: theme.spacing.m,
  },
  title: {
    ...theme.typography.h1,
  },
  toggleBtn: {
    padding: theme.spacing.xs,
  },
  filterContainer: {
    marginBottom: theme.spacing.s,
  },
  categoryScroll: {
    paddingHorizontal: theme.spacing.m,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeCategoryPill: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeCategoryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  listItem: {
    flex: 1,
  },
  gridItem: {
    flex: 1,
    maxWidth: '50%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: 40,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.l,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 80,
  },
  backRightBtnRight: {
    backgroundColor: theme.colors.error,
    right: 0,
    borderTopRightRadius: theme.borderRadius.l,
    borderBottomRightRadius: theme.borderRadius.l,
  },
  archiveAction: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  archiveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  }
});

export default WishlistScreen;
