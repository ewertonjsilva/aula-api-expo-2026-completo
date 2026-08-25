import { View, Text, Pressable } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

export default function Login() {

    const navigation = useNavigation();

    return (
        <View>
            <Text>Login</Text>
            <Button screen="myTab">Acessar o sistema</Button>
            <Link screen="recSenha">Esqueci a senha</Link>
            <Pressable 
                onPress={() => navigation.navigate('cadUsuario')}
            >
                <Text>Cadastrar usuário</Text>
            </Pressable>
        </View>
    );
}