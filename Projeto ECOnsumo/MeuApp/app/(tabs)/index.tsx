import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function DashboardScreen() {
  const meses = [
    { nome: 'Jan', valor: 120 }, { nome: 'Fev', valor: 150 },
    { nome: 'Mar', valor: 180 }, { nome: 'Abr', valor: 140 },
    { nome: 'Mai', valor: 95  },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Seu Painel 🌱</Text>
        <TouchableOpacity onPress={() => signOut(auth)}><Text style={styles.sair}>Sair</Text></TouchableOpacity>
      </View>
      
      <View style={styles.cardResumo}>
        <Text style={styles.cardLabels}>Consumo do Mês Atual</Text>
        <Text style={styles.cardValor}>140 kWh</Text>
        <Text style={styles.cardSub}>Previsão da conta: R$ 112,00</Text>
      </View>

      <Text style={styles.subtitulo}>Histórico de Consumo (kWh)</Text>
      
      <View style={styles.graficoContainer}>
        {meses.map((mes, index) => (
          <View key={index} style={styles.barraColuna}>
            <View style={styles.barraFundo}>
              <View style={[styles.barraProgresso, { height: `${(mes.valor / 200) * 100}%` }]} />
            </View>
            <Text style={styles.barraTexto}>{mes.nome}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginVertical: 15 },
  sair: { color: '#d32f2f', fontWeight: 'bold' },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginVertical: 15 },
  cardResumo: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#4CAF50', marginBottom: 20 },
  cardLabels: { color: '#aaa', fontSize: 14 },
  cardValor: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 5 },
  cardSub: { color: '#81C784', fontSize: 14 },
  graficoContainer: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 220 },
  barraColuna: { alignItems: 'center', flex: 1 },
  barraFundo: { height: 130, width: 14, backgroundColor: '#333', borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  barraProgresso: { width: '100%', backgroundColor: '#4CAF50', borderRadius: 7 },
  barraTexto: { color: '#fff', fontSize: 12, marginTop: 8, fontWeight: '600' }
});