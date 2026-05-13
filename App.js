import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

import InputScreen from './src/screens/InputScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { initDatabase } from './src/db/database';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initDatabase()
      .then(() => {
        setReady(true);
        SplashScreen.hideAsync();
      })
      .catch((e) => {
        setError(String(e?.message ?? e));
        SplashScreen.hideAsync();
      });
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>초기화 실패: {error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { fontWeight: '700', fontSize: 17 },
            tabBarActiveTintColor: '#111',
            tabBarInactiveTintColor: '#A0A0A0',
            tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
            tabBarStyle: {
              borderTopColor: '#E5E5EA',
              height: 60,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarIcon: ({ color, size }) => {
              const name =
                route.name === '입력' ? 'add-circle-outline' : 'list-outline';
              return <Ionicons name={name} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="입력" component={InputScreen} />
          <Tab.Screen name="내역" component={HistoryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#FF3B30',
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});
