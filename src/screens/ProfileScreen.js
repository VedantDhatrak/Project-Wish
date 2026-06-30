import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import CustomButton from '../components/CustomButton';

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color={theme.colors.primary} />
          </View>
          <Text style={styles.name}>Vedant</Text>
          <Text style={styles.phone}>+91 98765 43210</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Electronics</Text>
            <Text style={styles.statLabel}>Top Category</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
            <Text style={styles.rowText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
            <Text style={styles.rowText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.text} />
            <Text style={styles.rowText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoutContainer}>
          <CustomButton 
            title="Logout" 
            variant="outline" 
            onPress={() => navigation.replace('Login')}
          />
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Image 
              source={require('../../assets/giphy.gif')} 
              style={{ width: 150, height: 150, borderRadius: 12 }} 
              contentFit="contain" 
            />
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
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  name: {
    ...theme.typography.h2,
    marginBottom: 4,
  },
  phone: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    paddingVertical: theme.spacing.m,
    ...theme.shadows.card,
    marginBottom: theme.spacing.l,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...theme.typography.caption,
  },
  section: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    paddingVertical: theme.spacing.s,
    ...theme.shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowText: {
    flex: 1,
    ...theme.typography.body,
    marginLeft: theme.spacing.m,
  },
  logoutContainer: {
    padding: theme.spacing.xl,
    marginTop: theme.spacing.l,
  }
});

export default ProfileScreen;
