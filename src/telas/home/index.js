
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../../services/AuthContext';

import styles from './styles';

export default function Home() {
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Home</Text>
            <Text style={{ color: '#193b32', fontSize: 24, fontWeight: '700', marginTop: 24 }}>
                Olá, {user?.nome || 'usuário'}
            </Text>
            <Text style={{ color: '#52645d', fontSize: 16, marginTop: 8 }}>
                Tipo de acesso: {Number(user?.tipo) === 1
                    ? 'Administrador'
                    : Number(user?.tipo) === 0
                        ? 'Usuário'
                        : `Tipo ${user?.tipo}`}
            </Text>
            <Pressable
                accessibilityRole="button"
                onPress={signOut}
                style={{ alignItems: 'center', backgroundColor: '#176b55', borderRadius: 8, marginTop: 28, paddingHorizontal: 18, paddingVertical: 12 }}
            >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Sair</Text>
            </Pressable>
        </View>
    );
}