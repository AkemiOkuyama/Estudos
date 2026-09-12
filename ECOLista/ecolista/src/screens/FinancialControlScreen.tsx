// src/screens/FinancialControlScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot, getDocs, doc } from 'firebase/firestore';

export function FinancialControlScreen() {
  const [gastoTotalReal, setGastoTotalReal] = useState(0);
  const [orcamentoTotalReal, setOrcamentoTotalReal] = useState(2000);
  const [totalListas, setTotalListas] = useState(0);

  useEffect(() => {
    // 1. Escutar alterações no orçamento definido no Perfil (Firestore)
    const unsubConfig = onSnapshot(doc(db, 'configuracoes', 'usuario'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().monthlyBudget) {
        setOrcamentoTotalReal(Number(docSnap.data().monthlyBudget));
      }
    });

    // 2. Escutar alterações nas listas e itens para calcular os gastos reais
    const unsubListas = onSnapshot(collection(db, 'listas'), async (snapshot) => {
      let somaGastos = 0;
      setTotalListas(snapshot.size);

      for (const docSnap of snapshot.docs) {
        const itensSnap = await getDocs(collection(db, 'listas', docSnap.id, 'itens'));
        itensSnap.forEach((item) => {
          somaGastos += Number(item.data().price || item.data().preco || 0);
        });
      }

      setGastoTotalReal(somaGastos);
    });

    return () => {
      unsubConfig();
      unsubListas();
    };
  }, []);

  const remaining = orcamentoTotalReal - gastoTotalReal;
  const spentPercentage = orcamentoTotalReal > 0 ? (gastoTotalReal / orcamentoTotalReal) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.flatListContent}>
        <Text style={styles.title}>Controle Financeiro</Text>
        <Text style={styles.subtitle}>Acompanhe seus gastos reais com alimentação</Text>

        <View style={styles.formContainer}>
          <Text style={styles.boxTitle}>Orçamento Total (Sincronizado)</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <Text style={{ color: '#64748b' }}>Gasto total acumulado</Text>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#1e293b' }}>R$ {gastoTotalReal.toFixed(2)}</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(spentPercentage, 100)}%`, backgroundColor: spentPercentage > 100 ? '#ef4444' : '#22c55e' }]} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ fontSize: 13, color: '#64748b' }}>Orçamento: R$ {orcamentoTotalReal.toFixed(2)}</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: spentPercentage > 100 ? '#ef4444' : '#22c55e' }}>{spentPercentage.toFixed(0)}% usado</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
            <View>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Disponível</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: remaining < 0 ? '#ef4444' : '#22c55e' }}>R$ {remaining.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Listas cadastradas</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' }}>{totalListas}</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={[styles.heroTitle, { fontSize: 18 }]}>💡 Sincronização em Tempo Real</Text>
          <Text style={styles.heroSubtitle}>O teto orçamentário configurado na sua aba de Perfil atualiza automaticamente todos os cálculos de progresso e saldo disponível aqui no Controle Financeiro.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafafa' },
  flatListContent: { padding: 20, paddingBottom: 50 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#22c55e', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  boxTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0', elevation: 2 },
  heroCard: { backgroundColor: '#22c55e', padding: 20, borderRadius: 14, marginBottom: 20, elevation: 3 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: '#e8f5e9', lineHeight: 18 },
  progressBarBackground: { width: '100%', backgroundColor: '#e2e8f0', borderRadius: 8, height: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 8 },
});