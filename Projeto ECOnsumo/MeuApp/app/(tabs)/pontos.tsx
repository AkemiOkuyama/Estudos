import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export default function PointsScreen() {
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) setPontos(docSnap.data().pontosTotais || 0);
    });
    return () => unsubscribe();
  }, []);

  const missoes = [
    { id: '1', titulo: 'Primeiro Aparelho', desc: 'Cadastre eletrodomésticos para monitorar o consumo.', recompensa: '+50 XP / item' },
    { id: '2', titulo: 'Meta de Consumo', desc: 'Fique abaixo de 100 kWh no fechamento do mês.', recompensa: '+500 XP / mês' },
  ];

  const valorDesconto = (pontos * 0.05).toFixed(2).replace('.', ',');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>EcoPontos 🪙</Text>
      <View style={styles.cardPontuacao}>
        <Text style={styles.labelTotal}>Seu Saldo Atual</Text>
        <Text style={styles.pontosTotal}>{pontos} XP</Text>
        <Text style={styles.subTotal}>Equivale a R$ {valorDesconto} em descontos!</Text>
      </View>
      <Text style={styles.sessaoTitulo}>Guia de Missões</Text>
      {missoes.map((item) => (
        <View key={item.id} style={styles.cardConquista}>
          <View style={{ flex: 1 }}>
            <Text style={styles.conquistaTitulo}>{item.titulo}</Text>
            <Text style={styles.conquistaDesc}>{item.desc}</Text>
          </View>
          <Text style={styles.conquistaPontos}>{item.recompensa}</Text>
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
  pontosTotal: { color: '#4CAF50', fontSize: 48, fontWeight: 'bold', marginVertical: 5 },
  subTotal: { color: '#81C784', fontSize: 14, fontWeight: '600' },
  sessaoTitulo: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginBottom: 15 },
  cardConquista: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#2c2c2c' },
  conquistaTitulo: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  conquistaDesc: { color: '#aaa', fontSize: 13, marginTop: 4 },
  conquistaPontos: { color: '#FFD700', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});