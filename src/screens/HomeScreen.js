import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const getApiUrl = () => {
  const debuggerHost = Constants.manifest2?.extra?.expoGo?.debuggerHost || Constants.expoConfig?.hostUri;
  const localhost = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
  return `http://${localhost}:3000/api`;
};
import ProductCard from '../components/ProductCard';
import UrlInputModal from '../components/UrlInputModal';

const HomeScreen = ({ navigation }) => {
  const [isUrlModalVisible, setIsUrlModalVisible] = useState(false);
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

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const handleUrlSubmit = (url) => {
    setIsUrlModalVisible(false);
    navigation.navigate('ShareImport', { url });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Vedant</Text>
          <Text style={styles.subtitle}>You have {products.length} items saved</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{uniqueCategories.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
        <View>
          <FlatList
            data={products.slice(0, 3)} // Show only recent 3
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard 
                product={item} 
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
              />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Prevent nested scrolling inside ScrollView if added
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="basket-outline" size={60} color={theme.colors.textSecondary} style={{ marginBottom: 16 }} />
                <Text style={styles.emptySubtitle}>No recently added products.</Text>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>

      <View style={styles.addCardContainer}>
        <View style={styles.addCard}>
          <View style={styles.addCardContent}>
            <Ionicons name="link-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.addCardTitle}>Add a new product</Text>
            <Text style={styles.addCardSubtitle}>Paste any link to save it here</Text>
          </View>
          <TouchableOpacity 
            style={styles.addCardButton}
            onPress={() => setIsUrlModalVisible(true)}
          >
            <Text style={styles.addCardButtonText}>+ Paste Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      <UrlInputModal 
        visible={isUrlModalVisible} 
        onClose={() => setIsUrlModalVisible(false)}
        onSubmit={handleUrlSubmit}
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
  greeting: {
    ...theme.typography.h1,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  profileBtn: {
    padding: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    // backgroundColor:"red"
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.xs,
    marginRight: theme.spacing.s,
    ...theme.shadows.card,
    alignItems: 'center',
    // backgroundColor:"green"
  },
  statNumber: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  statLabel: {
    ...theme.typography.caption,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  sectionTitle: {
    ...theme.typography.h3,
  },
  seeAll: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  addCardContainer: {
    paddingHorizontal: theme.spacing.m,
    // paddingBottom: theme.spacing.xl,
    // marginTop: theme.spacing.m,
    // backgroundColor:"red",
  },
  addCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.card,
  },
  addCardContent: {
    flex: 1,
  },
  addCardTitle: {
    ...theme.typography.h3,
    marginTop: 4,
  },
  addCardSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  addCardButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40, // Keeps it sleek and ~50% of card height visually
  },
  addCardButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginTop: 20,
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }
});

export default HomeScreen;
