import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function PointsScreen() {
  const conquistas = [
    { id: '1', titulo: 'Redução Consciente', desc: 'Ficou abaixo da meta mensal em Abril.', pontos: 150 },
    { id: '2', titulo: 'Horário de Pico Evitado', desc: 'Desligou aparelhos pesados às 18h.', pontos: 50 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>EcoPontos 🪙</Text>

      <View style={styles.cardPontuacao}>
        <Text style={styles.labelTotal}>Seu Saldo Atual</Text>
        <Text style={styles.pontosTotal}>200 pts</Text>
        <Text style={styles.subTotal}>Equivale a R$ 15,00 em descontos</Text>
      </View>

      <Text style={styles.sessaoTitulo}>Histórico de Economia</Text>
      {conquistas.map((item) => (
        <View key={item.id} style={styles.cardConquista}>
          <View style={{ flex: 1 }}>
            <Text style={styles.conquistaTitulo}>{item.titulo}</Text>
            <Text style={styles.conquistaDesc}>{item.desc}</Text>
          </View>
          <Text style={styles.conquistaPontos}>+{item.pontos} XP</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginVertical: 15 },
  cardPontuacao: { backgroundColor: '#1E1E1E', padding: 25, borderRadius: 12, alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#4CAF50' },
  labelTotal: { color: '#aaa', fontSize: 14 },
  pontosTotal: { color: '#4CAF50', fontSize: 42, fontWeight: 'bold', marginVertical: 5 },
  subTotal: { color: '#fff', fontSize: 12 },
  sessaoTitulo: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginBottom: 15 },
  cardConquista: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  conquistaTitulo: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  conquistaDesc: { color: '#aaa', fontSize: 12, marginTop: 2 },
  conquistaPontos: { color: '#4CAF50', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});