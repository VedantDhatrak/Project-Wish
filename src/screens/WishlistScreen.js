import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { theme } from '../theme/theme';
import { dummyCategories } from '../data/dummyData';
import ProductCard from '../components/ProductCard';

const getApiUrl = () => {
  const debuggerHost = Constants.manifest2?.extra?.expoGo?.debuggerHost || Constants.expoConfig?.hostUri;
  const localhost = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
  return `http://${localhost}:3000/api`;
};

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
      setProducts(prev => prev.filter(p => p.id !== id));
      const res = await fetch(`${getApiUrl()}/products/${id}/archive`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to archive');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to remove product');
    }
  };

  const handleDragEnd = async ({ data }) => {
    setProducts(data);
    try {
      const orderedIds = data.map(p => p.id);
      await fetch(`${getApiUrl()}/products/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
    } catch (error) {
      console.error('Failed to reorder:', error);
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

  const renderRightActions = (id) => (
    <TouchableOpacity onPress={() => archiveProduct(id)} style={styles.archiveAction}>
      <Ionicons name="trash" size={24} color="#fff" />
      <Text style={styles.archiveText}>Remove</Text>
    </TouchableOpacity>
  );

  const renderItemDraggable = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <Swipeable renderRightActions={() => renderRightActions(item.id)} overshootRight={false}>
        <View style={[styles.listItem, { opacity: isActive ? 0.8 : 1 }]}>
          <ProductCard 
            product={item} 
            isGrid={false}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
            onLongPress={drag}
          />
        </View>
      </Swipeable>
    </ScaleDecorator>
  );

  const renderItemGrid = ({ item }) => (
    <View style={styles.gridItem}>
      <ProductCard 
        product={item} 
        isGrid={true}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      />
    </View>
  );

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
        isGridView ? (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItemGrid}
            contentContainerStyle={[styles.listContainer, filteredProducts.length === 0 && { flex: 1 }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        ) : (
          <DraggableFlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            onDragEnd={handleDragEnd}
            renderItem={renderItemDraggable}
            contentContainerStyle={[styles.listContainer, filteredProducts.length === 0 && { flex: 1 }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        )
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
  archiveAction: {
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: theme.spacing.s,
    marginRight: theme.spacing.m,
    borderTopRightRadius: theme.borderRadius.l,
    borderBottomRightRadius: theme.borderRadius.l,
  },
  archiveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  }
});

export default WishlistScreen;
