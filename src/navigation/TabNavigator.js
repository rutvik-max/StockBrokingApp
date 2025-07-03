import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import ExploreScreen from '../screens/ExploreScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import ProductScreen from '../screens/ProductScreen';
import ViewAllScreen from '../screens/ViewAllScreen'; // ✅ Add this import
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Tabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Explore' ? 'search' : 'bookmark';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
};

export default function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={Tabs}
        options={{ headerShown: false }}
      />

      {/* ✅ Existing Product Screen */}
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={({ navigation }) => ({
          title: 'Stock Details',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => (
            <Icon.Button
              name="arrow-back"
              size={24}
              backgroundColor="transparent"
              underlayColor="transparent"
              color={colors.primary}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      {/* ✅ New ViewAll Screen */}
      <Stack.Screen
        name="ViewAll"
        component={ViewAllScreen}
        options={({ route }) => ({
          title: `All ${route.params.section}`,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      />
    </Stack.Navigator>
  );
}





