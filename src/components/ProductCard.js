import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

const ProductCard = ({ product, onPress, onLongPress, isGrid = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isGrid && styles.gridCard]} 
      onPress={onPress} 
      onLongPress={onLongPress}
      delayLongPress={200}
      activeOpacity={0.9}
    >
      <View style={isGrid ? styles.gridImageContainer : null}>
        <Image 
          source={typeof product.image === 'string' ? { uri: product.image } : product.image} 
          style={isGrid ? styles.gridImage : styles.image} 
          resizeMode="contain" 
        />
      </View>
      <View style={[styles.infoContainer, isGrid && styles.gridInfoContainer]}>
        <Text style={styles.platformBadge}>{product.platform}</Text>
        <Text style={styles.title} numberOfLines={isGrid ? 1 : 2}>{product.name}</Text>
        <Text style={styles.price}>{product.savedPrice}</Text>
        {!isGrid && <Text style={styles.date}>Added {new Date(product.createdAt).toLocaleDateString()}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    marginVertical: theme.spacing.s,
    marginHorizontal: theme.spacing.m,
    overflow: 'hidden',
    ...theme.shadows.card,
    flexDirection: 'row',
  },
  gridCard: {
    flexDirection: 'column',
    marginHorizontal: theme.spacing.s,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    padding: theme.spacing.s,
  },
  gridImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImage: {
    width: '80%',
    height: '80%',
  },
  infoContainer: {
    flex: 1,
    padding: theme.spacing.m,
    justifyContent: 'center',
  },
  gridInfoContainer: {
    padding: theme.spacing.s,
    alignItems: 'flex-start',
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
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 4,
  },
  date: {
    ...theme.typography.caption,
    fontSize: 12,
  },
});

export default ProductCard;
