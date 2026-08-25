import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// npm i @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../telas/home';
import PerfilScreen from '../telas/perfil';
import ItensScreen from '../telas/itens';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarShowLabel: false, // Oculta o texto de todas as abas
        // tabBarLabelPosition: 'beside-icon' 
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: 'Georgia',
          fontWeight: 300,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Define o ícone baseado no nome da rota
          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'itens') {
            iconName = focused ? 'list' : 'list-outline';
          }

          // Retorna o componente visual do ícone
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Define as cores personalizadas que você quer usar
        tabBarActiveTintColor: '#00FF00',   // Cor quando focado (focused)
        tabBarInactiveTintColor: '#FF0000', // Cor quando desfocado
        // headerShown: false,
      })}      
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        // options={{ tabBarShowLabel: false }} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen name="perfil" component={PerfilScreen} />
      <Tab.Screen name="itens" component={ItensScreen} />
    </Tab.Navigator>
  );
}