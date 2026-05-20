import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Eletrodomestico } from '../types';

export default function RelatoriosScreen() {
  const [dadosGrafico, setDadosGrafico] = useState<number[]>([0, 0, 0]); 

  useEffect(() => {
    const q = query(collection(db, 'aparelhos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let constantes = 0;
      let variaveis = 0;

      snapshot.forEach((doc) => {
        const ap = doc.data() as Eletrodomestico;
        const kwh = (ap.potenciaWatts / 1000) * (ap.tipo === 'constante' ? 720 : (ap.tempoUsoHoras || 0));
        if (ap.tipo === 'constante') constantes += kwh;
        else variaveis += kwh;
      });

      setDadosGrafico([constantes, variaveis, constantes + variaveis]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Análise de Consumo (kWh)</Text>

      <BarChart
        data={{
          labels: ['Fixos 24h', 'Eventuais', 'Total Geral'],
          datasets: [{ data: dadosGrafico }]
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" kWh"
        chartConfig={{
          backgroundColor: '#1E1E1E',
          backgroundGradientFrom: '#1E1E1E',
          backgroundGradientTo: '#1E1E1E',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.grafico}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  grafico: { marginVertical: 8, borderRadius: 16 }
});