import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MapaDescarteScreen() {
  const router = useRouter();

  const pontosDescarte = [
    { id: '1', nome: 'EcoPonto Central', endereco: 'Rua Principal, 120 - Centro', tipo: 'Eletrônicos e Pilhas' },
    { id: '2', nome: 'Cooperativa ReciclaAvaré', endereco: 'Av. Industrial, 500 - Distrito', tipo: 'Eletrodomésticos e Metais' },
    { id: '3', nome: 'Supermercado Verde (Ponto Coleta)', endereco: 'Praça da Matriz, s/n', tipo: 'Pilhas, Baterias e Lâmpadas' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Pontos de Descarte ♻️</Text>
      </View>

      <Text style={styles.subtitulo}>Encontre locais próximos para descarte consciente de equipamentos e resíduos tecnológicos.</Text>

      {pontosDescarte.map((ponto) => (
        <View key={ponto.id} style={styles.card}>
          <View style={styles.iconeContainer}>
            <Ionicons name="location" size={24} color="#4CAF50" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nomePonto}>{ponto.nome}</Text>
            <Text style={styles.enderecoPonto}>{ponto.endereco}</Text>
            <Text style={styles.tipoPonto}>Aceita: {ponto.tipo}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 15 },
  botaoVoltar: { marginRight: 15, padding: 5 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  subtitulo: { color: '#aaa', fontSize: 14, marginBottom: 25, lineHeight: 20 },
  card: { flexDirection: 'row', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  iconeContainer: { width: 45, height: 45, backgroundColor: '#252525', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoContainer: { flex: 1 },
  nomePonto: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  enderecoPonto: { color: '#ccc', fontSize: 13, marginBottom: 4 },
  tipoPonto: { color: '#4CAF50', fontSize: 12, fontWeight: '600' }
});