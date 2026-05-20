import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Eletrodomestico, InfoTarifa } from '../types';

export default function DashboardScreen() {
  const [aparelhos, setAparelhos] = useState<Eletrodomestico[]>([]);
  const [tarifa, setTarifa] = useState<InfoTarifa>({ bandeira: 'Verde', valorKwh: 0.65 });

  useEffect(() => {
    fetch('https://api.mocki.io/v1/ce5f60e2')
      .then(() => setTarifa({ bandeira: 'Amarela', valorKwh: 0.78 }))
      .catch(() => {});

    const q = query(collection(db, 'aparelhos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: Eletrodomestico[] = [];
      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() } as Eletrodomestico);
      });
      setAparelhos(lista);
    });

    return () => unsubscribe();
  }, []);

  const calcularConsumoMensal = () => {
    let totalKwh = 0;
    aparelhos.forEach(ap => {
      const horas = ap.tipo === 'constante' ? 720 : (ap.tempoUsoHoras || 0);
      totalKwh += (ap.potenciaWatts / 1000) * horas;
    });
    return totalKwh;
  };

  const consumoTotal = calcularConsumoMensal();
  const custoTotal = consumoTotal * tarifa.valorKwh;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saudacao}>Olá, Sustentável! 🌱</Text>
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Text style={styles.sair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardGeral}>
        <Text style={styles.cardTitulo}>Consumo Estimado (Mês)</Text>
        <Text style={styles.KwhDestaque}>{consumoTotal.toFixed(2)} <Text style={styles.unidade}>kWh</Text></Text>
        <Text style={styles.reaisDestaque}>R$ {custoTotal.toFixed(2)}</Text>
        <View style={[styles.badgeBandeira, { backgroundColor: tarifa.bandeira === 'Amarela' ? '#FFC107' : '#4CAF50' }]}>
          <Text style={styles.bandeiraTexto}>Bandeira Atual: {tarifa.bandeira}</Text>
        </View>
      </View>

      <View style={styles.odsCard}>
        <Text style={styles.odsTitulo}>💡 Dica de Eco-Saúde (ODS 3 & 12)</Text>
        <Text style={styles.odsTexto}>
          Desligar aparelhos em standby da tomada antes de dormir reduz o consumo fantasma em até 12% e diminui estímulos luminosos, melhorando suas noites de sono!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  saudacao: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  sair: { color: '#F44336', fontWeight: 'bold' },
  cardGeral: { backgroundColor: '#1E1E1E', padding: 25, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  cardTitulo: { color: '#aaa', fontSize: 16 },
  KwhDestaque: { color: '#4CAF50', fontSize: 42, fontWeight: 'bold', marginVertical: 10 },
  unidade: { fontSize: 20, color: '#fff' },
  reaisDestaque: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
  badgeBandeira: { paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, marginTop: 15 },
  bandeiraTexto: { color: '#121212', fontWeight: 'bold', fontSize: 12 },
  odsCard: { backgroundColor: '#1A237E', padding: 15, borderRadius: 10, marginTop: 10 },
  odsTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
  odsTexto: { color: '#E0E0E0', fontSize: 13, lineHeight: 18 }
});