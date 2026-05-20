import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function ChartsScreen() {
  const dados = [
    { setor: 'Geladeira', kwh: 60, cor: '#4CAF50' },
    { setor: 'Ar Condicionado', kwh: 45, cor: '#FF9800' },
    { setor: 'Chuveiro', kwh: 35, cor: '#E91E63' },
    { setor: 'Iluminação/Outros', kwh: 20, cor: '#00BCD4' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Análise de Consumo 📊</Text>
      <Text style={styles.subtitulo}>Distribuição de gastos por eletrodoméstico (kWh)</Text>

      <View style={styles.cardGrafico}>
        {dados.map((item, index) => (
          <View key={index} style={styles.itemLinha}>
            <View style={styles.labelContainer}>
              <Text style={styles.nomeSetor}>{item.setor}</Text>
              <Text style={styles.valorSetor}>{item.kwh} kWh</Text>
            </View>
            <View style={styles.barraFundo}>
              <View style={[styles.barraProgresso, { width: `${(item.kwh / 70) * 100}%`, backgroundColor: item.cor }]} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  subtitulo: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  cardGrafico: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12 },
  itemLinha: { marginBottom: 20 },
  labelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  nomeSetor: { color: '#fff', fontSize: 14, fontWeight: '500' },
  valorSetor: { color: '#aaa', fontSize: 14 },
  barraFundo: { height: 10, backgroundColor: '#333', borderRadius: 5, overflow: 'hidden' },
  barraProgresso: { height: '100%', borderRadius: 5 }
});