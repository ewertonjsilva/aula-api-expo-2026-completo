
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../services/AuthContext';
import api from '../services/api';

export default function Perfil() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ nome: user?.nome || '', email: user?.email || '', dt_nasc: '', senha: '' });
    const [perfilAtual, setPerfilAtual] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState(false);
    const [modalCpfVisivel, setModalCpfVisivel] = useState(false);
    const [cpfDigitado, setCpfDigitado] = useState('');
    const [erroCpf, setErroCpf] = useState('');

    useEffect(() => {
        let ativo = true;

        async function carregarPerfil() {
            setCarregando(true);
            try {
                const response = await api.get('/usuarios');
                const usuarios = response.data?.dados || [];
                const registro = usuarios.find(item => String(item.usu_id ?? item.id) === String(user.id));

                if (!registro) throw new Error('Não foi possível localizar os dados deste usuário.');
                if (!ativo) return;

                const dados = {
                    id: registro.usu_id ?? registro.id,
                    nome: registro.usu_nome ?? registro.nome ?? user.nome ?? '',
                    email: registro.usu_email ?? registro.email ?? user.email ?? '',
                    cpf: registro.usu_cpf ?? registro.cpf,
                    dt_nasc: registro.usu_dt_nasc ?? registro.dt_nasc ?? '',
                    tipo: registro.usu_tipo ?? registro.tipo ?? user.tipo,
                    ativo: registro.usu_ativo ?? registro.ativo ?? 1,
                };

                setPerfilAtual(dados);
                setForm({
                    nome: dados.nome,
                    email: dados.email,
                    dt_nasc: dados.dt_nasc ? String(dados.dt_nasc).slice(0, 10) : '',
                    senha: '',
                });
            } catch (error) {
                if (ativo) {
                    setErro(true);
                    setMensagem(error.response?.data?.mensagem || error.message || 'Não foi possível carregar seus dados.');
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarPerfil();
        return () => { ativo = false; };
    }, [user.id, user.nome, user.email, user.tipo]);

    function alterar(campo, valor) {
        setForm(atual => ({ ...atual, [campo]: valor }));
    }

    async function salvar() {
        if (!form.nome.trim() || !form.email.trim() || !form.dt_nasc) {
            setErro(true);
            setMensagem('Preencha nome, e-mail e data de nascimento.');
            return;
        }

        setErro(false);
        setMensagem('');
        setCpfDigitado('');
        setErroCpf('');
        setModalCpfVisivel(true);
    }

    async function confirmarCpf() {
        const cpfNormalizado = valor => String(valor ?? '').replace(/\D/g, '');
        if (!perfilAtual?.cpf || cpfNormalizado(cpfDigitado) !== cpfNormalizado(perfilAtual.cpf)) {
            setErroCpf('O CPF informado não confere. Confira e tente novamente.');
            return;
        }

        const payload = {
            nome: form.nome.trim(),
            email: form.email.trim(),
            dt_nasc: form.dt_nasc,
            cpf: Number(cpfNormalizado(perfilAtual.cpf)),
            tipo: perfilAtual.tipo,
            ativo: perfilAtual.ativo,
        };
        if (form.senha) payload.senha = form.senha;

        setSalvando(true);
        setErroCpf('');
        try {
            const response = await api.patch(`/usuarios/${user.id}`, payload);
            const atualizado = response.data?.dados;
            updateUser({ ...user, ...payload, ...atualizado });
            setForm(atual => ({ ...atual, senha: '' }));
            setPerfilAtual(atual => ({ ...atual, ...payload, ...atualizado }));
            setMensagem(response.data?.mensagem || 'Perfil atualizado com sucesso.');
            setModalCpfVisivel(false);
        } catch (error) {
            setErroCpf(error.response?.data?.mensagem || 'Não foi possível salvar as alterações.');
        } finally {
            setSalvando(false);
        }
    }

    const campos = [
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'E-mail', keyboardType: 'email-address' },
        { key: 'dt_nasc', label: 'Data de nascimento (AAAA-MM-DD)', placeholder: '1998-11-06' },
        { key: 'senha', label: 'Nova senha (opcional)', secureTextEntry: true },
    ];

    return (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 14, backgroundColor: '#f4f7f5', flexGrow: 1 }}>
            <Text style={{ color: '#193b32', fontSize: 26, fontWeight: '700', marginBottom: 4 }}>Meu perfil</Text>
            {carregando ? <ActivityIndicator color="#176b55" /> : campos.map(campo => (
                <View key={campo.key} style={{ gap: 6 }}>
                    <Text style={{ color: '#354940', fontWeight: '600' }}>{campo.label}</Text>
                    <TextInput
                        accessibilityLabel={campo.label}
                        autoCapitalize={campo.key === 'email' ? 'none' : 'sentences'}
                        keyboardType={campo.keyboardType || 'default'}
                        onChangeText={valor => alterar(campo.key, valor)}
                        placeholder={campo.placeholder || campo.label}
                        secureTextEntry={campo.secureTextEntry}
                        style={{ backgroundColor: '#fff', borderColor: '#ccd8d2', borderRadius: 8, borderWidth: 1, padding: 12 }}
                        value={form[campo.key]}
                    />
                </View>
            ))}
            {mensagem ? <Text accessibilityRole="alert" style={{ color: erro ? '#b42318' : '#176b55' }}>{mensagem}</Text> : null}
            <Pressable
                accessibilityRole="button"
                disabled={carregando || salvando || !perfilAtual}
                onPress={salvar}
                style={{ alignItems: 'center', backgroundColor: '#176b55', borderRadius: 8, justifyContent: 'center', minHeight: 48, marginTop: 6, opacity: carregando || !perfilAtual ? 0.6 : 1 }}
            >
                {salvando ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Salvar alterações</Text>}
            </Pressable>
            <Text style={{ color: '#52645d', fontSize: 13 }}>
                Para confirmar qualquer alteração, será necessário informar seu CPF. Ele não aparece neste perfil.
            </Text>
            <Modal
                animationType="fade"
                onRequestClose={() => !salvando && setModalCpfVisivel(false)}
                transparent
                visible={modalCpfVisivel}
            >
                <View style={{ alignItems: 'center', backgroundColor: 'rgba(13, 31, 25, 0.45)', flex: 1, justifyContent: 'center', padding: 24 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, gap: 14, padding: 22, width: '100%', maxWidth: 420 }}>
                        <Text style={{ color: '#193b32', fontSize: 20, fontWeight: '700' }}>Confirmar identidade</Text>
                        <Text style={{ color: '#52645d', lineHeight: 21 }}>
                            Digite seu CPF para confirmar e enviar as alterações do perfil.
                        </Text>
                        <TextInput
                            accessibilityLabel="Confirme seu CPF"
                            autoFocus
                            keyboardType="numeric"
                            onChangeText={valor => { setCpfDigitado(valor); setErroCpf(''); }}
                            onSubmitEditing={confirmarCpf}
                            placeholder="CPF"
                            style={{ backgroundColor: '#fff', borderColor: '#ccd8d2', borderRadius: 8, borderWidth: 1, padding: 12 }}
                            value={cpfDigitado}
                        />
                        {erroCpf ? <Text accessibilityRole="alert" style={{ color: '#b42318' }}>{erroCpf}</Text> : null}
                        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
                            <Pressable
                                accessibilityRole="button"
                                disabled={salvando}
                                onPress={() => setModalCpfVisivel(false)}
                                style={{ borderColor: '#ccd8d2', borderRadius: 8, borderWidth: 1, justifyContent: 'center', minHeight: 44, paddingHorizontal: 16 }}
                            >
                                <Text style={{ color: '#354940', fontWeight: '600' }}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                                accessibilityRole="button"
                                disabled={salvando}
                                onPress={confirmarCpf}
                                style={{ alignItems: 'center', backgroundColor: '#176b55', borderRadius: 8, justifyContent: 'center', minHeight: 44, minWidth: 105, paddingHorizontal: 16 }}
                            >
                                {salvando ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Confirmar</Text>}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}