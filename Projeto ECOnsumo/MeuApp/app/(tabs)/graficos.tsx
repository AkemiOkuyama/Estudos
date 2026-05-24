import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, setDoc, increment } from 'firebase/firestore';

export default function ChartsScreen() {
  const [dados, setDados] = useState<any[]>([]);
  const [totalKwh, setTotalKwh] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [resgatando, setResgatando] = useState(false);
  const [metaResgatada, setMetaResgatada] = useState(false);

  const META_MENSAL = 100; 
  const cores = ['#4CAF50', '#FF9800', '#E91E63', '#00BCD4', '#9C27B0', '#F44336'];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'eletrodomesticos'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let somaTotal = 0;
      const listaFormatada: any[] = [];
      let corIndex = 0;

      snapshot.forEach((docSnap) => {
        const item = docSnap.data();
        const kwhMensal = (item.potenciaWatts * item.horasPorDia * 30) / 1000;
        somaTotal += kwhMensal;
        listaFormatada.push({ setor: item.nome, kwh: Number(kwhMensal.toFixed(1)), cor: cores[corIndex % cores.length] });
        corIndex++;
      });

      listaFormatada.sort((a, b) => b.kwh - a.kwh);
      setDados(listaFormatada);
      setTotalKwh(Number(somaTotal.toFixed(1)));
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const maiorConsumo = dados.length > 0 ? dados[0].kwh : 1;

  const resgatarRecompensa = async () => {
    setResgatando(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);

      await setDoc(userRef, {
        pontosTotais: increment(500)
      }, { merge: true });

      setMetaResgatada(true);
      Alert.alert('🏆 Sucesso!', 'Você manteve o consumo sob controle e ganhou +500 XP!');
    } catch (error: any) {
      console.log("Erro ao resgatar:", error);
      Alert.alert('Erro', 'Não foi possível resgatar a recompensa.');
    } finally {
      setResgatando(false);
    }
  };

  if (carregando) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#4CAF50" /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Análise de Consumo 📊</Text>
      <Text style={styles.subtitulo}>Distribuição de gastos por eletrodoméstico (Mensal)</Text>

      <View style={styles.cardGrafico}>
        {dados.length === 0 ? <Text style={{ color: '#aaa', textAlign: 'center' }}>Nenhum aparelho cadastrado.</Text> : dados.map((item, index) => (
          <View key={index} style={styles.itemLinha}>
            <View style={styles.labelContainer}><Text style={styles.nomeSetor}>{item.setor}</Text><Text style={styles.valorSetor}>{item.kwh} kWh</Text></View>
            <View style={styles.barraFundo}><View style={[styles.barraProgresso, { width: `${(item.kwh / maiorConsumo) * 100}%`, backgroundColor: item.cor }]} /></View>
          </View>
        ))}
      </View>

      <View style={styles.divisor} />
      <Text style={styles.tituloSecao}>Desafio do Mês 🎯</Text>
      <View style={styles.cardGamificacao}>
        <Text style={styles.metaTexto}>Meta: Manter consumo abaixo de {META_MENSAL} kWh</Text>
        <Text style={styles.totalTexto}>Consumo atual: <Text style={{ color: totalKwh > META_MENSAL ? '#F44336' : '#4CAF50' }}>{totalKwh} kWh</Text></Text>
        
        {totalKwh === 0 ? <Text style={styles.avisoTexto}>Cadastre aparelhos para participar.</Text> : totalKwh <= META_MENSAL ? (
          <TouchableOpacity style={[styles.botaoResgatar, metaResgatada && styles.botaoDesativado]} onPress={resgatarRecompensa} disabled={metaResgatada || resgatando}>
            {resgatando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>{metaResgatada ? 'Resgatada (500 XP) ✅' : 'Resgatar +500 XP 🎉'}</Text>}
          </TouchableOpacity>
        ) : <View style={styles.cardFalha}><Text style={styles.falhaTexto}>Consumo alto! Reduza para tentar novamente.</Text></View>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  subtitulo: { fontSize: 14, color: '#aaa', marginBottom: 20 },
  cardGrafico: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#2c2c2c' },
  itemLinha: { marginBottom: 20 },
  labelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  nomeSetor: { color: '#fff', fontSize: 14, fontWeight: '500' },
  valorSetor: { color: '#aaa', fontSize: 14, fontWeight: 'bold' },
  barraFundo: { height: 10, backgroundColor: '#333', borderRadius: 5, overflow: 'hidden' },
  barraProgresso: { height: '100%', borderRadius: 5 },
  divisor: { height: 1, backgroundColor: '#333', marginVertical: 25 },
  tituloSecao: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  cardGamificacao: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#4CAF50', marginBottom: 30 },
  metaTexto: { color: '#aaa', fontSize: 16, marginBottom: 5 },
  totalTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  avisoTexto: { color: '#888', fontStyle: 'italic', marginTop: 10 },
  botaoResgatar: { backgroundColor: '#FF9800', padding: 15, borderRadius: 8, alignItems: 'center' },
  botaoDesativado: { backgroundColor: '#333' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cardFalha: { backgroundColor: 'rgba(244, 67, 54, 0.1)', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#F44336' },
  falhaTexto: { color: '#ef5350', textAlign: 'center', fontWeight: '500' }
});