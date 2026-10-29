import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNotifications } from "../context/NotificationContext";

export default function PushNotifications() {
  const { historicoNotificacoes } = useNotifications();

  return (
    <View style={styles.container}>
      <Text style={styles.tituloApp}>🌱 Dicas ECOnsumo</Text>
      <Text style={styles.subtitulo}>Histórico de orientações para eficiência energética:</Text>

      <View style={styles.centroNotificacoes}>
        <Text style={styles.tituloCentro}>Feed Educativo</Text>
        
        {historicoNotificacoes.length === 0 ? (
          <Text style={styles.textoVazio}>Carregando dicas de consumo...</Text>
        ) : (
          <FlatList
            data={historicoNotificacoes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardNotificacao}>
                <View style={styles.HeaderCard}>
                  <Text style={styles.tituloNotificacao}>{item.title}</Text>
                  <Text style={styles.horarioNotificacao}>{item.horario}</Text>
                </View>
                <Text style={styles.corpoNotificacao}>{item.body}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingTop: 50, paddingHorizontal: 20 },
  tituloApp: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#4CAF50" },
  subtitulo: { fontSize: 13, textAlign: "center", color: "#aaa", marginBottom: 20, marginTop: 8 },
  centroNotificacoes: { flex: 1, backgroundColor: "#1E1E1E", borderRadius: 12, padding: 15, marginBottom: 30, borderWidth: 1, borderColor: '#333' },
  tituloCentro: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#333", paddingBottom: 8 },
  textoVazio: { textAlign: "center", color: "#888", marginTop: 20, fontSize: 14 },
  cardNotificacao: { backgroundColor: "#252525", padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#333" },
  HeaderCard: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  tituloNotificacao: { fontWeight: "bold", fontSize: 14, color: "#4CAF50", flex: 1, marginRight: 10 },
  horarioNotificacao: { fontSize: 10, color: "#aaa" },
  corpoNotificacao: { fontSize: 13, color: "#ddd", lineHeight: 18 }
});