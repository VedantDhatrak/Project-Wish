import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { dummyProducts, dummyCategories } from '../data/dummyData';
import ProductCard from '../components/ProductCard';

const WishlistScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(false);

  const filteredProducts = activeCategory === 'All' 
    ? dummyProducts 
    : dummyProducts.filter(p => p.category === activeCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <TouchableOpacity onPress={() => setIsGridView(!isGridView)} style={styles.toggleBtn}>
          <Ionicons name={isGridView ? "list" : "grid"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
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

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        key={isGridView ? 'G' : 'L'} // force re-render when changing columns
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
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    maxWidth: '50%', // simple grid split
    // Need to adjust internal ProductCard styles for grid view in a real app
    // For MVP, we wrap the existing card
  }
});

export default WishlistScreen;
