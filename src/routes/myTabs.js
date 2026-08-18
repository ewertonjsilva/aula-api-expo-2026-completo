import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 

import HomeScreen from '../telas/home';
import ItensScreen from '../telas/itens';
import PerfilScreen from '../telas/perfil';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="itens" component={ItensScreen} />
      <Tab.Screen name="perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}