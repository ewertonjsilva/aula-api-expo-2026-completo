
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function Itens() {
    const [produtos, setProdutos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [erro, setErro] = useState('');

    async function carregarProdutos(proximaPagina = 1, anexar = false) {
        if (anexar) setCarregandoMais(true);
        else setCarregando(true);
        setErro('');

        try {
            const response = await api.get('/produtos/aleatorios?quantidade=6', {
                params: { page: proximaPagina, limit: 5 },
            });
            const novosProdutos = response.data?.dados || [];
            const totalApi = Number(response.headers['x-total-count']);

            setProdutos(atual => anexar ? [...atual, ...novosProdutos] : novosProdutos);
            setPagina(proximaPagina);
            setTotal(Number.isFinite(totalApi) && totalApi >= 0
                ? totalApi
                : (anexar ? produtos.length : 0) + novosProdutos.length);
        } catch (error) {
            setErro(error.response?.data?.mensagem || 'Não foi possível carregar os produtos.');
        } finally {
            setCarregando(false);
            setCarregandoMais(false);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    function renderProduto({ item }) {
        const icone = String(item.icone || '').toLowerCase().includes('lanche')
            ? 'fast-food-outline'
            : 'restaurant-outline';
        const valor = Number(item.valor);
        let imagemProduto = item.imgProduto;

        if (imagemProduto) {
            try {
                const urlImagem = new URL(imagemProduto);
                const urlApi = new URL(api.defaults.baseURL);

                if (urlImagem.hostname === 'localhost' || urlImagem.hostname === '127.0.0.1') {
                    urlImagem.hostname = urlApi.hostname;
                    urlImagem.port = urlApi.port;
                    imagemProduto = urlImagem.toString();
                }
            } catch {
                imagemProduto = null;
            }
        }

        return (
            <View style={{ backgroundColor: '#fff', borderColor: '#dce5e0', borderRadius: 8, borderWidth: 1, flexDirection: 'row', gap: 14, marginBottom: 12, padding: 16 }}>
                {imagemProduto ? (
                    <Image
                        accessibilityLabel={`Imagem de ${item.nome}`}
                        resizeMode="cover"
                        source={{ uri: imagemProduto }}
                        style={{ backgroundColor: '#e8f2ed', borderRadius: 8, height: 88, width: 88 }}
                    />
                ) : null}
                <View style={{ flex: 1, gap: 5 }}>
                    <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
                        <View style={{ alignItems: 'flex-start', flex: 1, flexDirection: 'row', gap: 6 }}>
                            <Ionicons name={icone} size={20} color="#176b55" />
                            <Text style={{ color: '#193b32', flex: 1, fontSize: 16, fontWeight: '700' }}>{item.nome}</Text>
                        </View>
                        <Text style={{ color: '#176b55', fontSize: 15, fontWeight: '700' }}>
                            {Number.isFinite(valor) ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : item.valor}
                        </Text>
                    </View>
                    <Text style={{ color: '#52645d', lineHeight: 20 }}>{item.descricao}</Text>
                    <Text style={{ color: '#73827b', fontSize: 13 }}>Unidade: {item.unidade}</Text>
                </View>
            </View>
        );
    }

    const temMais = total === null ? produtos.length >= 5 : produtos.length < total;

    return (
        <FlatList
            contentContainerStyle={{ backgroundColor: '#f4f7f5', flexGrow: 1, padding: 20 }}
            data={produtos}
            keyExtractor={item => String(item.id)}
            ListEmptyComponent={!carregando ? (
                <View style={{ alignItems: 'center', gap: 10, paddingVertical: 48 }}>
                    <Ionicons name="basket-outline" size={34} color="#73827b" />
                    <Text style={{ color: '#52645d' }}>{erro ? 'A lista não pôde ser carregada.' : 'Nenhum produto disponível.'}</Text>
                    {erro ? (
                        <Pressable accessibilityRole="button" onPress={() => carregarProdutos()}>
                            <Text style={{ color: '#176b55', fontWeight: '600' }}>Tentar novamente</Text>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}
            ListFooterComponent={carregando ? (
                <ActivityIndicator color="#176b55" style={{ padding: 20 }} />
            ) : erro && produtos.length ? (
                <View style={{ alignItems: 'center', gap: 10, paddingVertical: 16 }}>
                    <Text accessibilityRole="alert" style={{ color: '#b42318', textAlign: 'center' }}>{erro}</Text>
                    <Pressable accessibilityRole="button" onPress={() => carregarProdutos(pagina + 1, true)}>
                        <Text style={{ color: '#176b55', fontWeight: '600' }}>Tentar novamente</Text>
                    </Pressable>
                </View>
            ) : temMais && produtos.length ? (
                <Pressable
                    accessibilityRole="button"
                    disabled={carregandoMais}
                    onPress={() => carregarProdutos(pagina + 1, true)}
                    style={{ alignItems: 'center', borderColor: '#176b55', borderRadius: 8, borderWidth: 1, justifyContent: 'center', minHeight: 46, opacity: carregandoMais ? 0.7 : 1 }}
                >
                    {carregandoMais
                        ? <ActivityIndicator color="#176b55" />
                        : <Text style={{ color: '#176b55', fontWeight: '600' }}>Carregar mais produtos</Text>}
                </Pressable>
            ) : null}
            ListHeaderComponent={(
                <View style={{ gap: 6, marginBottom: 18 }}>
                    <Text style={{ color: '#193b32', fontSize: 28, fontWeight: '700' }}>Produtos</Text>
                    <Text style={{ color: '#52645d' }}>Confira os itens disponíveis.</Text>
                    {erro && !produtos.length ? <Text accessibilityRole="alert" style={{ color: '#b42318' }}>{erro}</Text> : null}
                </View>
            )}
            refreshControl={<RefreshControl colors={['#176b55']} onRefresh={() => carregarProdutos()} refreshing={carregando && produtos.length > 0} />}
            renderItem={renderProduto}
        />
    );
}