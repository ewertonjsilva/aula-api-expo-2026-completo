
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

export default function CadUsuario() {
    const navigation = useNavigation();
    const [form, setForm] = useState({ nome: '', email: '', dt_nasc: '', cpf: '', senha: '', confirmarSenha: '' });
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    function alterar(campo, valor) {
        setForm(atual => ({ ...atual, [campo]: valor }));
        setErro('');
        setSucesso('');
    }

    async function cadastrar() {
        const cpf = form.cpf.replace(/\D/g, '');
        const data = form.dt_nasc.trim();
        const [dia, mes, ano] = data.split('/').map(Number);
        const dataValida = /^\d{2}\/\d{2}\/\d{4}$/.test(data)
            && new Date(ano, mes - 1, dia).getFullYear() === ano
            && new Date(ano, mes - 1, dia).getMonth() === mes - 1
            && new Date(ano, mes - 1, dia).getDate() === dia;
        const dataApi = dataValida
            ? `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
            : '';

        if (!form.nome.trim() || !form.email.trim() || !data || !cpf || !form.senha || !form.confirmarSenha) {
            setErro('Preencha todos os campos.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setErro('Informe um e-mail válido.');
            return;
        }
        if (!dataValida) {
            setErro('Informe uma data válida no formato DD/MM/AAAA.');
            return;
        }
        if (dataApi > new Date().toISOString().slice(0, 10)) {
            setErro('A data de nascimento não pode estar no futuro.');
            return;
        }
        if (cpf.length !== 11) {
            setErro('O CPF deve conter 11 números.');
            return;
        }
        if (form.senha !== form.confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setErro('');
        setCarregando(true);
        try {
            const response = await api.post('/usuarios', {
                nome: form.nome.trim(),
                email: form.email.trim(),
                dt_nasc: dataApi,
                senha: form.senha,
                tipo: 0,
                cpf,
            });

            if (!response.data?.sucesso) {
                setErro(response.data?.mensagem || 'Não foi possível concluir o cadastro.');
                return;
            }
            setSucesso(response.data.mensagem || 'Cadastro realizado com sucesso.');
            setForm({ nome: '', email: '', dt_nasc: '', cpf: '', senha: '', confirmarSenha: '' });
        } catch (error) {
            setErro(error.response?.data?.mensagem || 'Falha ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    }

    const campos = [
        { key: 'nome', label: 'Nome completo', placeholder: 'Seu nome' },
        { key: 'email', label: 'E-mail', placeholder: 'voce@exemplo.com', keyboardType: 'email-address', autoCapitalize: 'none' },
        { key: 'dt_nasc', label: 'Data de nascimento', placeholder: 'DD/MM/AAAA', keyboardType: 'numeric', maxLength: 10 },
        { key: 'cpf', label: 'CPF', placeholder: 'Somente números', keyboardType: 'numeric', maxLength: 11 },
        { key: 'senha', label: 'Senha', placeholder: 'Crie uma senha', secureTextEntry: true },
        { key: 'confirmarSenha', label: 'Confirmar senha', placeholder: 'Digite a senha novamente', secureTextEntry: true },
    ];

    return (
        <ScrollView
            contentContainerStyle={{ backgroundColor: '#f4f7f5', flexGrow: 1, gap: 14, padding: 24 }}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={{ color: '#193b32', fontSize: 28, fontWeight: '700' }}>Criar conta</Text>
            <Text style={{ color: '#52645d', lineHeight: 21 }}>Preencha seus dados para se cadastrar como usuário.</Text>
            {campos.map((campo, indice) => (
                <View key={campo.key} style={{ gap: 6 }}>
                    <Text style={{ color: '#354940', fontWeight: '600' }}>{campo.label}</Text>
                    <TextInput
                        accessibilityLabel={campo.label}
                        autoCapitalize={campo.autoCapitalize || 'sentences'}
                        autoComplete={campo.key === 'email' ? 'email' : campo.key === 'senha' || campo.key === 'confirmarSenha' ? 'new-password' : 'off'}
                        keyboardType={campo.keyboardType || 'default'}
                        maxLength={campo.maxLength}
                        onChangeText={valor => {
                            if (campo.key === 'cpf') {
                                alterar(campo.key, valor.replace(/\D/g, ''));
                                return;
                            }
                            if (campo.key === 'dt_nasc') {
                                const numeros = valor.replace(/\D/g, '').slice(0, 8);
                                const dataFormatada = numeros.length > 4
                                    ? `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`
                                    : numeros.length > 2
                                        ? `${numeros.slice(0, 2)}/${numeros.slice(2)}`
                                        : numeros;
                                alterar(campo.key, dataFormatada);
                                return;
                            }
                            alterar(campo.key, valor);
                        }}
                        onSubmitEditing={indice === campos.length - 1 ? cadastrar : undefined}
                        placeholder={campo.placeholder}
                        returnKeyType={indice === campos.length - 1 ? 'done' : 'next'}
                        secureTextEntry={campo.secureTextEntry}
                        style={{ backgroundColor: '#fff', borderColor: '#ccd8d2', borderRadius: 8, borderWidth: 1, padding: 14 }}
                        value={form[campo.key]}
                    />
                </View>
            ))}
            {erro ? <Text accessibilityRole="alert" style={{ color: '#b42318' }}>{erro}</Text> : null}
            <Pressable
                accessibilityRole="button"
                disabled={carregando}
                onPress={cadastrar}
                style={{ alignItems: 'center', backgroundColor: '#176b55', borderRadius: 8, justifyContent: 'center', minHeight: 50, opacity: carregando ? 0.7 : 1 }}
            >
                {carregando
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Cadastrar</Text>}
            </Pressable>
            <Modal
                accessibilityViewIsModal
                animationType="fade"
                onRequestClose={() => navigation.replace('login')}
                transparent
                visible={Boolean(sucesso)}
            >
                <View style={{ alignItems: 'center', backgroundColor: 'rgba(13, 31, 25, 0.45)', flex: 1, justifyContent: 'center', padding: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, gap: 16, maxWidth: 420, padding: 24, width: '100%' }}>
                        <Text style={{ color: '#193b32', fontSize: 21, fontWeight: '700' }}>Cadastro efetuado</Text>
                        <Text accessibilityRole="alert" style={{ color: '#354940', lineHeight: 22 }}>{sucesso}</Text>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => navigation.replace('login')}
                            style={{ alignItems: 'center', backgroundColor: '#176b55', borderRadius: 8, justifyContent: 'center', minHeight: 48 }}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>Ir para o login</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}