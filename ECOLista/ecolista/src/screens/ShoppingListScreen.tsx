// src/screens/ShoppingListScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';

interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  checked: boolean;
  healthIndicator?: "good" | "warning" | "alert";
}

interface ItemFrequente {
  name: string;
  category: string;
  price: number;
  healthIndicator: "good" | "warning" | "alert";
  count: number;
}

const CATEGORIAS_DISPONIVEIS = [
  { label: '🍎 Hortifrúti (Frutas & Legumes)', defaultHealth: 'good' as const },
  { label: '🥩 Carnes, Aves & Peixes', defaultHealth: 'good' as const },
  { label: '🧀 Frios, Laticínios & Ovos', defaultHealth: 'warning' as const },
  { label: '🌾 Mercearia (Arroz, Feijão & Massas)', defaultHealth: 'good' as const },
  { label: '☕ Café, Açúcar & Matinais', defaultHealth: 'warning' as const },
  { label: '🍞 Pães, Bolos & Biscoitos', defaultHealth: 'warning' as const },
  { label: '🥫 Enlatados, Óleos & Condimentos', defaultHealth: 'warning' as const },
  { label: '❄️ Congelados & Pratos Prontos', defaultHealth: 'alert' as const },
  { label: '🥤 Bebidas (Sucos, Água & Cervejas/Refris)', defaultHealth: 'alert' as const },
  { label: '🧹 Limpeza & Utilidades Domésticas', defaultHealth: 'good' as const },
  { label: '🧼 Higiene Pessoal & Perfumaria', defaultHealth: 'good' as const },
  { label: '🐶 Pet Shop', defaultHealth: 'good' as const },
  { label: '🛒 Outros / Geral', defaultHealth: 'good' as const },
];

