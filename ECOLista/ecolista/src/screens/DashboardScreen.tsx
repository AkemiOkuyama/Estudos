// src/screens/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs } from 'firebase/firestore';

interface Lista {
  id: string;
  name: string;
  orcamento: number;
  totalGasto: number;
  date: string;
}

export function DashboardScreen({ navigation }: any) {
  const [newListName, setNewListName] = useState('');
  const [newListBudget, setNewListBudget] = useState('');
  const [listas, setListas] = useState<Lista[]>([]);
  const [gastoTotalGeral, setGastoTotalGeral] = useState(0);
  const [orcamentoTotalGeral, setOrcamentoTotalGeral] = useState(2000);

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'configuracoes', 'usuario'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().monthlyBudget) {
        setOrcamentoTotalGeral(Number(docSnap.data().monthlyBudget));
      }
    });

    const q = query(collection(db, 'listas'), orderBy('dataCriacao', 'desc'));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const listasCriadas: Lista[] = [];
      let somaGastosReais = 0;

      for (const documento of querySnapshot.docs) {
        const data = documento.data();
        const listaId = documento.id;
        const orcamentoLista = Number(data.orcamento || 0);

        // Buscar itens e somar o total gasto nesta lista específica
        const itensSnapshot = await getDocs(collection(db, 'listas', listaId, 'itens'));
        let totalListaAtual = 0;
        itensSnapshot.forEach((itemDoc) => {
          const itemData = itemDoc.data();
          totalListaAtual += Number(itemData.price || itemData.preco || 0);
        });

        somaGastosReais += totalListaAtual;

        listasCriadas.push({
          id: listaId,
          name: data.titulo || data.name || 'Lista de Compras',
          orcamento: orcamentoLista,
          totalGasto: totalListaAtual,
          date: 'Recente',
        });
      }

      setListas(listasCriadas);
      setGastoTotalGeral(somaGastosReais);
    });

    return () => {
      unsubConfig();
      unsubscribe();
    };
  }, []);

  const criarLista = async () => {
    if (!newListName.trim() || !newListBudget.trim()) {
      Alert.alert('Atenção', 'Preencha o nome da lista e o orçamento limite!');
      return;
    }

    try {
      await addDoc(collection(db, 'listas'), {
        titulo: newListName.trim(),
        orcamento: Number(newListBudget.replace(',', '.')),
        dataCriacao: new Date().toISOString()
      });

      setNewListName('');
      setNewListBudget('');
    } catch (error) {
      console.error('Erro ao salvar lista: ', error);
    }
  };

  const excluirLista = async (id: string, nome: string) => {
    Alert.alert('Excluir Lista', `Deseja apagar "${nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => await deleteDoc(doc(db, 'listas', id)) }
    ]);
  };

  const spentPercentage = orcamentoTotalGeral > 0 ? (gastoTotalGeral / orcamentoTotalGeral) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={listas}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={styles.sproutBadge}>
                <Text style={{ fontSize: 36 }}>🌱</Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={styles.heroMainTitle}>
                Planeje com estratégia, <Text style={{ color: '#22c55e' }}>compre com economia.</Text>
              </Text>
              <Text style={styles.heroMainSubtitle}>
                Organize seus produtos, controle seus gastos e domine sua rotina com o EcoLista.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.sectionHeader}>Nova Lista de Compras</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome da Lista (ex: Compras da Semana)"
                placeholderTextColor="#888"
                value={newListName}
                onChangeText={setNewListName}
              />
              <TextInput
                style={styles.input}
                placeholder="Orçamento Limite (R$)"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={newListBudget}
                onChangeText={setNewListBudget}
              />
              <TouchableOpacity style={styles.primaryButton} onPress={criarLista}>
                <Text style={styles.buttonText}>+ Criar Nova Lista</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.boxTitle}>Resumo Geral (Em Tempo Real)</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <Text style={{ color: '#64748b' }}>Gasto total acumulado</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b' }}>R$ {gastoTotalGeral.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, color: '#64748b' }}>Limite mensal (Perfil)</Text>
                <Text style={{ fontSize: 13, color: '#64748b' }}>R$ {orcamentoTotalGeral.toFixed(2)}</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${Math.min(spentPercentage, 100)}%`,
                      backgroundColor: spentPercentage <= 80 ? '#22c55e' : spentPercentage <= 100 ? '#eab308' : '#ef4444'
                    }
                  ]}
                />
              </View>
              <Text style={{ fontSize: 13, color: spentPercentage > 100 ? '#ef4444' : '#64748b', marginTop: 8, fontWeight: spentPercentage > 100 ? 'bold' : 'normal' }}>
                {listas.length === 0 
                  ? "🌱 Comece criando sua primeira lista acima!" 
                  : spentPercentage <= 80 
                  ? "✓ Seus gastos estão equilibrados!" 
                  : spentPercentage <= 100 
                  ? "⚠ Atenção: próximo ao limite do orçamento" 
                  : "🔴 Alerta: Orçamento total estourado!"}
              </Text>
            </View>

            <Text style={styles.listTitle}>Suas Listas Ativas:</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenhuma lista cadastrada ainda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('ShoppingList', { listId: item.id, listName: item.name, listBudget: item.orcamento })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={{ backgroundColor: '#fef3c7', padding: 10, borderRadius: 10 }}>
                    <Text style={{ fontSize: 18 }}>🛒</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                    {/* Prévia exibindo o total gasto na lista vs o limite */}
                    <Text style={styles.cardDate}>
                      Gasto: R$ {item.totalGasto.toFixed(2)} / Limite: R$ {item.orcamento.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={() => excluirLista(item.id, item.name)}>
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
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
  headerContainer: { width: '100%' },
  sproutBadge: { backgroundColor: '#22c55e', borderRadius: 40, width: 80, height: 80, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  heroMainTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', lineHeight: 36, marginBottom: 8 },
  heroMainSubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  boxTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0', elevation: 2 },
  input: { minHeight: 48, backgroundColor: '#fafafa', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ddd', fontSize: 15, color: '#333' },
  primaryButton: { height: 48, backgroundColor: '#22c55e', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  cardWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  card: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 10, borderLeftWidth: 5, borderLeftColor: '#22c55e', elevation: 2, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  cardDate: { fontSize: 12, color: '#64748b', marginTop: 2, fontWeight: '500' },
  deleteButton: { backgroundColor: '#ffebee', justifyContent: 'center', alignItems: 'center', width: 48, height: 48, borderRadius: 10, marginLeft: 10, borderWidth: 1, borderColor: '#ffcdd2' },
  deleteButtonText: { color: '#c62828', fontSize: 16, fontWeight: 'bold' },
  progressBarBackground: { width: '100%', backgroundColor: '#e2e8f0', borderRadius: 8, height: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 8 },
});