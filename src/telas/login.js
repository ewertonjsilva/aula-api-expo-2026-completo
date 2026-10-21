import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Link, useNavigation } from '@react-navigation/native';
import api from '../services/api';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function entrar() {
        if (!email.trim() || !senha) {
            setErro('Informe seu e-mail e sua senha.');
            return;
        }

        setErro('');
        setCarregando(true);

        try {
            const response = await api.get('/login', {
                params: { email: email.trim(), senha },
            });
            const resultado = response.data;

            if (!resultado?.sucesso || !resultado.dados?.id) {
                setErro(resultado?.mensagem || 'Não foi possível entrar.');
                return;
            }

            navigation.replace('myTab', {
                user: { ...resultado.dados, email: email.trim() },
            });
        } catch (error) {
            setErro(error.response?.data?.mensagem || 'Falha ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 14, backgroundColor: '#f4f7f5' }}>
            <Text style={{ color: '#193b32', fontSize: 30, fontWeight: '700' }}>Entrar</Text>
            <TextInput
                accessibilityLabel="E-mail"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="E-mail"
                style={{ backgroundColor: '#fff', borderColor: '#ccd8d2', borderRadius: 8, borderWidth: 1, padding: 14 }}
                value={email}
            />
            <TextInput
                accessibilityLabel="Senha"
                onChangeText={setSenha}
                onSubmitEditing={entrar}
                placeholder="Senha"
                secureTextEntry
                style={{ backgroundColor: '#fff', borderColor: '#ccd8d2', borderRadius: 8, borderWidth: 1, padding: 14 }}
                value={senha}
            />
            {erro ? <Text accessibilityRole="alert" style={{ color: '#b42318' }}>{erro}</Text> : null}
            <Pressable
                accessibilityRole="button"
                disabled={carregando}
                onPress={entrar}
                style={{ alignItems: 'center', backgroundColor: '#176b55', borderRadius: 8, minHeight: 50, justifyContent: 'center' }}
            >
                {carregando
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Acessar o sistema</Text>}
            </Pressable>
            <Link screen="recSenha" style={{ color: '#176b55' }}>Esqueci a senha</Link>
            <Pressable onPress={() => navigation.navigate('cadUsuario')}>
                <Text style={{ color: '#176b55' }}>Cadastrar usuário</Text>
            </Pressable>
        </View>
    );
}