export function ShoppingListScreen({ route, navigation }: any) {
  const { listId, listName, listBudget } = route.params || { listId: '1', listName: 'Lista', listBudget: 0 };
  
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState(CATEGORIAS_DISPONIVEIS[0].label);
  const [itemPrice, setItemPrice] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [sugestoesFrequentes, setSugestoesFrequentes] = useState<ItemFrequente[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'listas', listId, 'itens'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedItems: Item[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedItems.push({
          id: docSnap.id,
          name: data.name || data.nome,
          category: data.category || 'Geral',
          price: Number(data.price || data.preco || 0),
          checked: !!data.checked,
          healthIndicator: data.healthIndicator || 'good',
        });
      });
      setItems(loadedItems);
    });

    // Mapeamento otimizado de frequência em todas as listas
    const carregarItensFrequentes = async () => {
      try {
        const listasSnap = await getDocs(collection(db, 'listas'));
        const mapFrequencia: { [key: string]: { count: number; category: string; price: number; healthIndicator: any } } = {};

        for (const listaDoc of listasSnap.docs) {
          const itensSnap = await getDocs(collection(db, 'listas', listaDoc.id, 'itens'));
          itensSnap.forEach((itemDoc) => {
            const data = itemDoc.data();
            const nomeKey = (data.name || data.nome || '').trim().toLowerCase();
            if (nomeKey) {
              if (!mapFrequencia[nomeKey]) {
                mapFrequencia[nomeKey] = {
                  count: 0,
                  category: data.category || 'Geral',
                  price: Number(data.price || data.preco || 0),
                  healthIndicator: data.healthIndicator || 'good',
                };
              }
              mapFrequencia[nomeKey].count += 1; // Incrementa contagem a cada vez que o item aparece em qualquer lista
            }
          });
        }

        const frequentesOrdenados: ItemFrequente[] = Object.keys(mapFrequencia)
          .map((nome) => ({
            name: nome.charAt(0).toUpperCase() + nome.slice(1),
            category: mapFrequencia[nome].category,
            price: mapFrequencia[nome].price,
            healthIndicator: mapFrequencia[nome].healthIndicator,
            count: mapFrequencia[nome].count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6); // Top 6 mais frequentes

        setSugestoesFrequentes(frequentesOrdenados);
      } catch (e) {
        console.error('Erro ao carregar frequentes:', e);
      }
    };

    carregarItensFrequentes();

    return () => unsubscribe();
  }, [listId]);

  const analisarSaude = (nome: string, categoria: string): "good" | "warning" | "alert" => {
    const n = nome.toLowerCase();
    if (n.includes('refrigerante') || n.includes('açúcar refinado') || n.includes('salgadinho') || n.includes('energético') || n.includes('cerveja')) return 'alert';
    if (n.includes('biscoito') || n.includes('chocolate') || n.includes('margarina') || n.includes('recheado') || n.includes('salsicha') || n.includes('presunto')) return 'warning';

    const catEncontrada = CATEGORIAS_DISPONIVEIS.find(c => c.label === categoria);
    return catEncontrada ? catEncontrada.defaultHealth : 'good';
  };

  const addItem = async (nome?: string, categoria?: string, preco?: number) => {
    const nomeFinal = nome || itemName;
    const catFinal = categoria || itemCategory;
    const precoFinal = preco !== undefined ? preco : Number(itemPrice.replace(',', '.'));

    if (!nomeFinal.trim() || isNaN(precoFinal) || precoFinal <= 0) {
      Alert.alert('Atenção', 'Informe o nome e um preço válido para o item!');
      return;
    }

    const totalAtual = items.reduce((sum, i) => sum + i.price, 0);
    const novoTotal = totalAtual + precoFinal;
    const limiteOrcamento = Number(listBudget || 0);

    if (limiteOrcamento > 0 && novoTotal > limiteOrcamento) {
      Alert.alert(
        '⚠️ Orçamento Estourado!',
        `Este item fará o gasto total (R$ ${novoTotal.toFixed(2)}) ultrapassar o limite estabelecido de R$ ${limiteOrcamento.toFixed(2)}.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Adicionar Mesmo Assim', style: 'destructive', onPress: async () => await salvarItemNoBanco(nomeFinal, catFinal, precoFinal) }
        ]
      );
      return;
    }

    await salvarItemNoBanco(nomeFinal, catFinal, precoFinal);
  };

  const salvarItemNoBanco = async (nome: string, categoria: string, preco: number) => {
    try {
      await addDoc(collection(db, 'listas', listId, 'itens'), {
        name: nome.trim(),
        category: categoria,
        price: preco,
        checked: false,
        healthIndicator: analisarSaude(nome, categoria)
      });
      setItemName('');
      setItemPrice('');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleItem = async (id: string, checked: boolean) => {
    await updateDoc(doc(db, 'listas', listId, 'itens', id), { checked: !checked });
  };

  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, 'listas', listId, 'itens', id));
  };

  const salvarComoTemplate = async () => {
    if (items.length === 0) {
      Alert.alert('Atenção', 'Adicione itens à lista antes de salvá-la como modelo.');
      return;
    }

    try {
      await addDoc(collection(db, 'templates_listas'), {
        tituloTemplate: listName,
        orcamentoBase: listBudget,
        itens: items.map(i => ({ name: i.name, category: i.category, price: i.price, healthIndicator: i.healthIndicator })),
        dataCriacao: new Date().toISOString()
      });
      Alert.alert('Sucesso! 🌟', `A lista "${listName}" foi salva como modelo para suas compras futuras.`);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar o modelo.');
    }
  };

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const checkedTotal = items.reduce((sum, i) => (i.checked ? sum + i.price : sum), 0);
  const limite = Number(listBudget || 0);
  const estourou = limite > 0 && total > limite;

  const getHealthColor = (ind?: string) => ind === 'good' ? '#10b981' : ind === 'warning' ? '#fbbf24' : '#ef4444';
  const getHealthMessage = (ind?: string) => ind === 'good' ? '✓ Boa escolha' : ind === 'warning' ? '⚠ Com moderação' : '⚠ Alto em açúcar/sódio';

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' }}>
                <Text>← Voltar</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e293b' }} numberOfLines={1}>{listName}</Text>
              
              <TouchableOpacity onPress={salvarComoTemplate} style={{ padding: 8, backgroundColor: '#fef3c7', borderRadius: 8, borderWidth: 1, borderColor: '#eab308' }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#b45309' }}>💾 Salvar Modelo</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.formContainer, estourou && { backgroundColor: '#fef2f2', borderColor: '#ef4444', borderWidth: 2 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, color: estourou ? '#dc2626' : '#64748b', fontWeight: estourou ? 'bold' : 'normal' }}>
                    {estourou ? '🔴 ORÇAMENTO ESTOURADO!' : `Total da lista (Limite: R$ ${limite.toFixed(2)})`}
                  </Text>
                  <Text style={{ fontSize: 26, fontWeight: 'bold', color: estourou ? '#dc2626' : '#1e293b' }}>R$ {total.toFixed(2)}</Text>
                  {checkedTotal > 0 && <Text style={{ fontSize: 13, color: '#22c55e', marginTop: 2 }}>Marcados: R$ {checkedTotal.toFixed(2)}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: estourou ? '#ef4444' : '#22c55e' }}>{items.length}</Text>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>itens</Text>
                </View>
              </View>
            </View>

            {sugestoesFrequentes.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>⚡ Adicionar Rápido (Mais Frequentes):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {sugestoesFrequentes.map((freq, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => addItem(freq.name, freq.category, freq.price)}
                        style={{
                          backgroundColor: '#f0fdf4',
                          borderWidth: 1,
                          borderColor: '#22c55e',
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: 'bold' }}>+ {freq.name}</Text>
                        <Text style={{ fontSize: 11, color: '#64748b' }}>(R$ {freq.price.toFixed(2)})</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={styles.formContainer}>
              <Text style={styles.sectionHeader}>Novo Produto</Text>
              
              <TextInput 
                style={styles.input} 
                placeholder="Nome do produto (ex: Fardo de Arroz 5kg)" 
                placeholderTextColor="#888" 
                value={itemName} 
                onChangeText={setItemName} 
              />

              <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: '500' }}>Selecione a Seção / Categoria:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {CATEGORIAS_DISPONIVEIS.map((cat, index) => {
                    const selecionado = itemCategory === cat.label;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setItemCategory(cat.label)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 20,
                          backgroundColor: selecionado ? '#22c55e' : '#f1f5f9',
                          borderWidth: 1,
                          borderColor: selecionado ? '#16a34a' : '#cbd5e1',
                        }}
                      >
                        <Text style={{ fontSize: 13, color: selecionado ? '#fff' : '#475569', fontWeight: selecionado ? 'bold' : 'normal' }}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <TextInput 
                style={[styles.input, { height: 48, marginBottom: 0 }]} 
                placeholder="Preço R$ (ex: 45.90)" 
                placeholderTextColor="#888" 
                keyboardType="numeric" 
                value={itemPrice} 
                onChangeText={setItemPrice} 
              />

              <TouchableOpacity style={[styles.primaryButton, { marginTop: 14 }]} onPress={() => addItem()}>
                <Text style={styles.buttonText}>+ Inserir na Lista</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.listTitle}>Produtos na Compra:</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenhum produto adicionado nesta lista ainda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.itemCard, item.checked && { opacity: 0.6, backgroundColor: '#f9f9f9' }]}>
            <TouchableOpacity 
              style={[styles.checkboxNative, { backgroundColor: item.checked ? '#22c55e' : 'transparent', borderColor: item.checked ? '#22c55e' : '#cbd5e1' }]}
              onPress={() => toggleItem(item.id, item.checked)}
            >
              {item.checked && <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
            </TouchableOpacity>

            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={[styles.itemTitle, item.checked && { textDecorationLine: 'line-through', color: '#888' }]}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                <Text style={{ fontSize: 11, color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>{item.category}</Text>
                {item.healthIndicator && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getHealthColor(item.healthIndicator) }} />
                    <Text style={{ fontSize: 11, color: '#64748b' }}>
                      {getHealthMessage(item.healthIndicator)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemTitle}>R$ {item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  flatListContent: { padding: 20, paddingBottom: 50 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0', elevation: 2 },
  input: { minHeight: 48, backgroundColor: '#fafafa', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ddd', fontSize: 15, color: '#333' },
  primaryButton: { height: 48, backgroundColor: '#22c55e', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  itemCard: { backgroundColor: '#fff', flexDirection: 'row', padding: 14, borderRadius: 10, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 1 },
  checkboxNative: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
});