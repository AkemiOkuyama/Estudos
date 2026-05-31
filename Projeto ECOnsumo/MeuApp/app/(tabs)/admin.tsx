import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';

export default function AdminScreen() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  const buscarUsuarios = async () => {
    setCarregando(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      
      let lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      lista.sort((a: any, b: any) => {
      const pontosA = Number(a.pontosTotais) || 0;
      const pontosB = Number(b.pontosTotais) || 0;
      return pontosB - pontosA;
    });
      
      setUsuarios(lista);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert("Erro", "Falha ao sair.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Painel Admin ⚙️</Text>
        <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitulo}>Lista Geral de Usuários:</Text>

      {carregando ? (
        <ActivityIndicator color="#4CAF50" size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList 
          data={usuarios} 
          keyExtractor={(item) => item.id} 
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.userEmail}>{item.email || 'Usuário sem e-mail'}</Text>
                <Text style={styles.userRole}>
                  Cargo: {item.role ? item.role.toUpperCase() : 'CLIENTE'}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.pontosTexto}>{item.pontosTotais || 0} XP</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{color: '#888', textAlign: 'center', marginTop: 20}}>Nenhum usuário cadastrado.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitulo: { fontSize: 16, color: '#FFD700', marginBottom: 15, fontWeight: 'bold' },
  botaoSair: { backgroundColor: '#d32f2f', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  botaoSairTexto: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  info: { flex: 1 },
  userEmail: { color: '#fff', fontSize: 15, fontWeight: '600' },
  userRole: { fontSize: 11, color: '#aaa', marginTop: 4 },
  badge: { backgroundColor: '#2e3d2e', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#4CAF50' },
  pontosTexto: { color: '#4CAF50', fontWeight: 'bold' }
});