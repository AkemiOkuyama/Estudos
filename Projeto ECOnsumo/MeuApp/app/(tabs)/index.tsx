import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function DashboardScreen() {
  const [totalKwh, setTotalKwh] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const TARIFA_KWH = 0.85; 

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'eletrodomesticos'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let soma = 0;
      snapshot.forEach((docSnap) => {
        const item = docSnap.data();
        soma += (item.potenciaWatts * item.horasPorDia * 30) / 1000;
      });
      setTotalKwh(Number(soma.toFixed(1)));
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const meses = [
    { nome: 'Jan', valor: 120 }, { nome: 'Fev', valor: 150 },
    { nome: 'Mar', valor: 180 }, { nome: 'Abr', valor: 140 },
    { nome: 'Mai', valor: totalKwh }, 
  ];

  const custoEstimado = (totalKwh * TARIFA_KWH).toFixed(2).replace('.', ',');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Seu Painel 🌱</Text>
        <TouchableOpacity onPress={() => signOut(auth)}><Text style={styles.sair}>Sair</Text></TouchableOpacity>
      </View>
      
      {carregando ? (
        <View style={[styles.cardResumo, { justifyContent: 'center', alignItems: 'center', height: 120 }]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <View style={styles.cardResumo}>
          <Text style={styles.cardLabels}>Consumo do Mês Atual</Text>
          <Text style={styles.cardValor}>{totalKwh} kWh</Text>
          <Text style={styles.cardSub}>Previsão da conta: R$ {custoEstimado}</Text>
        </View>
      )}

      <Text style={styles.subtitulo}>Histórico de Consumo (kWh)</Text>
      
      <View style={styles.graficoContainer}>
        {meses.map((mes, index) => {
          const alturaBarra = mes.valor > 250 ? 100 : (mes.valor / 250) * 100;
          return (
            <View key={index} style={styles.barraColuna}>
              <View style={styles.barraFundo}>
                <View style={[ styles.barraProgresso, { height: `${alturaBarra}%` }, index === meses.length - 1 && { backgroundColor: '#4CAF50' }, index !== meses.length - 1 && { backgroundColor: '#81C784' } ]} />
              </View>
              <Text style={styles.barraTexto}>{mes.nome}</Text>
            </View>
          )
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginVertical: 15 },
  sair: { color: '#d32f2f', fontWeight: 'bold', padding: 5 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginVertical: 15 },
  cardResumo: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#4CAF50', marginBottom: 20 },
  cardLabels: { color: '#aaa', fontSize: 14 },
  cardValor: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginVertical: 5 },
  cardSub: { color: '#81C784', fontSize: 15, fontWeight: '600' },
  graficoContainer: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 220 },
  barraColuna: { alignItems: 'center', flex: 1 },
  barraFundo: { height: 130, width: 14, backgroundColor: '#333', borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  barraProgresso: { width: '100%', borderRadius: 7 },
  barraTexto: { color: '#fff', fontSize: 12, marginTop: 8, fontWeight: '600' }
});