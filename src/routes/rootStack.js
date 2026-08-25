import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../telas/home';
import Login from '../telas/login';
import CadUsuario from '../telas/cadUsuario';
import RecSenha from '../telas/recSenha';
import MyTabs from './myTabs';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={
        {
          headerStyle: {
            backgroundColor: '#ffaaff'
          },
        }
      }
    >
      <Stack.Screen
        name="login"
        component={Login}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="myTab"
        component={MyTabs}
        options={{ 
          title: 'Home', 
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="cadUsuario"
        component={CadUsuario}
        options={{ title: 'Cadastro de usuário' }}
      />
      <Stack.Screen
        name="recSenha"
        component={RecSenha}
        options={{
          title: 'My home',
          headerStyle: {
            backgroundColor: '#f4df1e',
          },
          headerTintColor: '#075000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}