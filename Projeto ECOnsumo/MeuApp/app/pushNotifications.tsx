import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNotifications } from "../context/NotificationContext";

export default function PushNotifications() {
  const { historicoNotificacoes } = useNotifications();

  return (
    <View style={styles.container}>
      <Text style={styles.tituloApp}>🌱 ECOnotificações</Text>
      <Text style={styles.subtitulo}>Algumas dicas se acumulam aqui para te ajudar na sua conscientização de uso:</Text>

      <View style={styles.centroNotificacoes}>
        <Text style={styles.tituloCentro}> Centro de Notificações</Text>
        
        {historicoNotificacoes.length === 0 ? (
          <Text style={styles.textoVazio}>Nenhuma dica recebida por enquanto... Mas volte daqui a pouco!</Text>
        ): 
        (
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
  container: { 
    flex: 1,
    backgroundColor: "#f4f6f9", 
    paddingTop: 70, 
    paddingHorizontal: 25, 
  },

  tituloApp: { 
    fontSize: 22, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#2e7d32",
 },

  subtitulo: { 
    fontSize: 14, 
    textAlign: "center", 
    color: "#666", 
    marginBottom: 20, 
    marginTop: 15,
  },

  centroNotificacoes: { 
    flex: 1, 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    padding: 15, 
    elevation: 2,
    marginBottom: 100,
  },

  tituloCentro: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333", 
    marginBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee", 
    paddingBottom: 5 
  },

  textoVazio: { 
    textAlign: "center", 
    color: "#999", 
    marginTop: 20, 
    fontSize: 14 
  },

  cardNotificacao: { 
    backgroundColor: "#f9f9f9", 
    padding: 12, borderRadius: 8, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#e0e0e0" 
  },

  HeaderCard: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 4,
  },

  tituloNotificacao: { 
    fontWeight: "bold", 
    fontSize: 14, 
    color: "#333" ,
    flex: 1,
    marginRight: 10,
  },

  horarioNotificacao: { 
    fontSize: 10, 
    color: "#999",
  },

  corpoNotificacao: { 
    fontSize: 13, 
    color: "#555", 
    lineHeight: 18 
  },
});