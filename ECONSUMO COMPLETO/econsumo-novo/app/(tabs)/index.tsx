import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function DashboardScreen() {
  const [totalKwh, setTotalKwh] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  const TARIFA_KWH = 0.85; 

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setCarregando(false);
      return;
    }

    const q = query(collection(db, 'eletrodomesticos'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let soma = 0;
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as { potenciaWatts: number; horasPorDia: number };
        soma += (item.potenciaWatts * item.horasPorDia * 30) / 1000;
      });
      setTotalKwh(soma > 0 ? Number(soma.toFixed(1)) : 98.2);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const meses = useMemo(() => [
    { nome: 'Jan', valor: 185.5 },
    { nome: 'Fev', valor: 192.0 },
    { nome: 'Mar', valor: 160.2 },
    { nome: 'Abr', valor: 145.0 },
    { nome: 'Mai', valor: 132.8 },
    { nome: 'Jun', valor: 120.4 },
    { nome: 'Jul', valor: 125.0 },
    { nome: 'Ago', valor: 110.5 },
    { nome: 'Set', valor: totalKwh }, 
  ], [totalKwh]);

  const custoEstimado = (totalKwh * TARIFA_KWH).toFixed(2).replace('.', ',');
  const maiorValor = Math.max(...meses.map(m => m.valor), 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Painel ECOnsumo 🌱</Text>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={styles.sair}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.botaoMapa} onPress={() => router.push('/mapa' as any)}>
          <Ionicons name="map" size={20} color="#fff" />
          <Text style={styles.textoBotaoMapa}>Pontos de Descarte</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/pushNotifications' as any)} style={styles.botaoNotificacao}>
          <Ionicons name="notifications" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {carregando ? (            
        <View style={[styles.cardResumo, { justifyContent: 'center', alignItems: 'center', height: 120 }]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <View style={styles.cardResumo}>
          <Text style={styles.cardLabels}>Consumo de Setembro (Atual)</Text>
          <Text style={styles.cardValor}>{totalKwh} kWh</Text>
          <Text style={styles.cardSub}>Previsão da conta: R$ {custoEstimado}</Text>
        </View>
      )}

      <Text style={styles.subtitulo}>Evolução Anual de Consumo (kWh)</Text>
      
      <View style={styles.graficoContainer}>
        {meses.map((mes, index) => {
          const alturaBarra = (mes.valor / maiorValor) * 100;
          return (
            <View key={index} style={styles.barraColuna}>
              <View style={styles.barraFundo}>
                <View 
                  style={[
                    styles.barraProgresso, 
                    { height: `${Math.min(alturaBarra, 100)}%` },
                    index === meses.length - 1 ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#81C784' }
                  ]} 
                />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginVertical: 10 },
  sair: { color: '#d32f2f', fontWeight: 'bold', padding: 5 },
  menuContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  botaoMapa: { flex: 1, backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#4CAF50' },
  textoBotaoMapa: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginLeft: 8 },
  botaoNotificacao: { marginLeft: 10, padding: 14, backgroundColor: '#1E1E1E', borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginVertical: 15 },
  cardResumo: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#4CAF50', marginBottom: 20 },
  cardLabels: { color: '#aaa', fontSize: 14 },
  cardValor: { color: '#fff', fontSize: 34, fontWeight: 'bold', marginVertical: 5 },
  cardSub: { color: '#81C784', fontSize: 15, fontWeight: '600' },
  graficoContainer: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 220 },
  barraColuna: { alignItems: 'center', flex: 1 },
  barraFundo: { height: 130, width: 12, backgroundColor: '#333', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barraProgresso: { width: '100%', borderRadius: 6 },
  barraTexto: { color: '#fff', fontSize: 11, marginTop: 8, fontWeight: '600' }
});